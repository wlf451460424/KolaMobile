import Toast from '@common/toast'

const install = Vue => {
  if (install.installed) return
  install.installed = true
  Object.defineProperties(Vue.prototype, {
    $toast: {
      get () {
        return Toast
      }
    }
  })
}

export default install
