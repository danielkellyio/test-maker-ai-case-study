export const useFavorites = () => {
  const favorites = ref<string[]>([]);
  const { loggedIn } = useUserSession();

  const fetchFavorites = async () => {
    if (!loggedIn.value) return;
    try {
      favorites.value = await $fetch("/api/favorites");
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const addFavorite = async (postId: string) => {
    if (!loggedIn.value) return;
    try {
      favorites.value = await $fetch(`/api/favorites/${postId}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (postId: string) => {
    if (!loggedIn.value) return;
    try {
      favorites.value = await $fetch(`/api/favorites/${postId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const isFavorite = computed(
    () => (postId: string) => favorites.value.includes(postId)
  );

  onMounted(() => {
    fetchFavorites();
  });

  watch(loggedIn, (newValue) => {
    if (newValue) {
      fetchFavorites();
    } else {
      favorites.value = [];
    }
  });

  return {
    favorites: readonly(favorites),
    isFavorite,
    addFavorite,
    removeFavorite,
    fetchFavorites,
  };
};
