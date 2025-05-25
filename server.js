// server.js
import express from "express";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import dotenv from "dotenv";

dotenv.config();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_DIR = path.join(process.cwd(), "build");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const app = express();

app.use(compression());
app.use(morgan("tiny"));

// 1) Serve Remix static assets under /build
app.use(
  "/build",
  express.static(path.join(PUBLIC_DIR, "build"), {
    immutable: true,
    maxAge: "1y",
  })
);

// 2) Serve other public files
app.use(express.static(PUBLIC_DIR));

// 3) All other routes go to Remix, loading the build dynamically
app.all("*", async (req, res, next) => {
  try {
    // Dynamic ESM import of the compiled Remix build
    const buildUrl = pathToFileURL(path.join(BUILD_DIR, "index.js")).href;
    const buildModule = await import(buildUrl);
    const build = buildModule.default ?? buildModule;

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
