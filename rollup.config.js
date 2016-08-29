import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
// rollup does not have unassert support for now, so use the browserify transform
import unassertify from 'unassertify'
import browserifyPlugin from 'rollup-plugin-browserify-transform'

export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [
    browserifyPlugin(unassertify),
    nodeResolve({jsnext: true, main: true}),
    commonjs(),
    babel({
      include: ['node_modules/wayfarer/**', 'node_modules/xtend', 'src/**']
    })
  ],
  moduleName: 'sheetRouter',
  dest: 'dist/bundle.js'
}
