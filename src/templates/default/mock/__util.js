function resultSuccess(result, { message = 'ok' } = {}) {
  return {
    code: 0,
    result,
    message,
    type: 'success',
  }
}

function resultPageSuccess(page, pageSize, list, { message = 'ok' } = {}) {
  const pageData = pagination(page, pageSize, list)

  return {
    ...resultSuccess({
      items: pageData,
      total: list.length,
    }),
    message,
  }
}

function resultError(message = 'Request failed', { code = -1, result = null } = {}) {
  return {
    code,
    result,
    message,
    type: 'error',
  }
}

function pagination(pageNo, pageSize, array) {
  const offset = (pageNo - 1) * Number(pageSize)
  const ret =
    offset + Number(pageSize) >= array.length
      ? array.slice(offset, array.length)
      : array.slice(offset, offset + Number(pageSize))
  return ret
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
function getRequestToken({ headers }) {
  return headers ? headers.authorization : ''
}

module.exports = {
  getRequestToken,
  pagination,
  resultError,
  resultPageSuccess,
  resultSuccess,
}
