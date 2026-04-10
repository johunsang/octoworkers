#!/usr/bin/env node
// Usage: node build.js OR npx esbuild ...
import { execSync } from 'node:child_process'
execSync(
  'npx esbuild src/index.ts --bundle --platform=node --target=node20 --format=esm --outfile=dist/index.js --banner:js="#!/usr/bin/env node"',
  { stdio: 'inherit' },
)
