<script>
import MISAInput from './MISAInput.vue'
import MISAPopup from './MISAPopup.vue'

export default {
  name: 'MISAPopupInput',
  components: { MISAInput, MISAPopup },
  data() {
    return {}
  },
  methods: {
    handleCustomClassFilterCombobox() {
      return {
        hiddenArrow: 'hidden-arrow',
        widthInput: 'width-28',
        heightInput: 'height-28',
        widthPopup: 'width-150'
      }
    },

    handleChooseRecord(item) {
      console.log('Item: ', item)
    }
  }
}
</script>

<template>
  <div class="popupInput">
    <div class="popupInput-popup">
      <MISAPopup :handleChooseRecord="handleChooseRecord" />
    </div>
    <div class="popupInput-input">
      <!-- <input type="text" /> -->
      <MISAInput class="w-150" />
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

// Tiện ích thêm
.w-150 {
  width: 150px;
}
</style>
