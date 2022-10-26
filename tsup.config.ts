import type { Options } from 'tsup'

export default <Options>{
  entry: [
    'src/*.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
  shims: false,
  onSuccess: 'npm run build:fix',
}
