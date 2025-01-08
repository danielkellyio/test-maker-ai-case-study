// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  }
  // Your custom configs here
);
