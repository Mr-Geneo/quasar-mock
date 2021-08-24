module.exports = function (api) {
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app', '^3.0.0')
  if (api.prompts.install) {
    api.render('./templates/default')
  }
  api.onExitLog('Thanks for installing mock extension')
}
