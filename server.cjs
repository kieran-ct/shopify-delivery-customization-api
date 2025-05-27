// server.js
import express from "express";
import path from "path";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import dotenv from "dotenv";

dotenv.config();

// Define the directories for the build and public assets
const BUILD_DIR = path.join(process.cwd(), "build");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Load the Remix build using CommonJS require
const build = require(path.join(BUILD_DIR, "index"));

const app = express();
app.use(compression());
app.use(morgan("tiny"));

// Serve Remix static assets (JS/CSS/images) under /build
app.use(
  "/build",
  express.static(path.join(PUBLIC_DIR, "build"), {
    immutable: true,
    maxAge: "1y",
  })
);

// Serve other public files (no index fallback)
app.use(express.static(PUBLIC_DIR, { index: false }));

// All other routes go to Remix
app.all(
  "*",
  createRequestHandler({
    build,
    getLoadContext() {
      return {}; // add any context you need
    },
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server listening on http://localhost:${port}`);
});
