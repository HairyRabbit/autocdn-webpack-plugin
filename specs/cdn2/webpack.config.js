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
        bootstrap: {
          css: 'https://unpkg.com/bootstrap@4.0.0/dist/css/bootstrap.min.css',
          js: 'https://unpkg.com/bootstrap@4.0.0/dist/js/bootstrap.min.js'
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      inject: false
    })
  ]
}
