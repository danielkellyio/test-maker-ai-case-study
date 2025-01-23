import { scannedPagesTable } from "~/server/db/schema";
import { eq, inArray } from "drizzle-orm";

export type PageStatus = typeof scannedPagesTable.$inferSelect.status;

export function useScannedPagesService() {
  const db = useDb();

  /**
   * Insert pages
   * @param pages
   * @returns
   */
  function insertPages(pages: (typeof scannedPagesTable.$inferInsert)[]) {
    return db.insert(scannedPagesTable).values(pages);
  }

  /**
   * Get pending pages
   * @returns
   */
  function getPendingPages() {
    return db
      .select()
      .from(scannedPagesTable)
      .where(eq(scannedPagesTable.status, "pending"));
  }

  /**
   * Set page status
   * @param pageId
   * @param status
   */
  async function setPageStatus(pageId: string, status: PageStatus) {
    console.log("Setting page status to " + status + " for page " + pageId);
    const db = useDb();
    const res = await db
      .update(scannedPagesTable)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(scannedPagesTable.id, pageId))
      .returning();
    return res.at(0);
  }

  /**
   * Get page
   * @param pageOrPageId
   * @returns
   */
  async function getPage(
    pageOrPageId: typeof scannedPagesTable.$inferSelect | string
  ) {
    const page =
      typeof pageOrPageId === "string"
        ? await db
            .select()
            .from(scannedPagesTable)
            .where(eq(scannedPagesTable.id, pageOrPageId))
            .limit(1)
            .then((rows) => rows[0])
        : pageOrPageId;
    return page;
  }

  /**
   * Extract page text
   * @param pageOrPageId
   * @returns
   */
  async function extractPageText(
    pageOrPageId: typeof scannedPagesTable.$inferSelect | string
  ) {
    const pageId =
      typeof pageOrPageId === "string" ? pageOrPageId : pageOrPageId.id;
    try {
      // get the page
      const page = await getPage(pageOrPageId);

      // if the page has no image, we can't extract text
      // set the status to failed and throw an error
      if (!page?.pageImage) {
        throw createError({
          statusCode: 500,
          statusMessage: "Scanned Page has no image",
        });
      }

      // base64 encode the image from the pageImage url
      const imageResponse = await $fetch<ArrayBuffer>(page.pageImage, {
        responseType: "arrayBuffer",
      });
      const base64Image = Buffer.from(imageResponse).toString("base64");

      // extract the text from the page image
      const aiResponse = await useAnthropicService().extractTextFromImage(
        base64Image
      );

      // if the extraction is successful, update the page with the extracted text
      return await updatePage(page.id, {
        pageNumber: aiResponse.pageNumber,
        pageText: aiResponse.text,
        status: "completed",
      });
    } catch (error) {
      // if the extraction fails, set the status to failed and throw an error
      await setPageStatus(pageId, "failed");
      throw error;
    }
  }

  async function updatePage(
    pageId: string,
    page: Partial<typeof scannedPagesTable.$inferInsert>
  ) {
    const result = await db
      .update(scannedPagesTable)
      .set(page)
      .where(eq(scannedPagesTable.id, pageId))
      .returning();
    return result.at(0);
  }

  /**
   * Get pages
   * @param pageIdOrIds
   * @returns
   */
  function getPages(pageIdOrIds: string | string[]) {
    const pageIds = Array.isArray(pageIdOrIds) ? pageIdOrIds : [pageIdOrIds];
    return db
      .select()
      .from(scannedPagesTable)
      .where(inArray(scannedPagesTable.id, pageIds));
  }

  async function pagesHaveBeenProccessed(pageIdOrIds: string | string[]) {
    const pages = await getPages(pageIdOrIds);
    return pages.some(
      (page) => page.status !== "pending" && page.status !== "processing"
    );
  }

  return {
    getPendingPages,
    setPageStatus,
    extractPageText,
    insertPages,
    getPages,
    pagesHaveBeenProccessed,
  };
}
