const utils = require('../Utils/__defaultUtils')
const https = require('https')
const http = require('http')

class facebookTrack {
  static __fbVideoRegex = [
    /^https?:\/\/www\.facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/gim,
    /^http(?:s?):\/\/(?:www\.|web\.|m\.)?facebook\.com\/([A-z0-9\.]+)\/videos(?:\/[0-9A-z].+)?\/(\d+)(?:.+)?$/gm,
  ]
  static __fbVideoParsingRegex = /^http(?:s?):\/\/(?:www\.|web\.|m\.)?facebook\.com\/([A-z0-9\.]+)\/videos(?:\/[0-9A-z].+)?\/(\d+)(?:.+)?$/gm
  static __scrapperOptions = {
    htmlOptions: undefined,
    fetchOptions: { fetchStreamable: true },
    ignoreError: true,
    parseRaw: true,
  }
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
      return returnRegex && facebookTrack.__fbVideoParsingRegex.test(rawUrl)
        ? facebookTrack.__fbVideoParsingRegex.exec(rawUrl) ?? false
        : Boolean(
            facebookTrack.__fbVideoRegex.find((regExp) => regExp.test(rawUrl)),
          )
    } catch {
      return false
    }
  }
  #patch(rawResponse, extraContents, returnOnly = false) {
    try {
      let rawJsonResponse = JSON.parse(
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
            '}',
        ),
        cookedStructure = {}

      this.#__private.rawJson = {
        ...rawJsonResponse,
        ...extraContents,
        streamMetadata: {
          url:
            rawJsonResponse['video'] ??
            rawJsonResponse['video_url'] ??
            rawJsonResponse['video_secure_url'],
        },
      }
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
    try {
      let rawEntries = Object.entries(rawObject),
        cookedStructure = {}
      if (!(rawEntries && Array.isArray(rawEntries) && rawEntries?.length > 0))
        return undefined
      cookedStructure['title'] =
        rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'title',
        )?.[1] ??
        rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'twitter_title',
        )?.[1]
      cookedStructure['description'] = rawEntries?.find(
        (raw) => raw?.[0] && raw?.[1] && raw[0] === 'description',
      )?.[1]
      cookedStructure['url'] = rawEntries?.find(
        (raw) => raw?.[0] && raw?.[1] && raw[0] === 'url',
      )?.[1]
      cookedStructure['image'] =
        rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'image',
        )?.[1] ??
        rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'twitter_image',
        )?.[1]
      cookedStructure['twitter'] = {
        card: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'twitter_card',
        )?.[1],
        title: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'twitter_title',
        )?.[1],
        site: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'twitter_site',
        )?.[1],
        image: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'twitter_image',
        )?.[1],
      }
      cookedStructure['htmlPlayer'] = {
        url: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'twitter_player',
        )?.[1],
        width: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'twitter_player_width',
        )?.[1],
        height: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'twitter_player_height',
        )?.[1],
      }
      cookedStructure['videoMetadata'] = {
        type: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'video_type',
        )?.[1],
        url: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'video_url',
        )?.[1],
        secureUrl: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'video_secure_url',
        )?.[1],
        width: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'video_width',
        )?.[1],
        height: rawEntries?.find(
          (raw) => raw?.[0] && raw?.[1] && raw[0] === 'video_height',
        )?.[1],
      }
      try {
        cookedStructure['itunes'] = JSON.parse(
          `{${rawEntries
            ?.find(
              (raw) => raw?.[0] && raw?.[1] && raw[0] === 'apple_itunes_app',
            )?.[1]
            ?.split(', ')
            ?.filter((raw) => raw && raw?.trim()?.includes('='))
            ?.map(
              (raw) =>
                `"${raw
                  ?.slice(0, raw?.indexOf('='))
                  ?.replace('app-', '')}":"${raw?.slice(
                  raw?.indexOf('=') + 1,
                )}"`,
            )
            ?.join(',')}}`,
        )
      } catch {}
      cookedStructure['streamMetadata'] = rawEntries?.find(
        (raw) => raw?.[0] && raw?.[1] && raw[0] === 'streamMetadata',
      )?.[1]
      cookedStructure['keywords'] = rawEntries
        ?.find((raw) => raw?.[0] && raw?.[1] && raw[0] === 'keywords')?.[1]
        ?.split(',')
        ?.filter(Boolean)
        ?.map((raw) => raw?.trim())

      return cookedStructure
    } catch (rawError) {
      if (this.#__private?.__scrapperOptions?.ignoreError)
        return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
  async getStream(
    fetchUrl = this.streamMetadata?.url ??
      this.videoMetadata?.url ??
      this.#__private?.rawJson?.video ??
      this.#__private?.rawJson?.video_url,
  ) {
    if (!(fetchUrl && typeof fetchUrl === 'string' && fetchUrl !== ''))
      return undefined
    try {
      let requestFunc = fetchUrl?.startsWith('https') ? https : http
      let rawStream = await new Promise((resolve) =>
        requestFunc.get(fetchUrl, (rawResponse) => resolve(rawResponse)),
      )
      if (!rawStream?.socket) return undefined
      Object.assign(this.streamMetadata, {
        ...this.streamMetadata,
        buffer: rawStream,
      })
      return rawStream
    } catch (rawError) {
      if (this.#__private?.__scrapperOptions?.ignoreError)
        return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
  static async html(
    rawUrl,
    __scrapperOptions = facebookTrack.__scrapperOptions,
    __cacheMain,
  ) {
    try {
      if (
        !(
          rawUrl &&
          typeof rawUrl === 'string' &&
          rawUrl !== '' &&
          facebookTrack.__test(rawUrl)
        )
      )
        return undefined
      let rawResponse = await utils.__rawfetchBody(
        rawUrl?.replace(/(m\.|mbasic\.|web\.)/, `www\.`),
        __scrapperOptions?.fetchOptions,
      )
      if (
        !(rawResponse && typeof rawResponse === 'string' && rawResponse !== '')
      )
        return undefined
      let rawTrack = new facebookTrack(rawResponse, __scrapperOptions)
      if (__scrapperOptions?.fetchOptions?.fetchStreamable)
        await rawTrack.getStream()
      return rawTrack
    } catch (rawError) {
      if (__scrapperOptions?.ignoreError) return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
  get videoId() {
    if (!this.url) return undefined
    else
      return parseInt(facebookTrack.__test(this.url, true)?.pop()) ?? undefined
  }
}
new Promise(async () => {
  let res = await facebookTrack.html(
    'https://www.facebook.com/tseriesmusic/videos/778835286411334/',
  )
  console.log(res?.videoId)
})
module.exports = facebookTrack
