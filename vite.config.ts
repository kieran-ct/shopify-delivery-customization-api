import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    // 1) Strip out Shopify’s JSON import assertions
    {
      name: "strip-import-assertions",
      enforce: "pre",
      transform(code, id) {
        if (id.includes("node_modules/@shopify/shopify-app-remix")) {
          return code.replace(/with\s*\{\s*type:\s*['\"]json['\"]\s*\};?/g, "");
        }
      },
    },

    // 2) Copy Polaris CSS into the public build directory
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@shopify/polaris/build/esm/styles.css',
          dest: 'public/build',
        },
      ],
    }),

    // 3) Official Remix Vite plugin
    remix(),

    // 4) Use your tsconfig path aliases
    tsconfigPaths(),
  ],

  resolve: {
    alias: {
      // Redirect CSS?url imports to the copied CSS file
      '@shopify/polaris/build/esm/styles.css?url': '/build/styles.css',
    },
  },

  build: {
    target: "es2020",
    sourcemap: true,
  },
});
