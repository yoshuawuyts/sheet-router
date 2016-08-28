import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import strip from 'rollup-plugin-strip'

export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [
    nodeResolve({jsnext: true, main: true}),
    strip({functions: ['assert.*']}),
    commonjs(),
    babel()
  ],
  moduleName: 'sheetRouter',
  dest: 'dist/bundle.js'
}
