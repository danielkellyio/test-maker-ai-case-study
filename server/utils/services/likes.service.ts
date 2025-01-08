import { useStorage } from "#imports";

interface LikeToggleResponse {
  likes: string[];
  isLiked: boolean;
}

/**
 * Service for managing post likes
 */
export const useLikesService = () => {
  const storage = useStorage("likes");

  return {
    /**
     * Add a like to a post
     * @param postId - The ID of the post to like
     * @param userId - The ID of the user adding the like
     * @returns Array of user IDs who liked the post
     */
    async addLike(postId: string, userId: string): Promise<string[]> {
      const key = `post:${postId}`;
      const likes = (await storage.getItem<string[]>(key)) || [];

      // Don't add duplicate likes
      if (!likes.includes(userId)) {
        likes.push(userId);
        await storage.setItem(key, likes);
      }

      return likes;
    },

    /**
     * Remove a like from a post
     * @param postId - The ID of the post to unlike
     * @param userId - The ID of the user removing their like
     * @returns Array of remaining user IDs who liked the post
     */
    async removeLike(postId: string, userId: string): Promise<string[]> {
      const key = `post:${postId}`;
      const likes = (await storage.getItem<string[]>(key)) || [];

      const updatedLikes = likes.filter((id) => id !== userId);
      await storage.setItem(key, updatedLikes);

      return updatedLikes;
    },

    /**
     * Get all likes for a post
     * @param postId - The ID of the post to get likes for
     * @returns Array of user IDs who liked the post
     */
    async getLikes(postId: string): Promise<string[]> {
      const key = `post:${postId}`;
      return (await storage.getItem<string[]>(key)) || [];
    },

    /**
     * Toggle like status for a post
     * @param postId - The ID of the post to toggle like status for
     * @param userId - The ID of the user toggling their like
     * @returns Object containing updated likes array and new like status
     */
    async toggleLike(
      postId: string,
      userId: string
    ): Promise<LikeToggleResponse> {
      const key = `post:${postId}`;
      const likes = (await storage.getItem<string[]>(key)) || [];

      const isLiked = likes.includes(userId);
      let updatedLikes: string[];

      if (isLiked) {
        updatedLikes = likes.filter((id) => id !== userId);
      } else {
        updatedLikes = [...likes, userId];
      }

      await storage.setItem(key, updatedLikes);

      return {
        likes: updatedLikes,
        isLiked: !isLiked,
      };
    },
  };
};
