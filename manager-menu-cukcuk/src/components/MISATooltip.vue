<script>
export default {
  name: 'MISATooltip',
  props: {
    positionTooltip: {
      type: String
    }
  },
  data() {
    return {
      isShowContentTooltip: false
    }
  },
  methods: {
    /**
     * - Thực hiện hiển thị nội dung tooltip
     * - Author: DDKhang (24/6/2023)
     */
    handleShowContentTooltip() {
      this.isShowContentTooltip = true
    },

    /**
     * - Thực hiện đóng nội dung tooltip
     * - Author: DDKhang (24/6/2023)
     */
    handleHideContentTooltip() {
      this.isShowContentTooltip = false
    }
  }
}
</script>

<template>
  <!-- <MISATooltip>
        <template #tooltip-explain>Icon</template>
        <template #tooltip-content>Nội dung</template>
      </MISATooltip> -->

  <div class="tooltip">
    <span @mouseenter="handleShowContentTooltip" @mouseleave="handleHideContentTooltip">
      <slot name="tooltip-explain"></slot>
    </span>
    <div :class="`misa-tooltip ${this.positionTooltip}`" v-if="this.isShowContentTooltip">
      <slot name="tooltip-content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tooltip {
  position: relative;
}

.misa-tooltip {
  position: absolute;
  top: 24px;
  background-color: var(--color-table-row-hover-primary);
  border-radius: var(--border-radius-primary);
  box-shadow: 0px 3px 25px rgba(124, 130, 141, 0.2);
  min-width: 80px;
  padding: 3px;
}

.tooltip-right {
  top: 5px;
  left: 30px;
}
.tooltip-left {
  top: 5px;
  right: 30px;
}
.tooltip-top {
  top: -25px;
  left: 0;
}
</style>
