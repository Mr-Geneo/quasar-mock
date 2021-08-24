const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const { parse } = require('url')
const fg = require('fast-glob')
const Mock = require('mockjs')
const { pathToRegexp, match } = require('path-to-regexp')

const { isArray, isFunction, sleep, isRegExp } = require('./utils')

let mockData = []

async function createMockServer(opt = { mockPath: 'mock' }) {
  opt = {
    mockPath: 'mock',
    watchFiles: true,
    logger: true,
    ...opt,
  }

  if (mockData.length > 0) return
  mockData = await getMockConfig(opt)
  createWatch(opt)
}

// request match
async function requestMiddleware(opt) {
  const { logger = true } = opt
  const middleware = async (req, res, next) => {
    let queryParams = {}

    if (req.url) {
      queryParams = parse(req.url, true)
    }

    const reqUrl = queryParams.pathname

    const matchRequest = mockData.find((item) => {
      if (!reqUrl || !item || !item.url) {
        return false
      }
      if (item.method && item.method.toUpperCase() !== req.method) {
        return false
      }
      return pathToRegexp(item.url).test(reqUrl)
    })

    if (matchRequest) {
      const isGet = req.method && req.method.toUpperCase() === 'GET'
      const { response, rawResponse, timeout, statusCode, url } = matchRequest

      if (timeout) {
        await sleep(timeout)
      }

      const urlMatch = match(url, { decode: decodeURIComponent })

      let query = queryParams.query
      if (reqUrl) {
        if ((isGet && JSON.stringify(query) === '{}') || !isGet) {
          const params = urlMatch(reqUrl).params
          if (JSON.stringify(params) !== '{}') {
            query = urlMatch(reqUrl).params || {}
          } else {
            query = queryParams.query || {}
          }
        }
      }

      if (isFunction(rawResponse)) {
        await rawResponse(req, res)
      } else {
        const body = await parseJson(req)
        const mockResponse = isFunction(response)
          ? response({ url: req.url, body, query, headers: req.headers })
          : response
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = statusCode || 200
        res.end(JSON.stringify(Mock.mock(mockResponse)))
      }

      logger && loggerOutput('request invoke', req.url)
      return
    }
    next()
  }
  return middleware
}

// create watch mock
function createWatch(opt) {
  const { logger, watchFiles } = opt

  if (!watchFiles) {
    return
  }

  const { absMockPath } = getPath(opt)

  const watchDir = []

  watchDir.push(absMockPath)

  const watcher = chokidar.watch(watchDir, {
    ignoreInitial: true,
  })

  watcher.on('all', (event, file) => {
    logger && loggerOutput(`mock file ${event}`, file)
    mockData = getMockConfig(opt)
  })
}

// clear cache
function cleanRequireCache(opt) {
  if (!require.cache) {
    return
  }
  const { absMockPath } = getPath(opt)
  Object.keys(require.cache).forEach((file) => {
    if (file.indexOf(absMockPath) > -1) {
      delete require.cache[file]
    }
  })
}

function parseJson(req) {
  return new Promise((resolve) => {
    let body = ''
    let jsonStr = ''
    req.on('data', function (chunk) {
      body += chunk
    })
    req.on('end', function () {
      try {
        jsonStr = JSON.parse(body)
      } catch (err) {
        jsonStr = ''
      }
      resolve(jsonStr)
      return
    })
  })
}

async function getMockConfig(opt) {
  cleanRequireCache(opt)
  const { absMockPath } = getPath(opt)
  const { ignore } = opt
  let ret = []
  const mockFiles = fg
    .sync('**/*.{ts,js}', {
      cwd: absMockPath,
    })
    .filter((item) => {
      if (!ignore) {
        return true
      }
      if (isFunction(ignore)) {
        return ignore(item)
      }
      if (isRegExp(ignore)) {
        return !ignore.test(path.basename(item))
      }
      return true
    })
  try {
    ret = []
    const resolveModulePromiseList = []

    for (let index = 0; index < mockFiles.length; index++) {
      const mockFile = mockFiles[index]
      resolveModulePromiseList.push(resolveModule(path.join(absMockPath, mockFile)))
    }

    const loadAllResult = await Promise.all(resolveModulePromiseList)
    for (const resultModule of loadAllResult) {
      let mod = resultModule
      if (!isArray(mod)) {
        mod = [mod]
      }
      ret = [...ret, ...mod]
    }
    loggerOutput('mock reload success', mockFiles, 'info')
  } catch (error) {
    loggerOutput('mock reload error', error)
    ret = []
  }
  return ret
}

async function resolveModule(p) {
  const raw = await require(p)
  return raw.__esModule ? raw.default : raw
}

function getPath(opt) {
  const { mockPath } = opt
  const cwd = process.cwd()
  const absMockPath = path.join(cwd, mockPath || '')
  return {
    absMockPath,
  }
}

function loggerOutput(title, msg, type) {
  const tag = type === 'info' ? chalk.cyan.bold('[quasar:mock]') : chalk.red.bold('[quasar:mock-server]')
  return console.log(` ${chalk.green('App •')} ${tag} ${chalk.green(title)} ${chalk.dim(msg)}`)
}

module.exports = {
  mockData,
  createMockServer,
  requestMiddleware,
}
