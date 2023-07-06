<script>
import MISAButton from '../components/MISAButton.vue'
import { Icon } from '@iconify/vue'

import MISAComboboxTable from '../components/MISAComboboxTable.vue'
export default {
  name: 'TheMain',
  components: { MISAButton, Icon, MISAComboboxTable },
  data() {
    return {
      test: null
    }
  },
  methods: {
    handleTest(event, number) {
      console.log({ event, number })
    }
  }
}
</script>

<template>
  <main class="main">
    <!-- Main top  -->
    <div class="main-top">
      <h1 class="main-top__title-table">Thực đơn</h1>
      <MISAComboboxTable @input="handleTest($event, 1)" />

      <div class="main-top__panel">
        <MISAButton class="button main-top__panel-btn px-3 py-10">
          <Icon icon="mdi:loudspeaker-outline" color="#0072bc" width="18" height="18" />
          <span>Phản hồi</span>
        </MISAButton>
      </div>
    </div>
    <!-- Content page -->
    <div class="">
      <router-view />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
  width: 100%;
  overflow: hidden;
  padding: 0 8px;
}

.main-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--height-main-top-title);
}

.main-top__title-table {
  font-size: var(--font-size-text-title);
  font-weight: normal;
}

.main-top__panel {
}

.main-top__panel-btn {
  display: flex;
  column-gap: 8px;
  align-items: center;
  height: 25px;
}
</style>
