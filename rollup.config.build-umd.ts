import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

export default [
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
  {
    input: pkg.source,
    output: [{ file: pkg['umd:types'], format: 'umd' }],
    plugins: [dts()],
  },
];
