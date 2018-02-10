const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTemplate = require('html-webpack-template')
const AutoCDNWebpackPlugin = require('../../lib').default

module.exports = {
  entry: path.resolve('./index.js'),
  output: {
    filename: '[name].js'
  },
  plugins: [
    new AutoCDNWebpackPlugin({
      cdn: {
        jquery: {
          url: [
            'https://unpkg.com/jquery@3.3.1/dist/jquery.min.js',
            'https://unpkg.com/jquery@3.3.1/dist/jquery.slim.min.js'
          ],
          name: '$'
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      inject: false
    })
  ]
}
