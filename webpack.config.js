const path = require('path');
const webpack = require('webpack');

// eslint-disable-next-line no-underscore-dangle
const __DEV__ = process.env.NODE_ENV === 'development';
const filename = __DEV__ ? '[name].js' : '[name].min.js';

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
        use: ['babel-loader?babelrc'],
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
      'regulex': path.resolve(__dirname, 'src/'),
    },
  },
};