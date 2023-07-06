<script>
import { Icon } from '@iconify/vue'
export default {
  name: 'TheHeader',
  components: {
    Icon
  },
  methods: {
    /**
     * - Xử lí quay trở lại trang chủ
     * - Author: DDKhang (3/7/2023)
     */
    handleComebackHome() {
      // Phát đến MenuList.vue
      this.$msemitter.emit(this.$EmitterEnum.refreshPage)
    }
  }
}
</script>

<template>
  <header>
    <!-- Logo & icon hamburger -->
    <div class="header-left--logo">
      <!-- Icon Hamburger - Thực hiện đóng mở navbar -->
      <div class="header-left-iconHamburger"></div>
      <div class="logoCukCuk" @click="handleComebackHome"></div>
    </div>

    <!-- Panel header -->
    <div class="header-right">
      <div class="header-right__type-manager">Combobox</div>

      <div class="header-right__panel">
        <div class="header-right__panel-cbLanguage">Combobox Language</div>
        <div class="header-right__panel-iconWorld">
          <Icon icon="fluent-mdl2:world" color="white" width="18" height="18" />
        </div>
        <div class="header-right__panel-iconContactNew">
          <Icon icon="bi:telephone" color="white" width="18" height="18" />
        </div>
        <div class="header-right__panel-popupPersonalInfo">
          <div class="icon-personal"></div>
          <span>Tên người dùng</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  background-color: var(--color-primary);
  height: var(--height-header-primary);
  display: flex;
  padding: 0 8px;
}

.header-left--logo {
  width: auto;
  display: flex;
  column-gap: 10px;
  align-items: center;
  width: 230px;
  justify-content: center;
}

.header-left-iconHamburger {
  background: url('../assets/cukcukResource/Sprites.64af8f61.svg') no-repeat -316px -37px;
  width: 16px;
  height: 14px;
  cursor: pointer;
}

.logoCukCuk {
  background: url('../assets/cukcukResource/logoCukCuk207x45.png') no-repeat 0 0;
  width: 121px;
  height: 34px;
  cursor: pointer;
}
.header-right {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.header-right__panel {
  display: flex;
  column-gap: 12px;
  align-items: center;
}

.header-right__panel-cbLanguage {
}

.header-right__panel-iconWorld {
  cursor: pointer;
}

.header-right__panel-iconContactNew {
  cursor: pointer;
}

.header-right__panel-popupPersonalInfo {
  display: flex;
  column-gap: 10px;
  align-items: center;
  cursor: pointer;
  color: #fff;
}

.icon-personal {
  background: url('../assets/cukcukResource/Sprites.64af8f61.svg') no-repeat -352px -894px;
  width: 32px;
  height: 32px;
  border-radius: 100%;
}
</style>
