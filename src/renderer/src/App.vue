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
  width: 100%;
  border-radius: 12px;
}
</style>
