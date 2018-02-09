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

type CDN =
  | string
  | Array<string>
  | { css: Array<string>, js: Array<string> }

export type Options = {
  cdn: {
    [name: string]: CDN
  }
}

export { default as default } from './plugin'
