const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  input: 'packages/core/dist/index.js',
  context: 'this',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'WebviewSdk'
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};