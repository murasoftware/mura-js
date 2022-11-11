var path = require('path');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var env = process.env.WEBPACK_ENV;
var plugins = [];
var pjson = require('./package.json');

if (env === 'build') {
	mode = 'production';
	minimize = true;
  outputFile = 'mura.min.js';
} else {
	mode = 'development';
	minimize = false;
  outputFile = 'mura.js';
}

plugins.push(
  new webpack.IgnorePlugin({
    resourceRegExp:/(escape-html)|(node-fetch)/
  })
);

module.exports = {
	mode: mode,
  target: ['web', 'es5','browserslist'],
	optimization: {
    minimize: minimize
  },
  //entry: ['core-js/web','core-js/features/promise','core-js/features/array','regenerator-runtime/runtime',pjson.main],
  devtool: 'source-map',
  output: {
    filename: outputFile,
    path: path.resolve(__dirname, 'dist'),
    library:'Mura',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    modules: [
      path.resolve('./'),
      path.resolve('./node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude:[ /node_modules/],
        use: ['babel-loader']
      }
    ]
  },
  plugins: plugins
};