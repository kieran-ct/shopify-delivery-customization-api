// server.js
import express from "express";
import path from "path";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import dotenv from "dotenv";

dotenv.config();
const BUILD_DIR = path.join(process.cwd(), "build");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const app = express();
app.use(compression());
app.use(morgan("tiny"));

// 1) Serve Remix static assets (JS/CSS/images) under /build
app.use(
  "/build",
  express.static(path.join(PUBLIC_DIR, "build"), {
    immutable: true,
    maxAge: "1y",
  })
);

// 2) Serve other public files
app.use(express.static(PUBLIC_DIR));

// 3) All other routes go to Remix
app.all(
  "*",
  createRequestHandler({
    build: require(BUILD_DIR),
    getLoadContext() {
      return {}; // add any context you need here
    },
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server listening on http://localhost:${port}`);
});
