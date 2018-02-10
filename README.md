<div alert="center">
  <img src="/assets/BgImage.svg" alt="Logo" />
</div>


## Usage

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTemplate = require('html-webpack-template')
const AutoCDNWebpackPlugin = require('@rabbitcc/autocdn-webpack-plugin')

module.exports = {
  //...webpack options...
  plugins: [
    new AutoCDNWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      inject: false
    })
  ]
}
```

## Interface

```js
type PackageName = string
type GlobalExportName = string

type CDN =
  | { url: string | Array<string>, name: GlobalExportName }
  | {
      css: string | Array<string>,
      js: string | Array<string>,
      name: GlobalExportName
    }

type Options = {
  cdn: {                             // preset cdn by yourself
    [name: PackageName]: CDN
  },
  exclude: string | Array<string>,   // exclude some package
  include: string | Array<string>,   // include some package
  report: boolean                    // report result on before inject plugin
}
```
