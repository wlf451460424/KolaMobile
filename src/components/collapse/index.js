import VmCollapse from './Collapse.vue'
import VmCollapseItem from './CollapseItem.vue'
import './styles/less/index.less'

const install = function (Vue, opts = {}) {
  if (install.installed) return
  Vue.component(VmCollapse.name, VmCollapse)
  Vue.component(VmCollapseItem.name, VmCollapseItem)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  VmCollapse,
  VmCollapseItem
}

export default {
  install,
  VmCollapse,
  VmCollapseItem
}
