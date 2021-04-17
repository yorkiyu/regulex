const path = require('path');
const webpack = require('webpack');

const filename = '[name].min.js';

module.exports = {
  entry: {
    regulex: path.join(__dirname, 'src'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'regulex',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: `${filename}.map`,
    }),
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@regulex': path.resolve(__dirname, 'src'),
    },
  },
};