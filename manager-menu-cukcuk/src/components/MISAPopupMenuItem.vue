<script>
export default {
  name: 'MISAPopupMenuItem',
  props: {
    top: {
      type: Number
    },
    right: {
      type: Number
    }
  },
  data() {
    return {
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
     * Thực hiện tính toán lại vị trí hiển thị popup, vì có chiều cao | rộng có thể tràn ra ngoài màn hình hiển thị
     */
    getPositionPopup() {
      const heightPopup = this.top + 500 // 500: Là chiều cao mặc định của popup
      const widthPopup = this.right + 400

      let newHeight = this.top
      let newWidth = this.right
      if (heightPopup > this.screenHeight) {
        const height = this.top - (heightPopup - this.screenHeight)
        if (height <= 0) {
          newHeight = 0
        } else {
          newHeight = height
        }
      }
      if (widthPopup > this.screenWidth) {
        const width = this.right - (widthPopup - this.screenWidth)
        if (width <= 0) {
          newWidth = 0
        } else {
          newWidth = width
        }
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
    class="popup-menu-item"
    :style="{
      top: getPositionPopup.newHeight + 'px',
      left: getPositionPopup.newWidth + 'px'
    }"
  >
    <!-- Nội dung popup -->
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.popup-menu-item {
  flex-shrink: 0;
  background-color: #fff;
  z-index: 10;
  position: absolute;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
</style>
