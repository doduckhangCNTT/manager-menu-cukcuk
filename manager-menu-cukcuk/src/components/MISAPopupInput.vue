<script>
export default {
  name: 'MISAPopupInput'
}
</script>

<template>
  <div class="popupInput">
    <div class="popupInput-popup">
      <button class="popupInput-popup-button">+</button>
      <div class="popupInput-popup-content"></div>
    </div>
    <div class="popupInput-input">
      <input type="text" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popupInput {
  display: flex;
  height: 28px;
}

.popupInput-popup {
}

.popupInput-popup-button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--border-radius-primary) 0 0 var(--border-radius-primary);
  cursor: pointer;
}

.popupInput-popup-content {
}

.popupInput-input {
}

.popupInput-input input {
  height: 100%;
  border: 1px solid var(--color-border-default);
  border-radius: 0 var(--border-radius-primary) var(--border-radius-primary) 0;
}
</style>
