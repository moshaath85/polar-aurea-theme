const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

let ThemeWatcher = null;
try { ThemeWatcher = require('@salla.sa/twilight/watcher.js'); } catch (e) { /* CLI provides it */ }

const asset = (file) => path.resolve('src/assets', file || '');
const publicDir = (file) => path.resolve('public', file || '');

module.exports = {
  entry: {
    app: [asset('styles/app.css'), asset('js/app.js')],
    home: asset('js/home.js'),
    product: [asset('styles/product.css'), asset('js/product.js')],
  },
  output: {
    path: publicDir(),
    clean: true,
    chunkFilename: "[name].[contenthash].js",
  },
  stats: { modules: false, assetsSort: "size", assetsSpace: 50 },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.(s(a|c)ss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { url: false } },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    ...(ThemeWatcher ? [new ThemeWatcher()] : []),
    new MiniCssExtractPlugin(),
    new CopyPlugin({ patterns: [{ from: asset('images'), to: publicDir('images') }] }),
  ],
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
};
