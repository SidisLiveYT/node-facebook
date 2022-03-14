const Axios = require('axios').default
const fileSystem = require('fs')
const path = require('path')
var htmlParser = require('html2json').html2json

String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

class utils {
  static async __rawfetchBody(
    rawApiUrl,
    apiOptions,
    returnType = 'data',
    ignoreError = true,
    filters,
  ) {
    if (!(rawApiUrl && typeof rawApiUrl === 'string' && rawApiUrl !== ''))
      return undefined
    try {
      let rawResponse = await Axios.get(rawApiUrl, { ...apiOptions })
      if (
        !(
          rawResponse &&
          rawResponse.status === 200 &&
          rawResponse?.[returnType ?? 'data']
        )
      )
        throw new Error('Invalid Response Fetched from Api Url')
      else return rawResponse?.[returnType ?? 'data']
    } catch (rawError) {
      if (ignoreError) return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
  static async __customParser(rawResponse, rawType = 'video') {
    if (
      !(rawResponse && typeof rawResponse === 'string' && rawResponse !== '') ||
      !(rawType && typeof rawType === 'string' && rawType !== '')
    )
      return undefined
    try {
      let rawParsed,
        rawGarbage = {},
        rawStructure = {}

      switch (rawType?.toLowerCase()?.trim()) {
        case 'video':
          utils.#__cacheTemp(rawResponse, '__fbWatchPage.html')
          rawParsed = JSON.parse(
            rawResponse
              .split('<script type="application/ld+json"')
              ?.map((raw) =>
                raw
                  ?.split('">')?.[1]
                  ?.split('</script>')?.[0]
                  ?.replaceAll(/\\u0040/g, ''),
              )
              ?.filter(Boolean)[1],
          )
          return rawParsed
        case 'videos':
          utils.#__cacheTemp(rawResponse, '__fbVideosPage.html')
          rawGarbage.metaGarbage = rawResponse
            .split('<meta')
            ?.map((raw) => {
              rawGarbage.rawValue = raw
                ?.split('/>')?.[0]
                ?.trim()
                ?.replaceAll('"', '')

              if (
                rawGarbage.rawValue?.startsWith(`property=og:`) &&
                rawGarbage.rawValue?.includes(`content=`)
              )
                return (
                  `"` +
                  rawGarbage.rawValue
                    ?.slice(
                      rawGarbage.rawValue.lastIndexOf('property=og:') + 12,
                      rawGarbage.rawValue.lastIndexOf('content='),
                    )
                    ?.toLowerCase()
                    ?.trim() +
                  `"` +
                  ':' +
                  `"` +
                  rawGarbage.rawValue?.slice(
                    rawGarbage.rawValue.lastIndexOf('content=') + 8,
                  ) +
                  `"`
                )
            })
            ?.filter(Boolean)
          rawGarbage.metaGarbage = JSON.parse(
            '{' + rawGarbage.metaGarbage + '}',
          )
          rawGarbage.scriptGarbage = JSON.parse(
            rawResponse
              .split('<script type="application/ld+json"')
              ?.map((raw) =>
                raw
                  ?.split('">')?.[1]
                  ?.split('</script>')?.[0]
                  ?.replaceAll(/\\u0040/g, ''),
              )
              ?.filter(Boolean)[1],
          )
          rawStructure = {
            ...rawGarbage.metaGarbage,
            author: { ...rawGarbage.scriptGarbage },
          }
          rawGarbage.edgeGarbage = await utils.#__miscParser({
            jsonValue: rawResponse,
            depth: (raw) =>
              raw?.child
                ?.find((char) => char?.tag === 'html')
                ?.child?.find((char) => char?.tag === 'body')
                ?.child?.filter((char) => char?.tag === 'script')
                ?.find((char) =>
                  char?.child?.find((char2) =>
                    char2?.text?.includes('video_home_sections'),
                  ),
                )
                ?.child?.find((char2) =>
                  char2?.text?.includes('video_home_sections'),
                )?.text,
          })
          utils.#__cacheTemp(rawGarbage.edgeGarbage, 'cache.js')
          const functions = require('../cache/cache')
          console.log(functions)
         // console.log(rawGarbage.edgeGarbage)

        default:
          return undefined
      }
    } catch (rawError) {
      return utils.__errorHandling(rawError)
    }
  }
  static async #__miscParser(rawJsonParser) {
    if (rawJsonParser?.jsonValue && !rawJsonParser?.depth)
      return JSON.parse(rawJsonParser?.jsonValue)
    else if (rawJsonParser?.jsonValue && rawJsonParser?.depth) {
      let rawObject = htmlParser(rawJsonParser?.jsonValue)
      return rawJsonParser?.depth(rawObject)
    }
  }

  static #__cacheTemp(rawData, fileName = '__fbWatchPage.html') {
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
