const rimraf = require('rimraf')

module.exports = function (api) {
  if (api.prompts.install) {
    rimraf.sync(api.resolve.app('mock'))
  }
}
