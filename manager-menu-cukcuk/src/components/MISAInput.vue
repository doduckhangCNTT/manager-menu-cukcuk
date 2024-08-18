<script>
import { nextTick } from 'vue'
import { FormatNumberPrice } from '../utils/functions/FormatNumber'

export default {
  name: 'MInput',
  props: {
    value: {
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
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    }
  },
  data() {
    return {
      valueData: '',
      positionPointer: null
    }
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
  watch: {
    modelValue() {
      this.valueData = this.modelValue
      if (this.positionPointer != null) {
        this.$nextTick(() => {
          this.$refs.refInput.setSelectionRange(this.positionPointer, this.positionPointer)
        })
      }
    },
    /**
     * - Thực hiện
     */
    valueData() {
      if (this.positionPointer != null) {
        this.$nextTick(() => {
          this.$refs.refInput.setSelectionRange(this.positionPointer, this.positionPointer)
        })
      }
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
     *
     * @param {*} event - Đối tượng sự kiện
     * - Author: DDKhang (11/7/2023)
     */
    handleData(event) {
      this.valueData = event.target.value
      if (this.type == 'number') {
        let value = event.target.value + ''
        let strPointer = value.substring(0, event.target.selectionStart)
        let numberAfterFormat = this.formatData(strPointer)
        this.positionPointer = numberAfterFormat?.length
      }
      if (this.type == 'number') {
        let inputValue = (event.target.value + '').replace(/\D/g, '')
        this.$emit('update:modelValue', inputValue)
      } else {
        this.$emit('update:modelValue', event.target.value)
      }
    },

    /**
     *
     * @param {*} value - Gía trị số cần cấu trúc đúng định dạng
     * - Thực format số theo kiểu giá tiền
     * - Author: DDKhang (11/7/2023)
     */
    formatData(value) {
      if (value) {
        const data = { type: this.type, value }
        return FormatNumberPrice(data)
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

    /**
     * - Thực hiện xử lí các input được yêu cầu
     * - Author: DDKhang (11/7/2023)
     */
    handleInputRequired() {
      if (this.required) {
        const tagCurrent = this.$refs.refInput
        const value = tagCurrent?.value
        if (!value) {
          // Tham chieu len thẻ cha (".formGroup")
          const tagParent = tagCurrent?.closest('.form-group')
          tagParent?.classList.add('invalid')
        }
      }
    }
  }
}
</script>

<template>
  <input
    :readonly="this.readonly"
    :value="formatData(valueData)"
    @input="handleData"
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

<style>
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
