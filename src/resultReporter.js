/**
 * report results
 *
 * @flow
 */

import print from './pkgPrettyPrint'
import type { Results } from './plugin'

export default function reportResult(results: Results): void {
  const { js, css, noName, noPath, noUrl } = results

  console.log('[AutoCDN] report:\n')

  if(noPath.length) {
    console.log(` * The umd bundle file not found:\n\n${print(noPath)}\n`)
  }

  if(noName.length) {
    console.log(` * The global name not resolved:\n\n${print(noName)}\n`)
  }

  if(noUrl.length) {
    console.log(` * The unpkg.com CDN url not resolved:\n\n${print(noUrl)}\n`)
  }

  if(css.length) {
    console.log(` * Add packages as links:\n\n${print(css)}\n`)
  }

  if(js.length) {
    console.log(` * Add packages as scripts:\n\n${print(js)}\n`)
  }
}
