import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";  // ← correct import
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // 1) Strip out Shopify’s JSON import assertions
    {
      name: "strip-import-assertions",
      enforce: "pre",
      transform(code, id) {
        if (id.includes("node_modules/@shopify/shopify-app-remix")) {
          return code.replace(/with\s*\{\s*type:\s*['"]json['"]\s*\};?/g, "");
        }
      },
    },

    // 2) Official Remix Vite plugin
    remix(),

    // 3) Use your tsconfig path aliases
    tsconfigPaths(),
  ],

  build: {
    target: "es2020",
    sourcemap: true,
  },
});
