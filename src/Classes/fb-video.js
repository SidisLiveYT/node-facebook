const utils = require('../Utils/__defaultUtils')

class Video {
  #__raw = undefined
  static __fbVideoRegex = [
    /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/,
    /^https?:\/\/www\.(facebook|fb)\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/gm,
    /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/,
    /^(?:(https?):\/\/)?(?:(?:www|m|)\.)?(fb\.com|fb\.watch|facebook\.com|facebook\.watch)\/(.*)$/,
  ]
  constructor(rawParsed, raw, filters) {
    if (raw) this.#__raw = raw
    this.#__patch(rawParsed, filters)
  }
  static __test(rawUrl, returnRegex = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) return false
      return returnRegex &&
        Boolean(Video.__fbVideoRegex.find((regExp) => regExp.test(rawUrl)))
        ? rawUrl?.match(
            Video.__fbVideoRegex.find((regExp) => rawUrl.match(regExp)),
          ) ?? false
        : Boolean(Video.__fbVideoRegex.find((regExp) => regExp.test(rawUrl)))
    } catch {
      return false
    }
  }
  static async __extractor(rawUrl, __scrapperOptions, __cacheMain) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== ''))
        return undefined
      let rawResponse = await utils.__rawfetchBody(
        rawUrl,
        __scrapperOptions?.fetchOptions,
      )
      if (
        !(rawResponse && typeof rawResponse === 'string' && rawResponse !== '')
      )
        return undefined
      let rawParsed = await utils.__customParser(rawResponse, 'videos')
      if (!rawParsed) return undefined
      else return rawParsed
    } catch (rawError) {
      if (__scrapperOptions?.ignoreError) return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
  #__patch(rawData, filters) {}
}
Video.__extractor(
  'https://www.facebook.com/watch/137467406327387/2145595139079745',
)
module.exports = Video
