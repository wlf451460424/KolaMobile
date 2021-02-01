import AppHeaderLottery from '@components/AppHeaderLottery'

const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component(AppHeaderLottery.name, AppHeaderLottery)
}

export default {
  AppHeaderLottery,
  install
}
