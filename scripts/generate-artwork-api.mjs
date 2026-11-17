import { resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { generateApi } from 'swagger-typescript-api';

const schemaPath = resolve('documentation/artwork-excerpts.openapi.json');
const schemaUrl = process.env.ARTWORK_OPENAPI_URL ?? 'http://localhost:3002/api/docs-json';
await mkdir(resolve('documentation'), { recursive: true });
if (!process.argv.includes('--saved')) {
  const response = await fetch(schemaUrl);
  if (!response.ok) throw new Error(`OpenAPI: HTTP ${response.status}`);
  const schema = await response.json();
  await writeFile(schemaPath, `${JSON.stringify(schema, null, 2)}\n`);
}

await generateApi({
  fileName: 'ArtworkExcerptsApi.ts',
  output: resolve('src/api/generated'),
  spec: JSON.parse(await readFile(schemaPath, 'utf8')),
  httpClientType: 'axios',
  generateClient: true,
  generateResponses: true,
  extractRequestParams: true,
  moduleNameFirstTag: false,
  moduleNameIndex: 1,
});
