const utils = require('../Utils/__defaultUtils')

class facebookSearch {
  static __facebookSearchUrls = {
    base: '',
  }
  static async html(rawQuery, __scrapperOptions) {
    if (!(rawQuery && typeof rawQuery === 'string' && rawQuery !== ''))
      return undefined
    try {
      let rawBody = await utils.__rawfetchBody()
    } catch (rawError) {
      if (__scrapperOptions?.ignoreError) return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
}
