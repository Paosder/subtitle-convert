const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const optimized = mode === 'production';

const optimization = {
  minimize: optimized,
  minimizer: [new TerserPlugin()],
};

module.exports = {
  entry: ['./src/index.ts'],
  mode,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'source-map',
  target: 'node',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
  },
  externals: [
    // 'utf-8-validate', 'bufferutil',
  ],
  node: {
    __dirname: false,
  },
  optimization,
};
