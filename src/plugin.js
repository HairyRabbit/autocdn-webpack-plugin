/**
 * plugin
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import { exportName, exportPath } from '@rabbitcc/umd-extra'
import { PromiseMap } from '@rabbitcc/promise-extra'
import DefaultOptions from './defaultOptions'
import resolve from './cdnUrlResolver'
import print from './pkgPrettyPrint'
import type { Compiler } from 'webpack/lib/Compiler'
import type { Options } from './'

export default class AutocdnWebpackPlugin {
  constructor(options: Options) {
    this.options = {
      ...DefaultOptions,
      ...options
    }
  }
  apply(compiler: Compiler): void {
    const options = this.options
    const context = compiler.context

    /**
     * resolve dependencies of package.json
     */
    const pkgPath = path.resolve(context, 'package.json')
    let pkg
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    } catch(err) {
      throw new Error(err)
    }
    const deps = pkg.dependencies

    /**
     * collect deps
     */
    const collects = {}
    const ignored = Object.keys(options.cdn)
    Object.keys(deps).forEach(key => {
      if(~ignored.indexOf(key)) {
        return
      }
      const name = key
      const version = deps[key]
      const filePath = exportPath(name, false, context)
            .catch(err => null)
            .then(filePath => filePath && path.normalize(filePath))
      const globalName = exportName(name, context)
            .catch(err => null)
      collects[name] = PromiseMap({
        name,
        version,
        filePath,
        globalName
      })
    })

    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-before-html-generation', (data, callback) => {
        PromiseMap(collects)
          .then(result => {
            for(let key in result) {
              const item = result[key]
              result[key] = PromiseMap({
                ...item,
                url: resolve(
                  item.name,
                  item.version,
                  path.relative(path.resolve(
                    context,
                    'node_modules',
                    item.name
                  ), item.filePath)
                ).catch(err => null)
              })
            }
            return PromiseMap(result)
          })
          .then(result => {
            const css = [], js = [], noPath = [], noName = [], noUrl = []
            for(let key in result) {
              const item = result[key]
              if(!item.filePath) {
                noPath.push(item)
                continue
              } else if(!item.url) {
                noUrl.push(item)
                continue
              } else {
                const isCss = '.css' === path.extname(item.filePath)
                if(isCss) {
                  css.push(item)
                  continue
                } else {
                  if(!item.globalName) {
                    noName.push(item)
                    continue
                  } else {
                    js.push(item)
                  }
                }
              }
            }

            /**
             * report result
             */
            if(options.report) {
              console.log('[AutoCDN] report:\n')

              if(noPath.length) {
                console.log(`This below packages umd bundle file not found:\n\n${print(noPath)}\n`)
              }

              if(noName.length) {
                console.log(`This below packages global name not resolved:\n\n${print(noName)}\n`)
              }

              if(noUrl.length) {
                console.log(`This below packages unpkg.com CDN url not resolved:\n\n${print(noUrl)}\n`)
              }

              if(css.length) {
                console.log(`Add packages as links:\n\n${print(css)}\n`)
              }

              if(js.length) {
                console.log(`Add packages as scripts:\n\n${print(js)}\n`)
              }
            }


            /**
             * inject css packages
             */
            if(css.length) {
              data.assets.css = [
                ...css.map(pkg => pkg.url),
                ...data.assets.css
              ]
            }

            /**
             * inject js packages
             */
            if(js.length) {
              for(let i = 0; i < js.length; i++) {
                data.assets.chunks = {
                  [js[i].name]: {
                    entry: js[i].url
                  },
                  ...data.assets.chunks
                }
              }
            }

            callback(null, data)
          })
          .catch(err => callback(err))
      })
    })
  }
}
