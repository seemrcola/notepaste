<template>
  <div
    class="w-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl py-8 pt-2 text-center text-gray-500 dropdown-animation"
  >
    <div class="w-full text-right pr-2">
      <span class="text-xs text-gray-600">Ctrl+/ 聚焦 | ESC 清空</span>
    </div>
    <div class="flex flex-col items-center space-y-4">
      <!-- Simple SVG Icon -->
      <div class="svg-container">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="empty-icon"
        >
          <!-- Magnifying glass circle -->
          <circle
            cx="26"
            cy="26"
            r="16"
            fill="none"
            stroke="#9ca3af"
            stroke-width="3"
            stroke-linecap="round"
          />
          <!-- Magnifying glass handle -->
          <line
            x1="38"
            y1="38"
            x2="50"
            y2="50"
            stroke="#9ca3af"
            stroke-width="3"
            stroke-linecap="round"
          />
          <!-- Question mark -->
          <text
            x="26"
            y="32"
            text-anchor="middle"
            fill="#9ca3af"
            font-size="16"
            font-family="system-ui, -apple-system, sans-serif"
            font-weight="500"
          >
            ?
          </text>
        </svg>
      </div>

      <!-- Text content -->
      <div class="text-content">
        <h4 class="font-medium text-gray-700 mb-1">未找到相关结果</h4>
        <p class="text-sm text-gray-500">尝试使用其他关键词搜索</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-animation {
  animation: slideDown 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.svg-container {
  position: relative;
}

.empty-icon {
  opacity: 0.7;
}

.text-content {
  animation: fadeInUp 0.3s ease-out 0.1s both;
  margin-top: 10px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
