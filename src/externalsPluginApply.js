/**
 * apply webpack.ExternalsPlugin
 *
 * @flow
 */

import { ExternalsPlugin } from 'webpack'
import type { Results } from './plugin'
import type { Compiler } from 'webpack/lib/Compiler'

export default function applyExternalsPlugin(compiler: Compiler, results: Results): void {
  const libTarget = compiler.options.output.libraryTarget
  const { js, css } = results

  if(js.length) {
    const externals = js.reduce((acc, { name, globalName }) => {
      acc[name] = globalName
      return acc
    }, {})
    compiler.apply(new ExternalsPlugin(libTarget, externals))
  }

  if(css.length) {
    compiler.apply(new ExternalsPlugin(libTarget, css.map(({ name }) => name)))
  }
}
