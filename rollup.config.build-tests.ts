import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: './tests/unit/src/index.ts',
    output: [
      {
        file: './tests/unit/dist/index.js',
        format: 'umd',
        name: `${pkg.name}_testsuite`,
        globals: { chai: 'chai' },
      },
    ],
    external: ['chai'],
    plugins: [typescript()],
  },
];
