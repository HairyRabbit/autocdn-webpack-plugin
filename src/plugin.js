/**
 * plugin
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import { exportName, exportPath } from '@rabbitcc/umd-extra'
import { PromiseMap } from '@rabbitcc/promise-extra'
import DefaultOptions from './defaultOptions'
import resolvePkg from './pkgConfigResolver'
import resolve from './cdnUrlResolver'
import report from './resultReporter'
import apply from './arrayOptionApply'
import applyExternalsPlugin from './externalsPluginApply'
import pushToArray from './pushToArray'
import type { Compiler } from 'webpack/lib/Compiler'
import type { Options } from './'

export type Results = {
  css: Array<Model>,
  js: Array<Model>,
  noPath: Array<Model>,
  noName: Array<Model>,
  noUrl: Array<Model>
}

export default class AutocdnWebpackPlugin {
  options: Options;
  constructor(options: Options) {
    this.options = {
      ...DefaultOptions,
      ...options
    }
  }
  apply(compiler: Compiler): void {
    const options = this.options
    const context = compiler.context

    const collects = {}
    const presets = Object.keys(options.cdn)

    /**
     * resolve dependencies of package.json
     */
    const pkgPath = path.resolve(context, 'package.json')
    const pkg = resolvePkg(context)
    const deps = pkg.dependencies
    const include = apply(options.include)
    const exclude = apply(options.exclude)
    /**
     * include
     *
     * 1. find version from package.json
     * 2. find package version from node_modules
     */
    const allDeps = {
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
        ...deps
    }
    include.forEach(dep => {
      if(allDeps[dep]) {
        deps[dep] = allDeps[dep]
      } else {
        try {
          const version = require(`${dep}/package.json`).version
          deps[dep] = version
        } catch(err) {
          throw new Error(`Can't find module ${dep} from include options.`)
        }
      }
    })

    /**
     * collect deps
     */
    Object.keys(deps).forEach(key => {
      if(~presets.indexOf(key) || ~exclude.indexOf(key)) {
        return
      }
      const name = key
      const version = deps[key]
      const filePath = exportPath(name, false, context, false)
            .catch(err => null)
            .then(filePath => filePath && path.normalize(filePath))
      const globalName = exportName(name, context, false)
            .catch(err => null)
      collects[name] = PromiseMap({
        name,
        version,
        filePath,
        globalName
      })
    })


    let results = {}

    compiler.plugin('before-run', (compiler, callback) => {
      PromiseMap(collects)
        .then(result => {
          for(let key in result) {
            const item = result[key]
            result[key] = PromiseMap({
              ...item,
              url: item.filePath && resolve(
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
              } else {
                if(!item.globalName) {
                  noName.push(item)
                } else {
                  js.push(item)
                }
              }
            }
          }

          /**
           * add presets to collects
           */
          presets.forEach(preset => {
            const item = options.cdn[preset]
            if(item.url) {
              pushToArray(item.url, preset, js)
            } else {
              if(item.css) {
                pushToArray(item.css, preset, css)
              }

              if(item.js) {
                pushToArray(item.js, preset, js)
              }
            }
          })

          results = {
            css,
            js,
            noPath,
            noName,
            noUrl
          }

          /**
           * report result
           */
          if(options.report) {
            report(results)
          }

          /**
           * apply webpack.ExternalsPlugin plugin
           */
          applyExternalsPlugin(compiler, results)

          callback()
          return
        })
        .catch(err => callback(err))
    })

    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-before-html-generation', (data, callback) => {
        PromiseMap(results)
          .then(({ css, js }) => {
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
