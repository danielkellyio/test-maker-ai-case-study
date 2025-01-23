import { z } from "zod";
import { useAnthropicService } from "~/server/utils/services";
import { scannedPagesTable } from "~/server/db/schema";
import { userIsAuthenticatedGuard } from "@/server/utils";
import { serverSupabaseUser } from "#supabase/server";

export default defineApiEventHandler({
  /**
   * @param images - Array of image urls
   */
  validation: z.object({
    images: z.array(z.string()), // Array of image urls
  }),
  /**
   * Require user to be authenticated
   */
  guards: [userIsAuthenticatedGuard],

  /**
   * Event handler
   * returns an array of scanned pages with their extracted text
   */
  async handler(event, payload) {
    const anthropicService = useAnthropicService();
    const db = useDb();
    const user = await serverSupabaseUser(event);
    const images = await Promise.all(
      payload.images.map(async (imageUrl) => {
        const image = await fetch(imageUrl);
        return image;
      })
    );

    // Convert fetched images to base64
    const base64Images = await Promise.all(
      images.map(async (imageResponse) => {
        // Get the image data as an array buffer
        const arrayBuffer = await imageResponse.arrayBuffer();
        // Convert array buffer to base64 string
        const base64String = Buffer.from(arrayBuffer).toString("base64");
        return base64String;
      })
    );

    // Process each image sequentially and collect results
    const results = await Promise.all(
      base64Images.map(async (imageBase64) => {
        const result = await anthropicService.extractTextFromImage(imageBase64);
        return result;
      })
    );

    const scannedPages = await db
      .insert(scannedPagesTable)
      .values(
        results.map((result, i) => {
          return {
            pageText: result.text,
            pageImage: payload.images[i],
            pageNumber: result.pageNumber,
          };
        })
      )
      .returning();

    return scannedPages;
  },
});
