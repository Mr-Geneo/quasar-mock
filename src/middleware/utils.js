const fs = require('fs')

const toString = Object.prototype.toString

function is(val, type) {
  return toString.call(val) === `[object ${type}]`
}

function isFunction(val) {
  return is(val, 'Function') || is(val, 'AsyncFunction')
}

function isArray(val) {
  return val && Array.isArray(val)
}

function isRegExp(val) {
  return is(val, 'RegExp')
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, time)
  })
}

function fileExists(f) {
  try {
    fs.accessSync(f, fs.constants.W_OK)
    return true
  } catch (error) {
    return false
  }
}
module.exports = {
  is,
  isFunction,
  isArray,
  isRegExp,
  sleep,
  fileExists,
}
