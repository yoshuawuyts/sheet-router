import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import unassertify from 'unassertify'
import browserifyPlugin from 'rollup-plugin-browserify-transform'

export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [
    browserifyPlugin(unassertify),
    nodeResolve({jsnext: true, main: true}),
    commonjs({ include: 'node_modules/**' }),
    babel()
  ],
  moduleName: 'sheetRouter',
  dest: 'dist/bundle.js'
}
