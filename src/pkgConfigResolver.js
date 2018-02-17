/**
 * resolve package.json
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'

export default function resolvePkgConfig(context: string): Object {
  const pkgPath = path.resolve(context, 'package.json')
  try {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  } catch(err) {
    throw new Error(err)
  }
}
