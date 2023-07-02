<script>
import TheMain from './layouts/TheMain.vue'
import TheHeader from './layouts/TheHeader.vue'
import TheNavbar from './layouts/TheNavbar.vue'
import MISAToast from './components/MISAToast.vue'

export default {
  name: 'App',
  components: { TheMain, TheHeader, TheNavbar, MISAToast },
  created() {
    this.$msemitter.on(this.$EmitterEnum.showToast, this.showToast)
  },
  beforeUnmount() {
    this.$msemitter.off(this.$EmitterEnum.showToast, this.showToast)
  },
  methods: {
    /**
     * - Des: Thực hiện hiển thị Toast
     * - Author: DDKhang (2/6/2023)
     */
    showToast(toastInfo, duration = 5000) {
      this.$refs.toast.showToast(toastInfo, duration)
    }
  }
}
</script>

<template>
  <MISAToast ref="toast"></MISAToast>
  <div class="program">
    <TheHeader />
    <div class="container">
      <TheNavbar />
      <TheMain />
    </div>
  </div>
</template>

<style scoped>
.program {
  height: 100vh;
}
.container {
  display: flex;
}
</style>
