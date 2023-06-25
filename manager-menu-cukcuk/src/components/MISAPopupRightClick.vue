<script>
export default {
  name: 'MISAPopupRightClick',
  props: {
    x: {
      type: Number
    },
    y: {
      type: Number
    },
    qualityItemPopup: {
      type: Number
    }
  },
  data() {
    return {
      isShowPopup: true,
      screenHeight: 0,
      screenWidth: 0
    }
  },
  mounted() {
    this.updateScreenSize() // Cập nhật chiều cao ban đầu
    window.addEventListener('resize', this.updateScreenSize) // Cập nhật chiều cao khi kích thước màn hình thay đổi
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateScreenSize) // Gỡ bỏ lắng nghe sự kiện khi component bị hủy
  },
  computed: {
    /**
     * - Thực hiện tính toán lại vị trí hiển thị popup, vì có chiều cao | rộng có thể tràn ra ngoài màn hình hiển thị
     * - Author: DDKhang (24/6/2023)
     */
    handleComputedPositionPopup() {
      /**
       * 28: chiều cao mỗi item trong popup,
       * 10: tổng padding trên dưới popup
       */
      const heightPopup = this.y + this.qualityItemPopup * 28 + 10
      const widthPopup = this.x + 120
      let newHeight = this.y
      let newWidth = this.x
      if (heightPopup > this.screenHeight) {
        newHeight = this.y - (heightPopup - this.screenHeight)
      }
      if (widthPopup > this.screenWidth) {
        newWidth = this.x - (widthPopup - this.screenWidth)
      }
      return {
        newHeight,
        newWidth
      }
    }
  },
  methods: {
    /**
     * - Lấy chiều cao, chiều rộng màn hình hiển thị
     * - Author: DDKhang (24/6/2023)
     */
    updateScreenSize() {
      this.screenHeight = window.innerHeight // Cập nhật chiều cao màn hình
      this.screenWidth = window.innerWidth // Cập nhật chiều rộng màn hình
    }
  }
}
</script>

<template>
  <div
    class="popup-rightClick"
    v-if="isShowPopup"
    :style="{
      top: handleComputedPositionPopup.newHeight + 'px',
      left: handleComputedPositionPopup.newWidth + 'px'
    }"
  >
    <!-- Nội dung popup -->
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.popup-rightClick {
  background-color: #fff;
  z-index: var(--zIndex-popup-rightClick);
  position: absolute;
  box-shadow: 0px 3px 25px rgba(124, 130, 141, 0.2);
  width: var(--width-popup-rightClick);
  border-radius: var(--border-radius-primary);
}
</style>
