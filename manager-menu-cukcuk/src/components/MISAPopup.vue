<script>
import { Icon } from '@iconify/vue'
export default {
  name: 'MISAPopup',
  props: {
    optionsFilterRecord: {
      // Dữ liệu nội dung cho popup
      type: Array
    },
    defaultOptionPopupInput: {
      // Gía trị măc định ban đầu cho popup
      type: Object
    },
    handleChooseRecord: {
      type: Function
    }
  },
  data() {
    return {
      isPopupContent: false,
      selectedIndex: null,
      valueFilter: null
    }
  },
  created() {
    this.initialValueFilter()
  },
  mounted() {
    window.addEventListener('click', this.handleClosePopupContent)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleClosePopupContent)
  },
  methods: {
    /**
     * - Khởi tạo giá trị hiển thị ban đầu của popup input
     * - Author: DDKhang (23/6/2023)
     */
    initialValueFilter() {
      // Khởi tạo giá trị ban đầu cho popup
      if (this.optionsFilterRecord && this.defaultOptionPopupInput) {
        const itemInitial = this.defaultOptionPopupInput || this.optionsFilterRecord[0]
        this.valueFilter = itemInitial
        // Lấy vị trí của item popup
        this.selectedIndex = itemInitial.id - 1
      }
    },

    /**
     * - Đóng/Mở popup
     * - Author: DDKhang (23/6/2023)
     */
    handleShowPopupContent(event) {
      event.stopPropagation()
      this.isPopupContent = !this.isPopupContent
    },

    /**
     * - Đóng popup content
     * - Author: DDKhang (23/6/2023)
     */
    handleClosePopupContent() {
      this.isPopupContent = false
    },

    /**
     *
     * @param {*} item - Gía trị của popup
     * @param {*} index - Thứ tự của item popup
     * - Thực hiện lấy thông tin của item popup
     * - Author: DDKhang (23/6/2023)
     */
    handleChooseTypeFilter(item, index = 0) {
      this.valueFilter = item
      this.selectedIndex = index
      this.handleChooseRecord(item)
    }
  },
  components: { Icon }
}
</script>

<template>
  <div class="popup">
    <button class="popup-btn" @click="handleShowPopupContent">{{ this.valueFilter?.icon }}</button>
    <div class="popup-content" v-if="this.isPopupContent">
      <ul class="popup-content-list">
        <li
          v-for="(item, index) in this.optionsFilterRecord"
          :key="index"
          :class="`popup-content-list__item ${this.selectedIndex === index ? 'selected' : ''}`"
          @click="handleChooseTypeFilter(item, index)"
        >
          <div class="popup-content-list__item-icon-dot">
            <span class="popup-content-list__item-icon">
              <Icon icon="icon-park-outline:dot" color="green" width="24" height="24" />
            </span>
          </div>
          <span class="popup-content-list__item-content">{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  position: relative;
}

.popup-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border-default);
}

.popup-btn:hover {
  cursor: pointer;
}

.popup-content {
  background-color: #fff;
  border-radius: 2px;
  position: absolute;
  z-index: 3;
  width: 200px;
  box-shadow: 0px 3px 25px rgba(124, 130, 141, 0.2);
}

.popup-content-list {
  list-style-type: none;
  font-weight: 500;
}

.popup-content-list__item {
  padding: 3px;
  height: 28px;
  display: flex;
  column-gap: 10px;
  align-items: center;
}
.popup-content-list__item:hover {
  background-color: var(--color-table-row-hover-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.popup-content-list__item-icon {
  display: none;
}

.popup-content-list__item-icon-dot {
  width: 10%;
}

.selected .popup-content-list__item-icon {
  display: block;
}

.popup-content-list__item-content {
  // width: 90%;
}
</style>
