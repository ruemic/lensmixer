import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const expectedHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; upgrade-insecure-requests",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), interest-cohort=(), browsing-topics=()",
};

function parseRootHeaders(source) {
  const headers = new Map();
  let inRootRule = false;

  for (const line of source.split(/\r?\n/)) {
    if (line.trim() === "/*") {
      inRootRule = true;
      continue;
    }

    if (!inRootRule) continue;
    if (line && !line.startsWith(" ") && !line.startsWith("\t")) break;

    const match = line.trim().match(/^([^:]+):\s*(.+)$/);
    if (match) headers.set(match[1], match[2]);
  }

  return headers;
}

test("LensMixer static headers declare the browser hardening baseline", () => {
  const headers = parseRootHeaders(readFileSync("public/_headers", "utf8"));

  for (const [name, value] of Object.entries(expectedHeaders)) {
    assert.equal(headers.get(name), value);
  }
});
