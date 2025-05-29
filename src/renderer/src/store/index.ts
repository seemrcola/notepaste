import { createPinia } from 'pinia'
import type { App } from 'vue'

function setupStore(app: App) {
  const pinia = createPinia()
  app.use(pinia)
}

export { setupStore }
