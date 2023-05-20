import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

export default [
  // Build UMD.
  {
    input: pkg.source,
    output: [
      {
        name: pkg.name,
        file: pkg['umd:main'],
        format: 'umd',
      },
    ],
    plugins: [typescript()],
  },
  // Build UMD type defintions.
  {
    input: pkg.source,
    output: [{ file: pkg['umd:types'], format: 'umd' }],
    plugins: [dts()],
  },
  // Build browser test suite.
  {
    input: './tests/src/index.ts',
    output: [
      {
        file: './tests/dist/index.js',
        format: 'umd',
        name: `${pkg.name}_testsuite`,
        globals: { chai: 'chai' },
      },
    ],
    external: ['chai'],
    plugins: [typescript()],
  },
];
