import { createApp, h, ref, App } from 'vue'
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
  duration: number
}

const messageQueue = ref<MessageInstance[]>([])

const MESSAGE_GAP = 16
const MESSAGE_HEIGHT = 60
const MAX_VISIBLE_MESSAGES = 5
const ANIMATION_DURATION = 300

// 使用 CSS 过渡更新消息位置
function updateMessagePositions() {
  let currentOffset = 20
  messageQueue.value.forEach((msg) => {
    msg.offset = currentOffset

    // 为每个消息元素应用平滑过渡
    const messageEl = document.getElementById(`message-wrapper-${msg.id}`)
    if (messageEl) {
      const itemEl = messageEl.querySelector('.message-item') as HTMLElement
      if (itemEl) {
        itemEl.style.transition = 'all 0.3s ease'
        itemEl.style.top = `${currentOffset}px`
      }
    }

    currentOffset += MESSAGE_HEIGHT + MESSAGE_GAP
  })
}

function removeMessage(id: string) {
  const index = messageQueue.value.findIndex((msg) => msg.id === id)
  if (index !== -1) {
    messageQueue.value.splice(index, 1)
    updateMessagePositions()
  }
}

function getMessageContainer() {
  let container = document.getElementById(MESSAGE_CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = MESSAGE_CONTAINER_ID
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.zIndex = '9999'
    container.style.pointerEvents = 'none'
    document.body.appendChild(container)
  }
  return container
}

function generateId() {
  return `message-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// 辅助函数，将消息添加到 DOM
function addMessageToDOM(options: {
  id: string
  type: MessageType
  content: string
  offset: number
  duration: number
  onClose: () => void
}) {
  const { id, type, content, offset, duration, onClose } = options
  const messageContainer = getMessageContainer()

  // 创建挂载节点
  const mountNode = document.createElement('div')
  mountNode.id = `message-wrapper-${id}`
  mountNode.style.pointerEvents = 'auto'
  messageContainer.appendChild(mountNode)

  // 创建应用实例
  const messageInstance = createApp({
    render() {
      return h(Message, {
        id,
        type,
        content,
        offset,
        duration,
        onClose
      })
    }
  })

  // 挂载组件
  messageInstance.mount(mountNode)

  return {
    mountNode,
    instance: messageInstance
  }
}

export function message(options: MessageOptions | string) {
  const _options = typeof options === 'string' ? { content: options } : options

  const id = generateId()
  const type = _options.type || 'info'
  const content = _options.content
  const duration = _options.duration || 5 * 1_000

  // 存储每个消息的定时器和实例
  const timers = new Map<string, { timer: number | null; instance: App<Element> }>()

  // 关闭消息的函数（定义在这里使所有闭包都能访问）
  function closeMessage(messageId: string) {
    const index = messageQueue.value.findIndex((msg) => msg.id === messageId)
    if (index === -1) return // 消息不在队列中

    const element = document.getElementById(`message-wrapper-${messageId}`)
    if (element) {
      const messageEl = element.querySelector('.message-item') as HTMLElement
      if (messageEl) {
        messageEl.style.opacity = '0'
        messageEl.style.transform = 'translate(-50%, -20px)'
      }

      // 查找消息对应的定时器和实例变量
      const timerFunctions = timers.get(messageId)
      if (timerFunctions?.timer) {
        clearTimeout(timerFunctions.timer)
      }

      setTimeout(() => {
        removeMessage(messageId)
        // 如果有存储的实例，卸载它
        if (timerFunctions?.instance) {
          timerFunctions.instance.unmount()
        }
        element.remove()
      }, ANIMATION_DURATION)
    } else {
      removeMessage(messageId)
    }
  }

  // 检查是否需要先移除最旧的消息
  if (messageQueue.value.length >= MAX_VISIBLE_MESSAGES) {
    const oldestId = messageQueue.value[0].id
    const oldestElement = document.getElementById(`message-wrapper-${oldestId}`)

    // 带动画移除最旧的消息
    if (oldestElement) {
      const messageEl = oldestElement.querySelector('.message-item') as HTMLElement
      if (messageEl) {
        messageEl.style.opacity = '0'
        messageEl.style.transform = 'translate(-50%, -20px)'
      }

      // 首先从队列中移除并更新位置
      removeMessage(oldestId)

      // 等待动画完成后，从 DOM 中移除并添加新消息
      setTimeout(() => {
        // 如果元素仍存在，从 DOM 中移除
        if (document.getElementById(`message-wrapper-${oldestId}`)) {
          document.getElementById(`message-wrapper-${oldestId}`)?.remove()
        }

        // 现在添加新消息
        addNewMessage()
      }, ANIMATION_DURATION)

      // 提前返回关闭函数
      return {
        close: () => closeMessage(id)
      }
    } else {
      // 如果找不到元素，只从队列中移除
      removeMessage(oldestId)
    }
  }

  // 添加新消息的函数
  function addNewMessage() {
    // 添加到队列
    messageQueue.value.push({
      id,
      type,
      content,
      offset: 0,
      duration
    })

    // 更新所有消息位置
    updateMessagePositions()

    // 将消息添加到 DOM
    const { instance } = addMessageToDOM({
      id,
      type,
      content,
      offset: messageQueue.value.find((msg) => msg.id === id)?.offset || 0,
      duration,
      onClose: () => closeMessage(id)
    })

    // 设置自动关闭定时器
    const timer = window.setTimeout(() => {
      closeMessage(id)
    }, duration)

    // 存储定时器和实例以便后续清理
    timers.set(id, { timer, instance })
  }

  // 如果不需要先移除旧消息，立即添加新消息
  if (messageQueue.value.length < MAX_VISIBLE_MESSAGES) {
    addNewMessage()
  }

  return {
    close: () => closeMessage(id)
  }
}

message.info = (content: string, duration?: number) => message({ content, type: 'info', duration })

message.success = (content: string, duration?: number) =>
  message({ content, type: 'success', duration })

message.error = (content: string, duration?: number) =>
  message({ content, type: 'error', duration })
