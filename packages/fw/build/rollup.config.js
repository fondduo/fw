import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import globals from 'rollup-plugin-node-globals';
import { defineConfig } from 'rollup';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const resolveFile = (p) => path.join(dirname, '..', p);
const watchersDir = resolveFile('src/watchers');
const watchersDirs = fs.readdirSync(watchersDir);

const generateBinsInputs = () => {
  const inputs = {};
  watchersDirs.forEach((d) => {
    inputs[`fw-${d}`] = path.join(watchersDir, d, 'index.ts');
  });
  return inputs;
};

const generateTypesInputs = () => {
  const inputs = {};
  watchersDirs.forEach((d) => {
    inputs[d] = path.join(resolveFile('lib/types/watchers'), d, 'index.d.ts');
  });
  return inputs;
};

const config = defineConfig([
  {
    input: {
      ...generateBinsInputs(),
      generator: resolveFile('src/generator/index.ts'),
    },
    output: [
      {
        dir: resolveFile('lib'),
        sourcemap: true,
        format: 'esm',
      },
    ],
    external: [
      'fs',
    ],
    plugins: [
      globals(),
      nodeResolve({
        resolveOnly: ['src'],
      }),
      json(),
      typescript({
        tsconfig: resolveFile('tsconfig.json'),
      }),
    ],
  },
  {
    input: {
      ...generateTypesInputs(),
      generator: resolveFile('lib/types/generator/index.d.ts'),
    },
    output: {
      dir: resolveFile('lib'),
      format: 'es',
    },
    plugins: [
      dts(),
      del({
        targets: 'lib/types',
        hook: 'buildEnd',
      }),
    ],
  },
]);

export default config;
