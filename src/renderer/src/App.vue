<script setup lang="ts"></script>

<template>
  <div class="app-container">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <!-- 主要内容 -->
          <component :is="Component"></component>
          <!-- 加载中状态 -->
          <template #fallback> 正在加载... </template>
        </Suspense>
      </template>
    </RouterView>
  </div>
</template>

<style>
.app-container {
  padding: 1rem;
  width: 100%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style>
