export function setSessionStorage (key, val) {
  sessionStorage.setItem(key, val)
}

export function getSessionStorage (key) {
  return sessionStorage.getItem(key)
}

export function removeSessionStorage (key) {
  sessionStorage.removeItem(key)
}

export function setLocalStorage (key, val) {
  localStorage.setItem(key, val)
}

export function getLocalStorage (key) {
  return localStorage.getItem(key)
}

export function removeLocalStorage (key) {
  localStorage.removeItem(key)
}
