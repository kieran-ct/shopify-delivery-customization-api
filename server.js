// server.js
import Module from 'module';
import express from "express";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import dotenv from "dotenv";

dotenv.config();

// Patch require to handle Polaris CSS import
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === '@shopify/polaris/build/esm/styles.css?url') {
    // Return the public URL for the copied CSS file
    return '/build/styles.css';
  }
  return originalRequire.call(this, id);
};

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_DIR = path.join(process.cwd(), "build");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const app = express();
app.use(compression());
app.use(morgan("tiny"));

// Serve Remix static assets under /build
app.use(
  "/build",
  express.static(path.join(PUBLIC_DIR, "build"), {
    immutable: true,
    maxAge: "1y",
  })
);

// Serve other public files
app.use(express.static(PUBLIC_DIR));

// Helper to dynamically import the correct build file
async function loadBuild() {
  const buildFile = path.join(BUILD_DIR, "index.cjs");
  const buildUrl = pathToFileURL(buildFile).href;
  const buildModule = await import(buildUrl);
  return buildModule.default ?? buildModule;
}

// All other routes go to Remix
app.all("*", async (req, res, next) => {
  try {
    const build = await loadBuild();
    return createRequestHandler({
      build,
      getLoadContext() {
        return {}; // add any context you need here
      },
    })(req, res, next);
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server listening on http://localhost:${port}`);
});
