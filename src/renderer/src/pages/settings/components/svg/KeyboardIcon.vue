<template>
  <svg class="keyboard-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="7" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="17" cy="12" r="1" />
  </svg>
</template>

<style scoped>
.keyboard-icon {
  width: 36px;
  height: 36px;
  stroke-width: 2;
  color: #60a5fa;
  margin: 0 auto;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
