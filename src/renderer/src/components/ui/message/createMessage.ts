import { createApp, ref } from 'vue'
import Message from './Message.vue'

export type MessageType = 'info' | 'success' | 'error'

const MESSAGE_CONTAINER_ID = 'ui-message-container'

export interface MessageOptions {
  content: string
  type?: MessageType
  duration?: number
}

interface MessageInstance {
  id: string
  type: MessageType
  content: string
  offset: number
  element: HTMLElement
  cleanup: () => void
}

const messageQueue = ref<MessageInstance[]>([])

const MESSAGE_GAP = 16
const MESSAGE_HEIGHT = 60
const MAX_VISIBLE_MESSAGES = 5
const ANIMATION_DURATION = 300

// 应用淡出动画
function applyFadeOutAnimation(element: HTMLElement) {
  const messageEl = element.querySelector('.message-item') as HTMLElement
  if (messageEl) {
    messageEl.style.opacity = '0'
    messageEl.style.transform = 'translate(-50%, -20px)'
  }
}

// 更新消息位置
function updateMessagePositions() {
  let currentOffset = 20
  messageQueue.value.forEach((msg) => {
    msg.offset = currentOffset
    const messageEl = msg.element.querySelector('.message-item') as HTMLElement
    if (messageEl) {
      messageEl.style.transition = 'all 0.3s ease'
      messageEl.style.top = `${currentOffset}px`
    }
    currentOffset += MESSAGE_HEIGHT + MESSAGE_GAP
  })
}

function removeMessage(id: string) {
  const index = messageQueue.value.findIndex((msg) => msg.id === id)
  if (index !== -1) {
    const msg = messageQueue.value[index]
    msg.cleanup()
    messageQueue.value.splice(index, 1)
    updateMessagePositions()
  }
}

function getMessageContainer() {
  let container = document.getElementById(MESSAGE_CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = MESSAGE_CONTAINER_ID
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      zIndex: '9999',
      pointerEvents: 'none'
    })
    document.body.appendChild(container)
  }
  return container
}

function generateId() {
  return `message-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// 创建消息元素
function createMessageElement(options: {
  id: string
  type: MessageType
  content: string
  onClose: () => void
}) {
  const { id, type, content, onClose } = options
  const messageContainer = getMessageContainer()

  // 创建挂载节点
  const mountNode = document.createElement('div')
  mountNode.id = `message-wrapper-${id}`
  mountNode.style.pointerEvents = 'auto'
  messageContainer.appendChild(mountNode)

  // 创建应用实例并挂载
  const app = createApp(Message, {
    type,
    content,
    offset: 0,
    onClose
  })

  app.mount(mountNode)

  return {
    element: mountNode,
    cleanup: () => {
      app.unmount()
      mountNode.remove()
    }
  }
}

export function message(options: MessageOptions | string) {
  const _options = typeof options === 'string' ? { content: options } : options

  const id = generateId()
  const type = _options.type || 'info'
  const content = _options.content
  const duration = _options.duration || 5000

  // 关闭消息
  function closeMessage(messageId: string) {
    const msgInstance = messageQueue.value.find((msg) => msg.id === messageId)
    if (!msgInstance) return

    applyFadeOutAnimation(msgInstance.element)
    setTimeout(() => removeMessage(messageId), ANIMATION_DURATION)
  }

  // 添加新消息
  function addNewMessage() {
    const { element, cleanup } = createMessageElement({
      id,
      type,
      content,
      onClose: () => closeMessage(id)
    })

    const msgInstance: MessageInstance = {
      id,
      type,
      content,
      offset: 0,
      element,
      cleanup
    }

    messageQueue.value.push(msgInstance)
    updateMessagePositions()

    // 自动关闭定时器
    setTimeout(() => closeMessage(id), duration)
  }

  // 检查队列是否已满
  if (messageQueue.value.length >= MAX_VISIBLE_MESSAGES) {
    const oldestMsg = messageQueue.value[0]
    applyFadeOutAnimation(oldestMsg.element)
    removeMessage(oldestMsg.id)
    setTimeout(addNewMessage, ANIMATION_DURATION)
  } else {
    addNewMessage()
  }

  return {
    close: () => closeMessage(id)
  }
}

// 便捷方法
message.info = (content: string, duration?: number) => message({ content, type: 'info', duration })

message.success = (content: string, duration?: number) =>
  message({ content, type: 'success', duration })

message.error = (content: string, duration?: number) =>
  message({ content, type: 'error', duration })
