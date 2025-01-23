// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/supabase",
    "@nuxtjs/mdc",
  ],
  content: {
    // Optional: Configure content module
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
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
    domains: ["avatars.githubusercontent.com"],
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    storage: {
      logs: {
        driver: "fs",
        base: "./.data/logs",
      },
    },
    scheduledTasks: {
      "* * * * *": ["scannedPages:process"],
    },
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  supabase: {
    redirectOptions: {
      exclude: ["/login", "/register", "/"],
      login: "/login",
      callback: "/confirm",
      cookieRedirect: false,
    },
  },
});
