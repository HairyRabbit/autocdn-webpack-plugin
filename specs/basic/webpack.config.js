const path = require('path')
const AutoCDNWebpackPlugin = require('../../lib').default

module.exports = {
  entry: path.resolve('./index.js'),
  output: {
    filename: '[name].js'
  },
  plugins: [
    new AutoCDNWebpackPlugin()
  ]
}
