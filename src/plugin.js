/**
 * plugin
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
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
    compiler.apply('done', () => {
      // @TODO: happy hack webpack
    })
  }
}
