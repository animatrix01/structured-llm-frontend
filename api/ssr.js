// Vercel serverless function — proxies all requests to the TanStack Start
// SSR server built into dist/server/server.js

import { createServer } from "node:http";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const serverPath = join(__dirname, "../dist/server/server.js");

let handler;

async function loadHandler() {
  if (!handler) {
    const mod = await import(serverPath);
    handler = mod.default ?? mod;
  }
  return handler;
}

export default async function (req, res) {
  const h = await loadHandler();

  // Convert Node IncomingMessage → Web Request
  const url = `https://${req.headers.host}${req.url}`;
  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await new Promise((resolve) => {
          const chunks = [];
          req.on("data", (c) => chunks.push(c));
          req.on("end", () => resolve(Buffer.concat(chunks)));
        })
      : undefined;

  const webReq = new Request(url, {
    method: req.method,
    headers: req.headers,
    body,
    duplex: "half",
  });

  const webRes = await h.fetch(webReq, {}, {});

  res.statusCode = webRes.status;
  webRes.headers.forEach((value, key) => res.setHeader(key, value));
  const buffer = await webRes.arrayBuffer();
  res.end(Buffer.from(buffer));
}
