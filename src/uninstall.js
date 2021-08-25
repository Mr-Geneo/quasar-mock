const rimraf = require('rimraf')

module.exports = function (api) {
  if (api.prompts.template) {
    rimraf.sync(api.resolve.app('mock'))
  }
}
