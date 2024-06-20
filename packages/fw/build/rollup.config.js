import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import globals from 'rollup-plugin-node-globals';
import { defineConfig } from 'rollup';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const resolveFile = (p) => path.join(dirname, '..', p);

const config = defineConfig([
  {
    input: {
      fw: resolveFile('src/index.ts'),
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
      generator: resolveFile('lib/types/index.d.ts'),
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
