import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const VIEWER_HTML_PATH = path.join(__dirname, "viewer2.html");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", async (req, res) => {
  const { file } = req.query;

  if (!file) {
    return res.status(400).send("Missing required query parameter: file");
  }

  try {
    const html = await fs.readFile(VIEWER_HTML_PATH, "utf8");
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load viewer: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`WCAX viewer server running at http://localhost:${PORT}`);
  console.log(
    `Example: http://localhost:${PORT}/?file=https://example.com/report.wcax`,
  );
});
