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
  // Build tests.
  /*
  {
    input: './tests/src/tests.ts',
    output: [
      {
        file: './tests/dist/tests.node.js',
        format: 'es',
      },
      {
        file: './tests/dist/tests.browser.js',
        format: 'umd',
        name: `${pkg.name}_testsuite`,
        globals: { chai: 'chai', eventti: 'eventti', tikki: 'tikki' },
      },
    ],
    external: ['chai', 'eventti', 'tikki'],
    plugins: [typescript()],
  },
  */
];
