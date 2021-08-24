/* eslint-disable @typescript-eslint/no-var-requires */
const { resultError, resultSuccess, getRequestToken } = require('../_util')

function createFakeUserList() {
  return [
    {
      userId: '1',
      username: 'test1',
      realName: '123456',
      token: 'fakeToken1',
    },
    {
      userId: '2',
      username: 'test2',
      password: '123456',
      token: 'fakeToken2',
    },
  ]
}

module.exports = [
  // mock user login
  {
    url: '/mock-api/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const checkUser = createFakeUserList().find((item) => item.username === username && password === item.password)
      if (!checkUser) {
        return resultError('Incorrect account or password！')
      }
      const { userId, username: _username, token } = checkUser
      return resultSuccess({
        userId,
        username: _username,
        token,
      })
    },
  },
  {
    url: '/mock-api/userinfo',
    method: 'get',
    response: (request) => {
      const token = getRequestToken(request)
      if (!token) return resultError('Invalid token')
      const checkUser = createFakeUserList().find((item) => item.token === token)
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!')
      }
      return resultSuccess(checkUser)
    },
  },
  {
    url: '/mock-api/logout',
    timeout: 200,
    method: 'get',
    response: (request) => {
      const token = getRequestToken(request)
      if (!token) return resultError('Invalid token')
      const checkUser = createFakeUserList().find((item) => item.token === token)
      if (!checkUser) {
        return resultError('Invalid token!')
      }
      return resultSuccess(undefined, { message: 'Token has been destroyed' })
    },
  },
]
