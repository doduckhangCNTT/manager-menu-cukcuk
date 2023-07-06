<script>
import { nextTick } from 'vue'

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
  mounted() {
    this.focusInput()
  },
  beforeUpdate() {
    // Thực hiện xóa class "invalid" khỏi thẻ input khi thay đổi giá trị trên input
    if (this.modelValue) {
      const tagCurrent = this.$refs.refInput
      this.removeInvalidInputForm(tagCurrent)
    }
  },
  computed: {},
  methods: {
    /**
     * Params:
     * Des: Thực hiện focus vào thẻ input nào có thuộc tính 'focus="true"'
     * Author: DDKhang
     * CreateAt: 13/5/2023
     * ModifierAt: 13/5/2023
     */
    focusInput() {
      if (this.focus) {
        nextTick(() => {
          this.$refs.refInput.focus()
        })
      }
    },

    /**
     * Params:
     *  + tagCurrent: thẻ input hiện tại
     * Des: Thực hiện xóa class "invalid" từ thẻ cha của input đó
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    removeInvalidInputForm(tagCurrent) {
      // Tham chieu len thẻ cha (".formGroup")
      const tagParent = tagCurrent?.closest('.form-group')
      if (tagParent) {
        tagParent.classList.remove('invalid')
        // tagCurrent.setAttribute('title', '')
      }
    },

    handleInputRequired() {
      if (this.required) {
        const tagCurrent = this.$refs.refInput
        const value = tagCurrent?.value
        if (!value) {
          // Tham chieu len thẻ cha (".formGroup")
          const tagParent = tagCurrent?.closest('.form-group')
          tagParent.classList.add('invalid')
        }
      }
    }
  }
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
