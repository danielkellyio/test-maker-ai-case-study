// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
  ],
  content: {
    // Optional: Configure content module
    highlight: {
      theme: "github-dark",
    },
  },
  colorMode: {
    classSuffix: "",
  },
  runtimeConfig: {
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      },
    },
  },
  image: {
    domains: [],
  },
});
