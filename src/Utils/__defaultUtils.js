const Axios = require('axios').default
const fileSystem = require('fs')
const path = require('path')

String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

class utils {
  static async __rawfetchBody(
    rawApiUrl,
    apiOptions,
    apiMethod = 'GET',
    returnType = 'data',
    ignoreError = true,
    filters = {},
  ) {
    if (
      !(
        rawApiUrl &&
        typeof rawApiUrl === 'string' &&
        rawApiUrl !== '' &&
        apiMethod &&
        typeof apiMethod === 'string' &&
        ['get', 'post'].includes(apiMethod?.toLowerCase()?.trim())
      )
    )
      return undefined
    try {
      let rawResponse
      if (apiMethod?.toLowerCase()?.trim() === 'get')
        rawResponse = await Axios.get(rawApiUrl, apiOptions)
      else if (apiMethod?.toLowerCase()?.trim() === 'post')
        rawResponse = await Axios.post(
          rawApiUrl,
          apiOptions?.postData,
          apiOptions?.postConfig,
        )
      else return undefined
      if (!(rawResponse && rawResponse.status === 200))
        throw new Error('Invalid Response Fetched from Api Url')
      else if (
        returnType &&
        typeof returnType === 'string' &&
        returnType?.toLowerCase()?.trim() === 'all'
      )
        return rawResponse?.[returnType ?? 'data']
      else if (
        returnType &&
        typeof returnType === 'string' &&
        rawResponse?.[returnType?.trim() ?? 'data']
      )
        return rawResponse?.[returnType?.trim() ?? 'data']
      else
        throw new Error(
          'Invalid Response Object is Requested or Corrupted Request',
        )
    } catch (rawError) {
      if (ignoreError) return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
  static __jsonParser(rawResponse, parseType = 'meta') {
    if (
      !(
        rawResponse &&
        typeof rawResponse === 'string' &&
        rawResponse !== '' &&
        typeof parseType === 'string' &&
        parseType !== ''
      )
    )
      return undefined
    try {
      switch (parseType?.toLowerCase()?.trim()) {
        case 'meta':
          return JSON.parse(
            '{' +
              rawResponse
                ?.split('<meta ')
                ?.filter(
                  (raw) =>
                    raw &&
                    raw?.includes('content=') &&
                    !raw?.includes('referrer'),
                )
                ?.map((raw) => {
                  try {
                    raw = raw?.split('/>')?.[0]
                    if (!(raw && typeof raw === 'string' && raw !== ''))
                      return undefined
                    else if (raw?.startsWith('property=')) {
                      return `${raw
                        ?.slice(
                          raw?.indexOf('property=') + 'property='.length,
                          raw?.indexOf('content='),
                        )
                        ?.replace('og:', '')
                        ?.replace('al:', '')
                        ?.replace(/[~`!@#$%^&*()+={}\[\];:<>.,\/\\\?-_]/g, '_')
                        ?.trim()}:${raw
                        ?.slice(
                          raw?.indexOf('content=') + 'content='.length,
                          raw?.length,
                        )
                        ?.replace(/\n/g, '')
                        ?.trim()}`
                    } else if (raw?.startsWith('name=')) {
                      return `${raw
                        ?.slice(
                          raw?.indexOf('name=') + 'name='.length,
                          raw?.indexOf('content='),
                        )
                        ?.replace('og:', '')
                        ?.replace('al:', '')
                        ?.replace(/[~`!@#$%^&*()+={}\[\];:<>.,\/\\\?-]/g, '_')
                        ?.trim()}:${raw
                        ?.slice(
                          raw?.indexOf('content=') + 'content='.length,
                          raw?.length,
                        )
                        ?.replace(/\n/g, '')
                        ?.trim()}`
                    } else return undefined
                  } catch {
                    return undefined
                  }
                })
                ?.filter(Boolean)
                ?.join(',') +
              `,"videoId": ${
                rawResponse?.split(`"video_id":"`)?.[1]?.split(`"`)?.[0]
              }` +
              '}',
          )
        case 'script':
          return JSON.parse(
            rawResponse
              ?.split('<script type="application')?.[1]
              ?.split('</script>')?.[0]
              ?.split(`">`)?.[1]
              ?.split(',')
              ?.filter(Boolean)
              ?.map((raw) => raw?.replaceAll(/\\u0040/g, ''))
              ?.join(','),
          )
      }
    } catch {
      return undefined
    }
  }
  static __cacheTemp(rawData, fileName = '__fbWatchPage.html') {
    if (!fileSystem.existsSync(path.join(__dirname, '/../cache')))
      fileSystem.mkdirSync(path.join(__dirname, '/../cache'))
    const __cacheLocation = path.join(__dirname, '/../cache', '/' + fileName)
    if (!__cacheLocation) return undefined
    return fileSystem.writeFileSync(__cacheLocation, rawData)
  }
  static __errorHandling(error = new Error()) {
    if (!error?.message) return undefined
    if (!fileSystem.existsSync(path.join(__dirname, '/../cache')))
      fileSystem.mkdirSync(path.join(__dirname, '/../cache'))
    const __cacheLocation = path.join(
      __dirname,
      '/../cache',
      '/__errorLogs.txt',
    )
    if (!__cacheLocation) return undefined
    if (!fileSystem.existsSync(__cacheLocation)) {
      fileSystem.writeFileSync(
        __cacheLocation,
        `${new Date()} | ` +
          `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
            error?.stack ?? 'Unknown-Stack'
          }`,
      )
    } else if (
      (fileSystem.readFileSync(__cacheLocation)?.length ?? 0) < 500000
    ) {
      fileSystem.appendFileSync(
        __cacheLocation,
        `\n\n${new Date()} | ` +
          `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
            error?.stack ?? 'Unknown-Stack'
          }`,
        'utf8',
      )
    } else {
      fileSystem.writeFileSync(
        __cacheLocation,
        `${new Date()} | ` +
          `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
            error?.stack ?? 'Unknown-Stack'
          }`,
      )
    }
    return true
  }
}

module.exports = utils
