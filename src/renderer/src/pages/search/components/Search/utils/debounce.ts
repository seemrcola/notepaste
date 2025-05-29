export function debounce<T extends (searchTerm: string) => void>(fn: T, delay: number): T {
  let timer: number | null = null
  return function (this: unknown, searchTerm: string) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this, searchTerm)
      timer = null
    }, delay) as unknown as number
  } as T
}
