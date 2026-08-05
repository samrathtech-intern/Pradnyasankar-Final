import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const allowedExtensions = new Set([".ts", ".tsx", ".css"]);
const sourceFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (allowedExtensions.has(path.extname(entry.name))) sourceFiles.push(fullPath);
  }
}

function resolveSourceModule(fromFile, specifier) {
  let base;
  if (specifier.startsWith("@/")) base = path.join(sourceRoot, specifier.slice(2));
  else if (specifier.startsWith(".")) base = path.resolve(path.dirname(fromFile), specifier);
  else return true;

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
    path.join(base, "index.js"),
    path.join(base, "index.jsx"),
  ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

walk(sourceRoot);
const imageReferences = new Set();
const missingImports = [];

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const match of content.matchAll(/"(\/(?:images\/[^" ]+|logo\.png))"/g)) imageReferences.add(match[1]);
  for (const match of content.matchAll(/(?:from\s+|import\s*)["']([^"']+)["']/g)) {
    const specifier = match[1];
    if (!resolveSourceModule(file, specifier)) {
      missingImports.push(`${path.relative(root, file)} -> ${specifier}`);
    }
  }
}

const missingAssets = [...imageReferences].filter((reference) => !fs.existsSync(path.join(root, "public", reference.slice(1))));

if (missingImports.length || missingAssets.length) {
  if (missingImports.length) {
    console.error("Missing local imports:");
    for (const item of missingImports) console.error(` - ${item}`);
  }
  if (missingAssets.length) {
    console.error("Missing public assets:");
    for (const reference of missingAssets) console.error(` - ${reference}`);
  }
  process.exit(1);
}

console.log(`Validated ${sourceFiles.length} source files, local imports, and ${imageReferences.size} public image references.`);
