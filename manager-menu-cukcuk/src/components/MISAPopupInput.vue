<script>
import MISAInput from './MISAInput.vue'
import MISAPopup from './MISAPopup.vue'

export default {
  name: 'MISAPopupInput',
  props: {
    contentPopup: {
      type: Array
    },
    propertyDb: {
      // Tên thuộc tính của cột cần lọc trong Database
      type: String
    },
    handleFilterPopupInput: {
      // Hàm xử lí lấy dữ liệu popup input để xử lí
      type: Function
    },
    dataTypesFilter: {
      // Kiểu dữ liệu để lọc (vd: string, int, ...)
      type: String
    },
    defaultOptionPopupInput: {
      // Gía trị mặc định ban đầu của popup
      type: Object
    },
    customClass: {
      type: Object
    },
    typeFormat: {
      type: String,
      default: 'text'
    }
  },
  components: { MISAInput, MISAPopup },
  data() {
    return {
      inputFilter: {},
      itemPopup: {
        id: 1,
        value: '',
        icon: null,
        typeFilter: this.$TypeFilterEnum.Include,
        typeCondition: this.defaultOptionPopupInput?.typeCondition,
        addition: 'and'
      }
    }
  },
  methods: {
    /**
     *
     * @param {*} item - Gía trị của popup được chọn
     * - Thực thực chọn option item popup để thực hiện điều kiện tương ứng
     * - Author: DDKhang (23/6/2023)
     */
    handleChooseRecordPopup(item) {
      this.itemPopup = item
      // Lấy giá trị thẻ input
      const textFilterInput = this.inputFilter.textFilter
      if (textFilterInput.trim() !== '') {
        const option = {
          ...this.itemPopup,
          valueFilter: textFilterInput,
          property: this.propertyDb,
          dataTypesFilter: this.dataTypesFilter
        }
        console.log('textFilterInput: ', textFilterInput)
        if (textFilterInput) {
          this.handleFilterPopupInput(option)
        }
      }
    },

    /**
     * - Xử lí enter trên input để thực hiện lấy thông tin input
     * - Author: DDKhang (23/6/2023)
     */
    handleEnterInput(event) {
      const { value } = event.target
      // Thực hiện lấy giá trị input cho vào thuộc tính textFilter
      this.inputFilter.textFilter = value
      // Cấu hình giá trị trả ra của popup input
      const option = {
        ...this.itemPopup,
        valueFilter: value,
        property: this.propertyDb,
        dataTypesFilter: this.dataTypesFilter
      }
      this.handleFilterPopupInput(option)
    },

    /**
     * - Xử lí blur ra ngoài input để thực hiện lấy thông tin input
     * - Author: DDKhang (23/6/2023)
     */
    handleBlurInput(event) {
      const { value } = event.target
      this.inputFilter.textFilter = value
      const option = {
        ...this.itemPopup,
        valueFilter: value,
        property: this.propertyDb,
        dataTypesFilter: this.dataTypesFilter
      }
      if (value) {
        this.handleFilterPopupInput(option)
      }
    }
  }
}
</script>

<template>
  <div class="popupInput">
    <div class="popupInput-popup">
      <MISAPopup
        :optionsFilterRecord="this.contentPopup"
        :handleChooseRecord="handleChooseRecordPopup"
        :defaultOptionPopupInput="defaultOptionPopupInput"
      />
    </div>
    <div class="popupInput-input">
      <!-- <input type="text" /> -->
      <MISAInput
        :class="this.customClass?.textAlignEnd"
        @keyup.enter="handleEnterInput($event)"
        @blur="handleBlurInput($event)"
        name="textFilter"
        :type="this.typeFormat"
        v-model="this.inputFilter.textFilter"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popupInput {
  display: flex;
  height: 28px;
}

.popupInput-popup {
}

.popupInput-popup-button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--border-radius-primary) 0 0 var(--border-radius-primary);
  cursor: pointer;
}

.popupInput-popup-content {
}

.popupInput-input {
  width: 100%;
}

.popupInput-input input {
  height: 100%;
  // border: 1px solid var(--color-border-default);
  border-radius: 0 var(--border-radius-primary) var(--border-radius-primary) 0;
  min-width: 120px;
}

// Tiện ích thêm
.w-150 {
  width: 150px;
}
.textAlignEnd {
  text-align: end;
}
</style>
