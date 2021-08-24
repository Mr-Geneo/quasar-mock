const { createMockServer, requestMiddleware } = require('./middleware/createMockServer')

function extendQuasarConf(conf) {
  conf.devServer.onBeforeSetupMiddleware = async ({ app }) => {
    const opt = {
      ignore: /^\_/,
      mockPath: 'mock',
    }
    createMockServer(opt)
    const middleware = await requestMiddleware(opt)
    app.use(middleware)
  }
}

module.exports = function (api) {
  if (api.ctx.dev === true) {
    api.extendQuasarConf(extendQuasarConf)
  }
}
