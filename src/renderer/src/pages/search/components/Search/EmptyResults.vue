<template>
  <div
    class="mt-2 w-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl py-6 text-center text-gray-500 dropdown-animation"
  >
    No results found
  </div>
</template>

<style scoped>
.dropdown-animation {
  animation: slideDown 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
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
</style>
