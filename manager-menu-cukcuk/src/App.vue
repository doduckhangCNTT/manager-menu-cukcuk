<script setup>
import TheMain from './layouts/TheMain.vue'
import TheHeader from './layouts/TheHeader.vue'
import TheNavbar from './layouts/TheNavbar.vue'
</script>

<template>
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
