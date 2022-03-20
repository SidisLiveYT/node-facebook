const { JSDOM } = require('jsdom')
const utils = require('../Utils/__defaultUtils')

class facebookTrack {
  static __fbVideoRegex = [
    /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/,
    /^https?:\/\/www\.(facebook|fb)\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/gm,
    /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/,
    /^(?:(https?):\/\/)?(?:(?:www|m|)\.)?(fb\.com|fb\.watch|facebook\.com|facebook\.watch)\/(.*)$/,
  ]
  #__private = {
    rawResponse: undefined,
    rawJson: undefined,
    extraContents: undefined,
    __scrapperOptions: undefined,
  }
  constructor(rawResponse, __scrapperOptions, extraContents) {
    this.#__private.rawResponse = rawResponse
    this.#__private.extraContents = extraContents
    this.#__private.__scrapperOptions = __scrapperOptions
    this.#patch(rawResponse, extraContents, false)
  }
  static __test(rawUrl, returnRegex = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) return false
      return returnRegex &&
        Boolean(
          facebookTrack.__fbVideoRegex.find((regExp) => regExp.test(rawUrl)),
        )
        ? rawUrl?.match(
            facebookTrack.__fbVideoRegex.find((regExp) => rawUrl.match(regExp)),
          ) ?? false
        : Boolean(
            facebookTrack.__fbVideoRegex.find((regExp) => regExp.test(rawUrl)),
          )
    } catch {
      return false
    }
  }
  #patch(rawResponse, extraContents, returnOnly = false) {
    try {
      const rawJsonResponse = JSON.parse(
          '{' +
            rawResponse
              ?.split('<meta ')
              ?.filter((raw) => raw && raw?.includes('content='))
              ?.map((raw) => {
                try {
                  raw = raw?.split('>')?.[0]
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
                      ?.replace(' /', '')
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
                      ?.replace(' /', '')
                      ?.trim()}`
                  } else return undefined
                } catch {
                  return undefined
                }
              })
              ?.filter(Boolean)
              ?.join(',') +
            '}',
        ),
        cookedStructure = {}
      this.#__private.rawJson = { ...rawJsonResponse, ...extraContents }
      if (this.#__private?.__scrapperOptions?.parseRaw)
        cookedStructure = this.parseRaw()
      else cookedStructure = this.#__private.rawJson
      if (returnOnly) return cookedStructure
      else if (cookedStructure && typeof cookedStructure === 'object')
        return Object.assign(this, cookedStructure)
      else return undefined
    } catch (rawError) {
      if (this.#__private?.__scrapperOptions?.ignoreError)
        return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
  parseRaw(rawObject = this.#__private?.rawJson) {
    if (!(rawObject && typeof rawObject === 'object')) return undefined
    let rawEntries = Object.entries(rawObject),
      cookedStructure = {}
    if (!(rawEntries && Array.isArray(rawEntries) && rawEntries?.length > 0))
      return undefined
    cookedStructure['title'] = rawEntries?.find(
      (raw) => raw?.[0] && raw?.[1] && raw[0] === 'title',
    )?.[1]
    return cookedStructure
  }
  static async html(rawUrl, __scrapperOptions, __cacheMain) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== ''))
        return undefined
      let rawResponse = await utils.__rawfetchBody(
        rawUrl.replace('/m.', '/www'),
        __scrapperOptions?.fetchOptions,
      )
      if (
        !(rawResponse && typeof rawResponse === 'string' && rawResponse !== '')
      )
        return undefined
      let rawTrack = new facebookTrack(rawResponse, __scrapperOptions)
      return rawTrack
    } catch (rawError) {
      if (__scrapperOptions?.ignoreError) return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
}
facebookTrack.html(
  'https://www.facebook.com/tseriesmusic/videos/274225804873438',
)
module.exports = facebookTrack
