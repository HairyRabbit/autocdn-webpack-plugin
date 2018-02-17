/**
 * autocdn-webpack-plugin
 *
 * process:
 *
 * 1. read dependencies from package.json
 * 2. split css deps and js deps
 * 3. use `umdPath` find production build file path
 * 4. use `umdName` find deps umd export name, inject to options.externals
 * 5. find deps on unpkg.com links
 * 6. inject all the deps CDN links to html-webpack-plugin assets
 *
 * @flow
 */

type Name = string
type Url = string
type GlobalName = string

type CDN =
  | {| url: Url | Array<Url>, name: GlobalName |}
  | {| css: Url | Array<Url>, js: Url | Array<Url>, name: GlobalName |}

export type Model = {
  name: Name,
  version: string,
  filePath: string,
  globalName: GlobalName,
  url: Url
}

export type Options = {
  cdn: {
    [name: string]: CDN
  },
  exclude: Name | Array<Name>,
  include: Name | Array<Name>,
  report: boolean
}

export { default as default } from './plugin'
