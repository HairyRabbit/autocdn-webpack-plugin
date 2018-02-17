/**
 * get options from array or a single item
 *
 * @flow
 */

export default function applyArrayOption<T>(option: Array<T> | T): Array<T> {
  return Array.isArray(option) ? option : [option]
}
