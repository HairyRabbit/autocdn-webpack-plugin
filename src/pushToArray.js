/**
 * push to array
 *
 * @flow
 */

import apply from './arrayOptionApply'
import type { Model } from './'

export default function pushToArray(list: *,
                                    name: string,
                                    arr: Array<Object>): void {
  if(list) {
    const urls = apply(list)
    const len = urls.length
    urls.forEach((url, idx) => {
      arr.push({
        name: len === 1 ? name : (name + '@' + idx),
        url
      })
    })
  }
}
