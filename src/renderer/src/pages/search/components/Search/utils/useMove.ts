import { ref, onMounted, onUnmounted } from 'vue'

export function useMove(paretSelector: string, items: any[]) {
  // 注册事件 键盘上下会选中
  const curIndex = ref(0)

  let len = items.length

  function reset(items: any[]) {
    curIndex.value = 0
    len = items.length
  }

  const keyMap = {
    ArrowUp: up,
    ArrowDown: down
  }

  function up(e: KeyboardEvent) {
    e.preventDefault()
    e.stopPropagation()
    curIndex.value === 0 ? void 0 : curIndex.value--
    scrollToCurrentIndex()
  }

  function down(e: KeyboardEvent) {
    e.preventDefault()
    e.stopPropagation()
    curIndex.value === len - 1 ? void 0 : curIndex.value++
    scrollToCurrentIndex()
  }

  function scrollToCurrentIndex() {
    const selector = `${paretSelector} li:nth-child(${curIndex.value + 1})`
    const dom = document.querySelector(selector)
    if (dom) dom.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }

  function keyup(e: KeyboardEvent) {
    const fn = keyMap[e.key as keyof typeof keyMap]
    if (fn) fn(e)
  }

  onMounted(() => {
    window.addEventListener('keydown', keyup)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', keyup)
  })

  return {
    curIndex,
    reset
  }
}
