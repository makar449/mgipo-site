import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'src');
const banned = ['Не демо', 'замените', 'кнопки для вида', 'Lorem ipsum'];

function walk(dir: string): ReadonlyArray<string> {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const offenders = walk(root).filter((file) => /\.(ts|tsx)$/.test(file)).flatMap((file) => {
  const content = readFileSync(file, 'utf8');
  return banned.filter((word) => content.includes(word)).map((word) => `${file}: ${word}`);
});

if (offenders.length > 0) {
  console.error(offenders.join('\n'));
  process.exit(1);
}

console.log('Content check passed.');
