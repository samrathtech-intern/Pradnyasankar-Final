/**
 * Removes the white background from ashwagandha-capsules.webp using a
 * flood-fill from all four corners.  Only pixels that are reachable from
 * the image border AND are near-white are made transparent.
 * The bottle's anti-aliased edges are never touched.
 * The original file is never modified.
 */
const sharp = require("sharp");
const path  = require("path");

const src  = path.join(__dirname, "../public/images/ashwagandha-capsules.webp");
const dest = path.join(__dirname, "../public/images/ashwagandha-capsules-nobg.png");

// How close to white a pixel must be to count as background (0-255 per channel).
const THRESHOLD = 30; // distance from pure white

function isNearWhite(r, g, b, threshold) {
  return (255 - r) <= threshold &&
         (255 - g) <= threshold &&
         (255 - b) <= threshold;
}

async function removeBackground() {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const px = new Uint8ClampedArray(data); // RGBA
  const visited = new Uint8Array(width * height); // 0 = unvisited

  function idx(x, y) { return (y * width + x) * 4; }
  function pidx(x, y) { return y * width + x; }

  // Iterative flood-fill (BFS) starting from a seed pixel
  function floodFill(seedX, seedY) {
    const queue = [[seedX, seedY]];
    while (queue.length > 0) {
      const [x, y] = queue.pop();
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (visited[pidx(x, y)]) continue;
      visited[pidx(x, y)] = 1;

      const i = idx(x, y);
      const r = px[i], g = px[i + 1], b = px[i + 2];

      if (!isNearWhite(r, g, b, THRESHOLD)) continue;

      // Mark transparent
      px[i + 3] = 0;

      queue.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
    }
  }

  // Seed from all four corners and all border pixels
  for (let x = 0; x < width; x++) {
    floodFill(x, 0);
    floodFill(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    floodFill(0, y);
    floodFill(width - 1, y);
  }

  await sharp(Buffer.from(px.buffer), { raw: { width, height, channels: 4 } })
    .png()
    .toFile(dest);

  console.log(`✅  Saved: ${dest}`);
}

removeBackground().catch((err) => { console.error(err); process.exit(1); });
