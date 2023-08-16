import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' assert { type: 'json' };

export default [
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
