/**
 * Generate PWA icons from a single SVG source.
 * Run once (or whenever the brand changes); commits the resulting PNGs.
 */
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const BG = "#1F4E79";
const FG = "#ffffff";

const OUT = path.resolve("public");
mkdirSync(OUT, { recursive: true });

function svg(size, fontPx, withBg) {
  const bgRect = withBg
    ? `<rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${BG}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  ${bgRect}
  <text x="50%" y="${size * 0.7}"
        text-anchor="middle"
        font-family="Inter, Arial, sans-serif"
        font-weight="800"
        font-size="${fontPx}"
        fill="${FG}">B</text>
</svg>`;
}

const targets = [
  { size: 192, file: "icon-192.png", withBg: true,  fontRatio: 0.62 },
  { size: 512, file: "icon-512.png", withBg: true,  fontRatio: 0.62 },
  { size: 512, file: "icon-maskable-512.png", withBg: true, fontRatio: 0.42 }, // safe area
  { size: 180, file: "apple-touch-icon.png", withBg: true, fontRatio: 0.62 },
];

for (const t of targets) {
  const buf = await sharp(Buffer.from(svg(t.size, t.size * t.fontRatio, t.withBg)))
    .png()
    .toBuffer();
  writeFileSync(path.join(OUT, t.file), buf);
  console.log(`✔ ${t.file}  (${t.size}×${t.size})`);
}

// Update favicon-svg as well (consistent BIK look)
writeFileSync(
  path.join(OUT, "favicon.svg"),
  svg(32, 22, true).replace(/\n\s*/g, ""),
);
console.log("✔ favicon.svg refreshed");
