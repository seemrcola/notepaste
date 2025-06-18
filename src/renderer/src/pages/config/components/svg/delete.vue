<template>
  <svg
    class="delete-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="#de2a42"
      d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"
    />
  </svg>
</template>

<style scoped>
/* 删除按钮hover动效 */
.delete-icon {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 50%;
  padding: 4px;
  position: relative;
}

.delete-icon:hover {
  transform: scale(1.4) rotate(30deg);
  background-color: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.delete-icon:hover::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  border: 1px solid rgba(239, 68, 68, 0.5);
  animation: pulse-border 1.5s infinite;
}
</style>
