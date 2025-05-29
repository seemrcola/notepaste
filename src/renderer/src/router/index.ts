import { createRouter, createWebHashHistory } from 'vue-router'
import { loadRoutes } from './loader'
import { baseRoutes } from './base'
import type { App } from 'vue'

function setupRouter(app: App) {
  const routes = loadRoutes()
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [...baseRoutes, ...routes]
  })
  app.use(router)
}

export { setupRouter }
