import { Dialog } from 'cube-ui'

const DialogUtils = {
  showText (content, confirmBack, cancleBack, confirmBtn, cancelBtn) {
    Dialog.$create({
      type: 'confirm',
      // icon: 'cubeic-alert',
      title: '温馨提示',
      content: content,
      confirmBtn: {
        text: confirmBtn || '确定',
        active: true,
        disabled: false,
        href: 'javascript:;'
      },
      cancelBtn: {
        text: cancelBtn || '取消',
        active: false,
        disabled: false,
        href: 'javascript:;'
      },
      onConfirm: () => {
        confirmBack()
      },
      onCancel: () => {
        if (cancleBack) {
          cancleBack()
        }
      }
    }).show()
  }
}

export default DialogUtils
