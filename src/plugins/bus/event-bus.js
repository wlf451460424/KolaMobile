import Vue from 'vue'
const bus = new Vue()
const install = Vue => {
  if (install.installed) { return }

  install.installed = true

  Object.defineProperties(Vue.prototype, {
    $bus: {
      get () {
        return bus
      }
    }
  })
}

export default install
