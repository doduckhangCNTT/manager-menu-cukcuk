<script>
export default {
  name: 'TheLoading',
  props: ['loadingProgress']
}
</script>

<template>
  <div class="progress">
    <div class="progress-item">
      <progress :value="this.loadingProgress" max="100"></progress>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.progress {
  position: fixed;
  display: grid;
  place-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #00000013;
  z-index: 2;
}

.progress-item progress {
  width: 280px;
  height: 10px;
  border-radius: 4px;
  background-color: var(--background-active-menu);
}
</style>
