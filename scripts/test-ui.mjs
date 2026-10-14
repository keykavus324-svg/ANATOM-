import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import chromium from '@sparticuz/chromium';
// A self-contained Linux browser for restricted CI environments. Regular Playwright
// installations may run `npx playwright test` directly instead.
const cache = path.resolve('.playwright');
mkdirSync(`${cache}/libs`, { recursive: true });
const packageRoot=path.dirname(path.dirname(import.meta.resolve('@sparticuz/chromium').replace('file://', '')));
writeFileSync(`${cache}/al2023.tar`, brotliDecompressSync(readFileSync(`${packageRoot}/bin/al2023.tar.br`)));
const extract=spawnSync('tar',['-xf',`${cache}/al2023.tar`,'-C',`${cache}/libs`],{stdio:'inherit'});
if(extract.status!==0) process.exit(extract.status || 1);
const browserPath = await chromium.executablePath();
const result = spawnSync('npx', ['playwright', 'test'], { stdio: 'inherit', env: { ...process.env, CHROMIUM_EXECUTABLE_PATH: browserPath, LD_LIBRARY_PATH: `${cache}/libs/lib:${process.env.LD_LIBRARY_PATH || ''}` }});
process.exit(result.status ?? 1);
