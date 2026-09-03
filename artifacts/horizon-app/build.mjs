import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { build } from 'vite';

const root = path.resolve(import.meta.dirname);
const indexPath = path.join(root, 'index.html');
const configPath = path.join(root, 'vite.config.ts');
const source = await readFile(indexPath, 'utf8');
const entryTag = ['<scr', 'ipt type="module" src="/src/main.tsx"></scr', 'ipt>'].join('');
const prepared = source.replace('<!-- HORIZON_ENTRY -->', entryTag);

if (prepared === source) {
  throw new Error('Horizon build marker is missing from index.html');
}

await writeFile(indexPath, prepared);

try {
  await build({ configFile: configPath });
} finally {
  await writeFile(indexPath, source);
}