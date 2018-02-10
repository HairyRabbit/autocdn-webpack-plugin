/**
 * resolve package unpkg.com CDN url
 *
 * @flow
 */

import request from 'request'

export default function cdnResolver(name: string,
                                    version: string,
                                    filePath: string,
                                    timeout?: number = 75000): Promise<?string> {
  return new Promise((resolve, reject) => {
    const protocol = 'https'
    const domain = 'unpkg.com'
    const requestPath = `${protocol}://${domain}/${name}@${version}/${filePath}`
    request({
      url: requestPath,
      followRedirect : false,
      timeout
    }, (err, res, body) => {
      if(err) {
        reject(err)
        return
      }
      const code = res.statusCode
      if(200 === code) {
        resolve(requestPath)
      } else if(302 === code) {
        resolve(`${protocol}://${domain}${res.headers.location}`)
      } else {
        resolve(null)
      }
    })
  })
}
