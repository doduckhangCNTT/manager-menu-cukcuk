<script>
import { Icon } from '@iconify/vue'
export default {
  name: 'MISACombobox',
  props: {
    customClass: {
      // Class tùy chỉnh
      type: Object
    },
    placeholderInput: {
      // gợi ý cho thẻ input
      type: String,
      default: ''
    },
    modelValue: {
      type: Number,
      default: 0
    },
    listItemValue: {
      type: Array[Object],
      default: () => []
    },
    defaultValueInput: {
      type: Object
    },
    handleChooseRecord: {
      type: Function
    },
    required: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      value: null,
      listItem: [],
      isListItem: false,
      selectedIndex: -1,
      item: null,
      changeInputValue: ''
    }
  },
  watch: {
    /**
     * - Des: Theo dõi sự thay đổi của danh sách dữ liệu truyền vào
     * - Author: DDKhang (5/6/2023)
     */
    listItemValue: {
      handler(newVal) {
        this.listItem = newVal
      },
      immediate: true
    },
    /**
     * - Des: Theo dõi sự thay đổi của giá trị mặc định cho combobox
     * - Author: DDKhang (5/6/2023)
     */
    defaultValueInput: {
      handler(newVal) {
        // Cần phải kiểm tra xem có giá trị default bởi khi thực hiện "Thêm" thì khi nhấn sang, thực hiện trên input datetime, radio... thì dẫn đến giá trị trên input checkbox thành undifined
        if (newVal && newVal.id) {
          this.value = newVal ?? { id: '', value: '' }
          // Thực hiện cập nhật vị trí của object trong listItem khi có giá trị mặc định cho combobox
          this.selectedIndex = this.listItem.findIndex(
            (item) => JSON.stringify(item) === JSON.stringify(newVal)
          )
        }
      }
    }
  },
  created() {
    this.listItem = this.listItemValue ?? [
      { id: 1, value: 1 },
      { id: 2, value: 2 }
    ]
    this.value = this.defaultValueInput ?? { id: '', value: '' }
    // this.selectedIndex = this.listItem.indexOf(this.defaultValueInput);
    // Thực hiện cập nhật vị trí của object trong listItem
    this.selectedIndex = this.listItem.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(this.defaultValueInput)
    )
  },
  mounted() {
    window.addEventListener('click', this.handleCloseListItem)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleCloseListItem)
  },
  computed: {
    /**
     * - Des: Thực hiện tính toán việc hiển thị "từ top" của listItem khi muốn hiển thị ở trên combobox
     * - Author: DDKhang (31/5/2023)
     */
    handleShowTopListItem() {
      // Chiều cao của 1 item trong listItem
      const heightItemInListItem = this.$MagicNumber.MISACombobox.heightDefaultCombobox
      // Tổng số padding trên dưới của listItem
      const totalPadingOnLowerOnListItem =
        this.$MagicNumber.MISACombobox.totalPaddingOnLowerOfListItem
      // Chiều cao từ "top" của listItem so với combobox, (-1) chiều cao phía trên combobox
      const heightListItemTop =
        (this.listItem?.length * heightItemInListItem + totalPadingOnLowerOnListItem) * -1
      return heightListItemTop
    },
    /**
     * - Des: Thực hiện tính toán chiều cao mặc định của ListItem (vd: 196px (5 hàng))
     * - Author: DDKhang (31/5/2023)
     */
    handleCalcHeightDefaultListItem() {
      return (
        this.$MagicNumber.MISACombobox.amountMaxShowOnListItem *
          this.$MagicNumber.MISACombobox.heightDefaultCombobox +
        this.$MagicNumber.MISACombobox.totalPaddingOnLowerOfListItem
      )
    }
  },
  beforeUpdate() {
    // Thực hiện xóa class "invalid" khỏi thẻ input khi thay đổi giá trị trên input
    // Khi giá trị của combobox "được chọn" thì thực hiện xóa class "invalid", nếu cung cấp thông tin sai thì báo lỗi
    if (this.value?.id) {
      const tagCurrent = this.$refs.inputField
      this.removeInvalidInputForm(tagCurrent)
    }
  },
  updated() {},
  methods: {
    /**
     *
     * @param {*} item - Gía trị khi chọn hoặc nhấn trên item
     * @param {*} index - Vị trí của item được chọn hoặc nhấn
     * - Author: DDKhang (31/5/2023)
     */
    handleListItemClick(item, index = 0) {
      event.stopPropagation()
      this.value = item
      this.handleCloseListItem()
      this.selectedIndex = index
      // Callback lấy số bản ghi được chọn
      this.handleChooseRecord(item)
    },
    /**
     * - Des: Đóng danh sách các mục của combobox
     * - Author: DDKhang (31/5/2023)
     */
    handleCloseListItem() {
      this.isListItem = false
    },
    /**
     *
     * @param {*} event - Đối tượng sự kiện
     * - Des: Thực hiện đóng mở danh sách các mục của combobox
     * - Author: DDKhang (31/5/2023)
     */
    handleToggleListItem(event) {
      // Ngăn chặn sự kiện nổi bọt
      event.stopPropagation()
      this.isListItem = !this.isListItem
    },
    /**
     *
     * @param {*} event  - Đối tượng sự kiện
     * - Des: Xử lí bắt sự kiện khi nhấn mũi tên trên bàn phím
     * - Author: DDKhang (31/5/2023)
     */
    handleListItemKey(event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (!this.isListItem) {
          // Nếu danh sách đóng thì thực hiện mở danh sách và focus vào item đầu tiên
          this.isListItem = true
          this.selectedIndex = 0
        } else {
          const newIndex = (this.selectedIndex + 1) % this.listItem.length // Thực hiện xét lại vị trí index (sử dụng % để xét vị trí khi vượt qua độ dài items)
          this.selectedIndex = newIndex
          this.value = this.listItem[newIndex]
          this.item = this.listItem[newIndex]
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (!this.isListItem) {
          // Nếu danh sách đóng thì thực hiện mở danh sách và focus vào item cuối
          this.isListItem = true
          this.selectedIndex = this.listItem.length - 1
        } else {
          const newIndex =
            this.selectedIndex === 0 ? this.listItem.length - 1 : this.selectedIndex - 1 // Thực hiện xét lại vị trí index (sử dụng % để xét vị trí khi vượt qua độ dài items)
          this.selectedIndex = newIndex
          this.value = this.listItem[newIndex]
          this.item = this.listItem[newIndex]
        }
      }
    },
    /**
     * - Des: Thực focus vào thẻ input
     * - Author: DDKhang (31/5/2023)
     */
    handleFocusInput() {
      this.$refs.inputField.focus()
    },
    /**
     * - Des: Thực hiện bắt sự kiện khi nhấn phím enter
     * - Author: DDKhang (31/5/2023)
     */
    handleEnterKey(event) {
      if (event.key === 'Enter' && this.selectedIndex !== -1) {
        // Thực hiện lấy giá trị trong input combobox
        const newItem = { ...this.item, value: this.$refs.inputField.value }
        // this.handleListItemClick(this.item, this.selectedIndex);
        this.handleListItemClick(newItem, this.selectedIndex)
      }
    },
    /**
     * - Des: Thực hiện nhấn phím enter trêm item của combobox
     * - Author: DDKhang (31/5/2023)
     */
    handleListItemEnterKey(item, index) {
      this.$refs.inputField.focus()
      this.handleListItemClick(item, index)
    },
    /**
     * - Xử lí focus vào thẻ input
     * - Author: DDKhang (31/5/2023)
     */
    focusInput() {
      this.$refs.inputField.focus()
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
        tagCurrent.setAttribute('title', '')
      }
    },
    /**
     * Params:
     * Des: Thực hiện xử lí input khi blur ra ngoài
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    handleInputRequired() {
      // Kiểm tra input có yêu cầu "required"
      if (this.required) {
        const tagCurrent = this.$refs.inputField
        const value = tagCurrent.value
        if (!value) {
          // Tham chieu len thẻ cha (".formGroup")
          const tagParent = tagCurrent.closest('.form-group')
          tagParent.classList.add('invalid')
          tagCurrent.setAttribute('title', this.$MISAResource.textError.textErrorRequiredUnit)
        } else {
          // Tham chieu len thẻ cha (".formGroup")
          // const tagParent = tagCurrent.closest(".form-group");
          // tagParent.classList.remove("invalid");
          // Thực hiện thông báo lỗi khi cung cấp sai thông tin phòng ban
          tagCurrent.setAttribute('title', 'Thông tin phòng ban chưa chính xác')
        }
      }
    },
    /**
     * - Bắt sự thay đổi trên input -> tìm kiếm giá trị trong danh sách item
     * - Author: DDKhang (23/6/2023)
     */
    handleChangeInput() {
      const { value } = event.target
      if (value) {
        const listItemFilter = this.listItem.filter((li) =>
          li.value.toString().includes(value.toString())
        )
        console.log('Hello', listItemFilter)
        // this.listItem = listItemFilter
      }
    }
  },
  components: { Icon }
}
</script>

<template>
  <div class="comboboxNew">
    <div class="comboboxNew__content" @click="this.handleToggleListItem">
      <input
        ref="inputField"
        type="text"
        :class="[
          'inputCombobox input-press',
          this.customClass?.widthInput,
          this.customClass?.heightInput,
          this.customClass?.borderRight
        ]"
        :placeholder="this.placeholderInput"
        :required="this.required"
        :value="this.value?.value"
        @keydown="handleListItemKey"
        @keyup.enter="handleEnterKey"
        :tabindex="this.tabindex"
        @blur="this.handleInputRequired"
        @input="handleChangeInput"
      />
      <small class="form-message--error"></small>
      <!-- Icon arrow -->
      <div
        :class="[
          'comboboxNew__content--icon',
          this.customClass?.borderLeftNone,
          this.customClass?.backgroundWhite,
          this.customClass?.hiddenArrow,
          this.customClass?.heightInput
        ]"
        @click="handleFocusInput"
      >
        <!-- <div class="icon-combobox--arrow"></div> -->
        <Icon
          icon="material-symbols:arrow-left"
          width="24"
          height="24"
          :rotate="1"
          :horizontalFlip="true"
        />
      </div>
    </div>
    <div class="">
      <!-- 
        (-196) là chiều cao hiển thị của listItem (5 item (36px) + 16px (padding trên dưới listItem))
        1. Kiểm tra thuộc tính "listItemTop" trong "customClass" có tồn tại 
        (listItemTop để biết rằng là đang muốn hiển thị lisItem lên trên combobox ) 
          - Nếu tồn tại:
            + Vì để có scroll thì height: 196px (5 hàng) vì khoảng, nếu khoảng cách từ top của listItem > 196 thì khi lấy height: 196px cho scroll
            thì dẫn đến listItem cách combobox 1 khoảng = (kc top - 196px)
          - Nếu không tồn tại:
            + Thì listItem làm dưới combobox và cách khoảng 36px (chiều cao combobox do đặt relative là thẻ bọc bên ngoài combobox và listItem)
        2. Xét height cho scroll nếu kích thước của listItem > 196px (5 hàng) -> cố định height:196px (5 hàng)
          nếu nhỏ hơn 196px thì lấy toàn bộ chiều cao của listItem
      
          :style="`top: ${
            this.customClass?.listItemTop
              ? this.handleShowTopListItem < -196
                ? -196
                : this.handleShowTopListItem
              : 36
          }px; overflow-y:auto; height: ${
            this.handleShowTopListItem * -1 > 196 ? '196px' : 'auto'
          }`"
      -->
      <ul
        :style="`top: ${
          this.customClass?.listItemTop
            ? this.handleShowTopListItem < this.handleCalcHeightDefaultListItem * -1
              ? this.handleCalcHeightDefaultListItem * -1
              : this.handleShowTopListItem
            : this.$MagicNumber.MISACombobox.heightDefaultCombobox
        }px; overflow:auto; height: ${
          this.handleShowTopListItem * -1 > this.handleCalcHeightDefaultListItem
            ? `${this.handleCalcHeightDefaultListItem}px`
            : 'auto'
        }`"
        :class="[`comboboxNew__listItem`, this.customClass?.widthPopup]"
        v-show="this.isListItem"
      >
        <li
          v-for="(item, index) in this.listItem"
          @click="this.handleListItemClick(item, index)"
          :key="index"
          :class="{ selected: index === selectedIndex }"
          @keydown.enter="handleListItemEnterKey(item, index)"
        >
          <div>{{ item.value }}</div>
          <!-- <div class="icon-checked"></div> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.comboboxNew {
  position: relative;
  /* height: var(--height-input-primary); */
  width: 100%;
}
.comboboxNew__content {
  display: flex;
  align-items: center;
  border-radius: var(--border-radius-primary);
}
.comboboxNew__content:hover {
  background-color: #f6f6f6;
  cursor: pointer;
}

.comboboxNew__content:focus-within {
  border: solid 1px var(--color-border-blue-default);
  border-radius: var(--border-radius-primary);
}

/* Khi invalid thì không hiển thị focus  */
.invalid .comboboxNew__content:focus-within {
  border: none !important;
}

.comboboxNew__content input {
  outline: none;
  border: solid 1px var(--color-border-default);
  border-radius: var(--border-radius-primary) 0 0 var(--border-radius-primary);
  padding: 3px 5px;
  border-right: none;
  height: var(--height-input-primary);
}

.comboboxNew__content input:hover {
  background-color: var(--color-input-primary);
}

.comboboxNew__content--icon {
  height: var(--height-input-primary);
  /* padding: 10px 12px; */
  border: solid 1px var(--color-border-default);
  border-radius: 0 var(--border-radius-primary) var(--border-radius-primary) 0;
  /* border-left: solid 1px #e6e6e6; */
  border-left: none;
}

.comboboxNew__listItem {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 3px 25px rgba(124, 130, 141, 0.2);
  position: absolute;
  z-index: 3;
  width: 100%;
  overflow-y: auto;
}

.comboboxNew__listItem li {
  display: flex;
  justify-content: space-between;
  height: var(--height-input-primary);
  color: #1f1f1f;
  align-items: center;
  padding: 3px 5px;
  font-size: 14px;
}

.comboboxNew__listItem li:hover {
  background-color: var(--color-table-row-hover-primary);
  cursor: pointer;
}

.comboboxNew__listItem li.selected {
  background-color: var(--background-item-selected);
}

.border--none .inputCombobox {
  border: none;
}

.border--none .comboboxNew__content--icon {
  border: none;
}

/* Tiện ích nhỏ */
.border-left--none {
  border-left: none;
}

.list-item--top {
  top: -198px;
}

.height-28 {
  height: 28px !important;
}
.width-28 {
  width: 28px;
}
.width-30 {
  width: 30px;
}
.width-50 {
  width: 50px;
}
.width-100 {
  width: 100px;
}
.width-150 {
  width: 150px;
}
.width-200 {
  width: 420px;
}
.width-250 {
  width: 250px;
}
.width-full {
  width: 100%;
}

.hidden-arrow {
  display: none;
}

.border-right {
  border-right: 1px solid #e6e6e6 !important;
  border-radius: var(--border-radius-primary) !important;
}

.backgroundColor--white {
  background-color: #fff;
}

.invalid .inputCombobox {
  border-right: none !important;
}

.invalid .comboboxNew__content--icon {
  border: 1px solid #e61d1d;
  border-left: none;
}
</style>
