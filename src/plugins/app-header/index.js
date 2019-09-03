import AppHeader from '@components/AppHeader'

const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component(AppHeader.name, AppHeader)
}

export default {
  AppHeader,
  install
}
