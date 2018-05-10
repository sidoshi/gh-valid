import nock from 'nock'
import axios from 'axios'

import ghValidate from './'

test('fails fast if no token is provided', async () => {
  const spy = jest.spyOn(axios, 'get')
  const response = await ghValidate('')
  expect(response).toEqual({
    tokenValid: false,
    scopesValid: false,
    scopes: [],
  })
  expect(spy).not.toHaveBeenCalled()

  spy.mockReset()
  spy.mockRestore()
})

test('calls github url with provided token', async () => {
  const token = 'token'
  nock('https://api.github.com', {
    reqheaders: {
      Authorization: `token ${token}`,
    },
  })
    .get('/')
    .reply(200)

  await ghValidate(token)
})

test('gives expected response when token is valid', async () => {
  const token = 'token'
  nock('https://api.github.com', {
    reqheaders: {
      Authorization: `token ${token}`,
    },
  })
    .get('/')
    .times(4)
    .reply(200, {}, { 'x-oauth-scopes': 'notifications, repo' })

  expect(await ghValidate(token)).toEqual({
    scopes: ['notifications', 'repo'],
    scopesValid: true,
    tokenValid: true,
  })
  expect(await ghValidate(token, ['notifications'])).toEqual({
    scopes: ['notifications', 'repo'],
    scopesValid: true,
    tokenValid: true,
  })
  expect(await ghValidate(token, ['notifications', 'repo'])).toEqual({
    scopes: ['notifications', 'repo'],
    scopesValid: true,
    tokenValid: true,
  })
  expect(await ghValidate(token, ['notifications', 'gist'])).toEqual({
    scopes: ['notifications', 'repo'],
    scopesValid: false,
    tokenValid: true,
  })
})

test('gives expected response when token is invalid', async () => {
  const token = 'token'
  nock('https://api.github.com', {
    reqheaders: {
      Authorization: `token ${token}`,
    },
  })
    .get('/')
    .reply(401)

  expect(await ghValidate(token)).toEqual({
    scopes: [],
    scopesValid: false,
    tokenValid: false,
  })
})

test('throws on errors other than 401', async () => {
  expect.assertions(1)
  const token = 'token'
  nock('https://api.github.com', {
    reqheaders: {
      Authorization: `token ${token}`,
    },
  })
    .get('/')
    .reply(500)

  try {
    await ghValidate(token)
  } catch (err) {
    expect(err.response.status).toBe(500)
  }
})
