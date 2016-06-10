/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 *
 * It makes sense to run this after npm install
 * or dependency changes.
 */

const config = require('../config');
const { resolve } = require('path');
const pkg = require(resolve(process.cwd(), 'package.json'));

if (!pkg.dllPlugin) {
  process.exit(0);
}

const defaults = require('lodash/defaultsDeep');
const webpack = require('webpack');

const dllPlugin = defaults(
  pkg.dllPlugin,
  config.dllPlugin.defaults
);

const outputPath = resolve(process.cwd(), dllPlugin.path);

module.exports = {
  context: process.cwd(),
  // dll bundles are defined as an object containing arrays of npm modules or as all browser compatible npm dependencies
  entry: dllPlugin.dlls || config.dllPlugin.entry(pkg),
  devtool: 'eval',
  output: {
    filename: '[name].dll.js',
    library: '[name]',
    path: outputPath,
  },
  plugins: [
    new webpack.DllPlugin({ name: '[name]', path: resolve(outputPath, '[name].json') }), // eslint-disable-line no-new
  ],
};
