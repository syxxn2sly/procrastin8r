#!/usr/bin/env node
/**
 * Draws the app icon set from scratch — no design tool, no binary blobs in git
 * that nobody can regenerate. Run `node scripts/make-icons.mjs` after changing
 * the palette and the icons follow.
 *
 * The mark is the Next 3: three rows, the top one live and the two below it
 * waiting. It reads as a list down to the smallest size iOS renders.
 */

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), "../assets/images");
mkdirSync(outDir, { recursive: true });

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const BG = hex("#18181b");
const LIVE = hex("#cfd3e5");
const ACCENT = hex("#9397ab");
const DIM = hex("#3f424d");
const DIMMER = hex("#2f3138");

// ── tiny PNG encoder ────────────────────────────────────────────────────────

const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

/** @param {Uint8Array} rgb packed RGB, size*size*3 */
function encodePng(rgb, size) {
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0; // filter: none
    rgb.subarray(y * size * 3, (y + 1) * size * 3).forEach((v, i) => {
      raw[y * (size * 3 + 1) + 1 + i] = v;
    });
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── drawing ─────────────────────────────────────────────────────────────────

function draw(size, { bg = BG } = {}) {
  const px = new Uint8Array(size * size * 3);
  const S = size / 1024; // everything below is authored at 1024

  const put = (x, y, c, a = 1) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 3;
    for (let k = 0; k < 3; k++) px[i + k] = Math.round(px[i + k] * (1 - a) + c[k] * a);
  };

  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) put(x, y, bg, 1);

  /** Rounded rect with a 1px-ish analytic edge, so it stays smooth when scaled. */
  const roundRect = (cx, cy, w, h, r, color) => {
    const x0 = cx - w / 2;
    const y0 = cy - h / 2;
    for (let y = Math.floor(y0) - 2; y < Math.ceil(y0 + h) + 2; y++) {
      for (let x = Math.floor(x0) - 2; x < Math.ceil(x0 + w) + 2; x++) {
        const dx = Math.max(x0 + r - x, 0, x - (x0 + w - r));
        const dy = Math.max(y0 + r - y, 0, y - (y0 + h - r));
        const d = Math.hypot(dx, dy) - r;
        if (d < 0.5) put(x, y, color, Math.min(1, 0.5 - d));
      }
    }
  };

  const ring = (cx, cy, radius, thickness, color) => {
    // The band reaches radius + thickness/2, so the scan box has to as well —
    // bounding it at radius alone clips the outer edge into an octagon.
    const reach = radius + thickness / 2 + 2;
    for (let y = Math.floor(cy - reach); y < Math.ceil(cy + reach); y++) {
      for (let x = Math.floor(cx - reach); x < Math.ceil(cx + reach); x++) {
        const d = Math.abs(Math.hypot(x - cx, y - cy) - radius) - thickness / 2;
        if (d < 0.5) put(x, y, color, Math.min(1, 0.5 - d));
      }
    }
  };

  const disc = (cx, cy, radius, color) => {
    for (let y = Math.floor(cy - radius - 2); y < Math.ceil(cy + radius + 2); y++) {
      for (let x = Math.floor(cx - radius - 2); x < Math.ceil(cx + radius + 2); x++) {
        const d = Math.hypot(x - cx, y - cy) - radius;
        if (d < 0.5) put(x, y, color, Math.min(1, 0.5 - d));
      }
    }
  };

  const rows = [
    { y: 340, barW: 430, bar: LIVE, mark: ACCENT, filled: true },
    { y: 512, barW: 370, bar: DIM, mark: DIM, filled: false },
    { y: 684, barW: 300, bar: DIMMER, mark: DIMMER, filled: false },
  ];

  // Centre the block on the canvas: the widest row runs from the mark's left
  // edge to the end of the top bar, and that span is what gets centred.
  const left = 320 - 52;
  const right = 320 + 110 + Math.max(...rows.map((r) => r.barW));
  const shift = (1024 - (right - left)) / 2 - left;

  for (const row of rows) {
    const cy = row.y * S;
    const markX = (320 + shift) * S;
    const markR = 52 * S;

    if (row.filled) {
      disc(markX, cy, markR, row.mark);
      // the check, as two strokes
      const t = 22 * S;
      // The check is punched out of the disc in the background colour, which
      // keeps the mark to two tones at any size.
      const stroke = (ax, ay, bx, by) => {
        const steps = Math.hypot(bx - ax, by - ay) * 2;
        for (let i = 0; i <= steps; i++) {
          const x = ax + ((bx - ax) * i) / steps;
          const y = ay + ((by - ay) * i) / steps;
          disc(x, y, t / 2, BG);
        }
      };
      stroke(markX - 22 * S, cy, markX - 5 * S, cy + 18 * S);
      stroke(markX - 5 * S, cy + 18 * S, markX + 24 * S, cy - 18 * S);
    } else {
      ring(markX, cy, markR, 14 * S, row.mark);
    }

    roundRect(markX + 110 * S + (row.barW * S) / 2, cy, row.barW * S, 56 * S, 28 * S, row.bar);
  }

  return px;
}

/**
 * Draw at 3× and box-filter down. The analytic edges above are decent but the
 * thin rings still stair-step; supersampling makes the question moot and the
 * icon is generated once, so the cost is irrelevant.
 */
function drawAA(size, opts, factor = 3) {
  const big = draw(size * factor, opts);
  const out = new Uint8Array(size * size * 3);
  const n = factor * factor;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const acc = [0, 0, 0];
      for (let dy = 0; dy < factor; dy++) {
        for (let dx = 0; dx < factor; dx++) {
          const i = ((y * factor + dy) * size * factor + (x * factor + dx)) * 3;
          acc[0] += big[i];
          acc[1] += big[i + 1];
          acc[2] += big[i + 2];
        }
      }
      const o = (y * size + x) * 3;
      out[o] = Math.round(acc[0] / n);
      out[o + 1] = Math.round(acc[1] / n);
      out[o + 2] = Math.round(acc[2] / n);
    }
  }
  return out;
}

const write = (name, size, opts) => {
  const png = encodePng(drawAA(size, opts), size);
  writeFileSync(resolve(outDir, name), png);
  console.log(`${name}  ${size}×${size}  ${(png.length / 1024).toFixed(1)} KB`);
};

write("icon.png", 1024);
write("adaptive-icon.png", 1024);
write("splash-icon.png", 512);
write("favicon.png", 64);
