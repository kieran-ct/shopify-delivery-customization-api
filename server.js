// server.js
import express from "express";
import path from "path"; // Keep path, but we might not need dirname or fileURLToPath if process.cwd() is sufficient
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import dotenv from "dotenv";

dotenv.config();

// Define the directories for the build and public assets
// process.cwd() is fine in ESM and returns the current working directory from where Node was started.
// This should be your project root in most deployment scenarios.
const BUILD_DIR = path.join(process.cwd(), "build");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// --- THE CRITICAL CHANGE ---
// Load the Remix build using ESM import.
// The path needs to be relative or absolute from the perspective of this server.js file
// OR a resolvable module name.
// If server.js is at the root and 'build' is a sibling:
import * as build from './build/index.js'; // Ensure this path is correct relative to server.js
// If your build output is different, adjust 'build/index.js' accordingly.

const app = express();
app.use(compression());
app.use(morgan("tiny")); // It's good practice to disable 'x-powered-by' app.disable('x-powered-by');

// Serve Remix static assets (JS/CSS/images) under /build
// This path seems to assume that your Remix build process outputs its client-side assets
// into a 'build' subdirectory *inside* your top-level 'public' directory.
// e.g., your project has public/build/assets.js
// This is a common setup for some Remix configurations.
app.use(
  "/build",
  express.static(path.join(PUBLIC_DIR, "build"), { // This should be correct if assets are in public/build
    immutable: true,
    maxAge: "1y",
  })
);

// Serve other public files (like favicon.ico, robots.txt from the top-level 'public' directory)
app.use(express.static(PUBLIC_DIR, { index: false }));

// All other routes go to Remix
app.all(
  "*",
  createRequestHandler({
    build, // This 'build' now comes from the ESM import
    getLoadContext(_req, _res) { // The function signature for getLoadContext often includes req and res
      return {}; // add any context you need
    },
    mode: process.env.NODE_ENV, // It's good to explicitly pass the mode
  })
);

const port = process.env.PORT || 3000; // Elastic Beanstalk will set PORT
app.listen(port, () => {
  // Using console.info or console.log is fine
  console.log(`✅ Server listening on http://localhost:${port} in ${process.env.NODE_ENV || 'development'} mode`);
});