const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AutoCDNWebpackPlugin = require('../../lib').default

module.exports = {
  entry: path.resolve('./index.js'),
  output: {
    filename: '[name].js'
  },
  plugins: [
    new AutoCDNWebpackPlugin(),
    new HtmlWebpackPlugin()
  ]
}
