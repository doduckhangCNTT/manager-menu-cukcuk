<script>
export default {
  name: 'TabWrapper',
  data() {
    return {
      tabs: [], // Danh sách tabs
      selectedTabId: null // Tab được chọn đầu tiên
    }
  },
  watch: {
    /**
     *
     * @param {*} newValue - Gía trị mới khi có sự thay đổi selectedTabId
     * - Thực hiện bắt sự thay đổi của selectedTabId để thực hiện cung cấp giá trị tab đầu tiên
     * - Author: DDKhang (22/6/2023)
     */
    selectedTabId: function (newValue) {
      if (this.selectedTabId) {
        // Phát đến TabItem.vue - Để mở tab đầu tiên khi mở dialog
        this.$msemitter.emit(this.$EmitterEnum.tabId, newValue)
      }
    }
  },
  mounted() {
    // Thực hiện lấy toàn bộ nội dung slots trong TabWrapper
    const tabItems = this.$slots.default()
    // Cung cấp giá trị ban đầu cho tab (hiển thị nội dung của tab đầu tiên)
    this.selectedTabId = tabItems[0].props.tabId
    // Lấy nội dung title
    this.tabs = tabItems.map((tabItem) => {
      return tabItem.props
    })
  },
  methods: {
    /**
     *
     * @param {*} tabId - Id của tab tương ứng
     * - Thực hiện chọn tab tương ứng theo id
     * - Author: DDKhang (22/6/2023)
     */
    handleChooseTabItem(tabId) {
      this.$msemitter.emit(this.$EmitterEnum.tabId, tabId)
      this.selectedTabId = tabId
    }
  }
}
</script>

<template>
  <div class="tab">
    <ul class="tab-list">
      <li
        class="tab-item"
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ selected: tab.tabId === selectedTabId }"
        @click="handleChooseTabItem(tab.tabId)"
      >
        {{ tab.titleTab }}
      </li>
    </ul>

    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab {
}

.tab-list {
  display: flex;
  list-style-type: none;
  background-color: #f2f2f2;
}

.tab-item {
  width: auto;
  padding: 5px 8px;
  border-top: 1px solid #f2f2f2;
  border-left: 1px solid #f2f2f2;
  border-right: 1px solid #f2f2f2;
}
.tab-item:hover {
  background-color: rgba(127, 199, 227, 0.4);
  cursor: pointer;
  border-top: 1px solid var(--color-border-blue-default);
  border-left: 1px solid var(--color-border-default);
  border-right: 1px solid var(--color-border-default);
  transition: all 0.2s;
}

.tab-content {
}

.selected {
  background-color: #fff;
  border-top: 1px solid var(--color-border-blue-default);
  border-left: 1px solid var(--color-border-default);
  border-right: 1px solid var(--color-border-default);
  color: var(--color-border-blue-default);
}
.selected:hover {
  background-color: #fff;
}
</style>
