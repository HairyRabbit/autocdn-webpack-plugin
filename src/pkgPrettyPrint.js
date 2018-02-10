/**
 * pretty print packages
 *
 * @flow
 */

export default function(packages: Array<Object>): string {
  return packages.map(pkg => `\t- ${pkg.name}`).join('\n')
}
