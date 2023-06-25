<script>
export default {
  name: 'MISAInput',
  props: {
    value: {
      type: String
    },
    employeeCode: {
      type: String
    },
    modelValue: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<template>
  <input
    :readonly="this.readonly"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    ref="refInput"
    class="textField-input input-hover input-focus"
    type="text"
    :required="this.required"
    placeholder=""
    :name="this.name"
    @blur="this.handleInputRequired"
    autocomplete="off"
  />
</template>

<style lang="scss">
.textField-input {
  border: 1px solid var(--color-border-default);
  height: 30px;
  padding: 3px 5px;
  width: 100%;
  border-radius: var(--border-radius-primary);
}

.input-hover:hover {
  background-color: #fafafa;
}

.input-focus:focus {
  border: 1px solid var(--color-border-blue-default);
}

.w-1-2 {
  width: 50%;
}
</style>
