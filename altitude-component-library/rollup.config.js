import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'
import copy from 'rollup-plugin-copy'
import scss from 'rollup-plugin-scss'
import reactSvg from 'rollup-plugin-react-svg'

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    babel({
      minified: true,
      exclude: 'node_modules/**'
    }),
    external(),
    scss(),
    resolve(),
    copy({
      targets: [
        { src: 'src/elements/**/*.scss', dest: 'dist/scss/components/elements' },
        { src: 'src/base/**/*.scss', dest: 'dist/scss/components/base' },
        { src: 'src/widgets/**/*.scss', dest: 'dist/scss/components/widgets' },
        { src: 'src/styles/*', dest: 'dist/scss/styles' }
      ]
    }),
    typescript({
      rollupCommonJSResolveHack: true,
      exclude: ['**/__tests__/**', '**/*.test.tsx/**', '**/*.stories.*/**', ''],
      clean: true,
      check: false
    }),
    commonjs({
      include: ['node_modules/**']
    }),
    reactSvg({
      // svgo options
      svgo: {
        plugins: [], // passed to svgo
        multipass: true
      },

      // whether to output jsx
      jsx: false,

      // include: string
      include: null,

      // exclude: string
      exclude: null
    })
  ]
}
