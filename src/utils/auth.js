import { getSessionStorage, removeSessionStorage, setSessionStorage } from './storage.js'

import store from '../store'

const TokenKey = 'X-Token'
const TokenExpireKey = 'X-TokenExpire'
const defaultRemainSeconds = 180

export function getToken (token) {
  if (token) {
    setToken(token, defaultRemainSeconds * 2)
  }

  const sessionToken = getSessionStorage(TokenKey)
  if (sessionToken) {
    return sessionToken
  }
}

export async function checkToken () {
  var key = getToken()
  if (key) {
    var expireTimestamp = getSessionStorage(TokenExpireKey)
    if (expireTimestamp) {
      var remainSeconds = expireTimestamp - getTimestamp()
      // console.log('token remain seconds:' + remainSeconds)
      if (remainSeconds < defaultRemainSeconds) {
        await store.dispatch('user/refreshToken')
      }
    }
  }
}

export function setToken (token, expireSeconds) {
  setSessionStorage(TokenKey, token)
  setSessionStorage(TokenExpireKey, getTimestamp() + expireSeconds)
}

export function removeToken () {
  removeSessionStorage(TokenKey)
  removeSessionStorage(TokenExpireKey)
}

export function getTimestamp () {
  return Math.floor(Date.now() / 1000)
}
