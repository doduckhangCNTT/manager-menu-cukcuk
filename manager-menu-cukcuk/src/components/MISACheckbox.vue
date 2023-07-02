<script>
export default {
  name: 'MISACheckbox',
  data() {
    return {}
  },
  methods: {}
}
</script>

<template>
  <input type="checkbox" class="checkbox" />
</template>

<style lang="scss" scoped>
.checkbox {
  cursor: pointer;
  width: 15px;
  height: 15px;
}
.checkbox:hover {
  background-color: #e0e0e0;
}

.disable {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}

.cb-center {
  text-align: center;
}
</style>
