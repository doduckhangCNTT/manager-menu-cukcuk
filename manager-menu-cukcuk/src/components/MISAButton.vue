<script>
export default {
  name: 'MISAButton',
  props: {}
}
</script>

<template>
  <button class="border-default border-radius-2">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  outline: none;
  cursor: pointer;
  background-color: #fff;
  box-sizing: border-box;
}

.btn-height-28 {
  height: 28px;
}

.border-default {
  border: 1px solid var(--color-border-default);
}

// Thực hiện hover vào button
.button:hover {
  border: 1px solid var(--color-btn-hover-primary);
  background-color: var(--color-bg-green-primary);
}

.button-footer:hover {
  border: 1px solid var(--color-border-default);
  background-color: #ebebeb;
}

.px-3 {
  padding-top: 3px;
  padding-bottom: 3px;
}

.py-10 {
  padding-left: 10px;
  padding-right: 10px;
}

.border-radius-2 {
  border-radius: 2px;
}

// Các tiện ích thêm
.border-default-none {
  border: none;
}
</style>
