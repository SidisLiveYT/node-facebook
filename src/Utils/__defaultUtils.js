const Axios = require('axios').default

class utils {
  static async __rawfetchBody(
    rawApiUrl,
    apiOptions,
    returnType = 'body',
    ignoreError = true,
    filters,
  ) {
    if (!(rawApiUrl && typeof rawApiUrl === 'string' && rawApiUrl !== ''))
      return undefined
    try {
      Axios.get(rawApiUrl)
    } catch (rawError) {
      if (ignoreError) return utils.__errorHandling(rawError)
      else throw rawError
    }
  }
  static __errorHandling(error = new Error()) {
    if (!error?.message) return undefined
    if (!fileSystem.existsSync(path.join(__dirname, '/cache')))
      fileSystem.mkdirSync(path.join(__dirname, '/cache'))
    const __cacheLocation = path.join(__dirname, '/cache', '/__errorLogs.txt')
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
