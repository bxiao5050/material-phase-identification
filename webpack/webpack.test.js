const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');
module.exports = merge(common, {
  mode: 'production',
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [require('autoprefixer')()]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        type: 'asset'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
      // SERVER: JSON.stringify('https://sdk-test.changic.net.cn')
    }),
    new MiniCssExtractPlugin({
      // 所有选项都是可选的
      filename: '[name]-[contenthash:6].css',
      ignoreOrder: false // 忽略有关顺序冲突的警告
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/prod.html'),
      chunks: [],
      minify: {
        minifyJS: true,
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 249856
    }
  }
  // externals: {
  //   react: 'window.React',
  //   'react-dom': 'window.ReactDOM',
  //   'react-router-dom': 'window.ReactRouterDOM'
  // }
});
