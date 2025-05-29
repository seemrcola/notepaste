import type { RouteRecordRaw } from 'vue-router'

function loadRoutes() {
  const routes = import.meta.glob('../pages/**/route.ts', {
    eager: true
  })
  const routesArray = Object.values(routes).map((route: any) => route.default)
  return routesArray as RouteRecordRaw[]
}

export { loadRoutes }
