import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const candidates = [
  path.join(ROOT, 'out', '_next', 'static', 'chunks'),
  path.join(ROOT, '.next', 'static', 'chunks')
];

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (!entry.isFile()) return [];
    return [fullPath];
  });
}

const files = candidates.flatMap(walk)
  .filter((filePath, index, source) => source.indexOf(filePath) === index)
  .filter((filePath) => /\.(js|css)$/.test(filePath))
  .map((filePath) => ({
    filePath,
    sizeKb: Number((statSync(filePath).size / 1024).toFixed(1))
  }))
  .sort((left, right) => right.sizeKb - left.sizeKb);

if (files.length === 0) {
  console.log('No static build chunks found. Run the production/static build first.');
  process.exit(0);
}

console.log('Largest static build chunks:');
for (const item of files.slice(0, 30)) {
  console.log(`${String(item.sizeKb).padStart(8)} KB  ${path.relative(ROOT, item.filePath)}`);
}

const totalKb = files.reduce((sum, item) => sum + item.sizeKb, 0);
console.log(`Total JS/CSS static chunk weight: ${totalKb.toFixed(1)} KB`);
