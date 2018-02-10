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
      const globalName = exportName(name, context).catch(err => console.error(err))
      collects[name] = PromiseMap({
        name,
        version,
        filePath,
        globalName
      })
    })

    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-before-html-generation', (data, callback) => {
        // data.assets.chunks = {
        //   verdor: {
        //     entry: '/' + fileName
        //   },
        //   ...data.assets.chunks
        // }

        PromiseMap(collects)
          .then(result => {
            for(let key in result) {
              const filePath = result[key].filePath
              result[key].filePath = path.normalize(filePath)
            }
            console.log(result)
          })
          .then(() => {
            callback(null, data)
          })
      })
    })
  }
}
