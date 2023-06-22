<script>
export default {
  name: 'TabItem',
  props: {
    titleTab: {
      type: String,
      default: '',
      required: true
    },
    tabId: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      selectedTab: null // Id tab được chọn
    }
  },
  created() {
    // Phát đến TabWrapper.vue - Để mở tab đầu tiên khi mở dialog
    this.$msemitter.on(this.$EmitterEnum.tabId, this.handleChooseTabItem)
  },
  methods: {
    /**
     *
     * @param {*} tabId - Id của tab tương ứng
     * - Thực hiện chọn tab tương ứng theo id
     * - Author: DDKhang (22/6/2023)
     */
    handleChooseTabItem(tabId) {
      this.selectedTab = tabId
    }
  }
}
</script>

<template>
  <div class="" :tabId="tabId" :titleTab="titleTab" v-if="tabId === this.selectedTab">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>
