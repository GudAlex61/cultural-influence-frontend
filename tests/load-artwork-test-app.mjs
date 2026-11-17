import { build } from 'esbuild';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function loadArtworkTestApp() {
  const outfile = resolve('node_modules/.cache/artwork-tests/application.mjs');
  await build({ entryPoints: ['tests/artwork-test-entry.ts'], outfile,
    bundle: true, platform: 'node', format: 'esm', packages: 'external', logLevel: 'silent' });
  return import(pathToFileURL(outfile).href);
}
