import { Toast } from 'cube-ui'
let toast
let needLoadingRequestCount = 0

const ToastUtils = {
  // 显示文本
  showText (text, type = 'txt') {
    toast = Toast.$create({
      time: 2000, // 默认2s
      type: type,
      txt: text
    })
    toast.show()
  },

  showLoading (text = '正在加载中...') {
    if (needLoadingRequestCount === 0) {
      toast = Toast.$create({
        time: 0,
        txt: text,
        mask: true
      })
      toast.show()
    }
  },
  hideLoading () {
    toast && toast.hide()
  },
  showFullScreenLoading () {
    if (needLoadingRequestCount === 0) {
      this.showLoading()
    }
    needLoadingRequestCount++
  },
  tryHideFullScreenLoading () {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
      setTimeout(this.hideLoading, 500)
    }
  }
}

export default ToastUtils
