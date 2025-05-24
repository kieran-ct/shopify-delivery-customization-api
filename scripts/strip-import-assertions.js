// scripts/strip-import-assertions.js
/**
 * This script removes any "with { type: 'json' }" import assertions
 * from Shopify’s ESM code so esbuild can parse it.
 */
import fs from "fs";
import path from "path";

// Path to the problematic file in node_modules
const target = path.resolve(
  "node_modules",
  "@shopify",
  "shopify-app-remix",
  "dist",
  "esm",
  "react",
  "components",
  "AppProvider",
  "AppProvider.mjs"
);

let content = fs.readFileSync(target, "utf8");
// Remove import assertions like: `with { type: 'json' };`
content = content.replace(/with\s*\{\s*type:\s*['"]json['"]\s*\};?/g, "");

// Overwrite the file
fs.writeFileSync(target, content, "utf8");
console.log("✅ Stripped import assertions from AppProvider.mjs");
