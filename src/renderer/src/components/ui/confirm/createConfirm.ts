import { createApp } from 'vue'
import Confirm from './Confirm.vue'

export interface ConfirmOptions {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
}

const CONFIRM_CONTAINER_ID = 'ui-confirm-container'

function getConfirmContainer() {
  let container = document.getElementById(CONFIRM_CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = CONFIRM_CONTAINER_ID
    document.body.appendChild(container)
  }
  return container
}

export function confirm(options: ConfirmOptions | string): Promise<boolean> {
  const _options = typeof options === 'string' ? { content: options } : options

  return new Promise((resolve) => {
    const container = getConfirmContainer()

    function cleanup() {
      app.unmount()
      // 清空容器内容
      container.innerHTML = ''
    }

    function handleConfirm() {
      cleanup()
      resolve(true)
    }

    function handleCancel() {
      cleanup()
      resolve(false)
    }

    const app = createApp(Confirm, {
      title: _options.title,
      content: _options.content,
      confirmText: _options.confirmText,
      cancelText: _options.cancelText,
      onConfirm: handleConfirm,
      onCancel: handleCancel
    })

    app.mount(container)
  })
}
