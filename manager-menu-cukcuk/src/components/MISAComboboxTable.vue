<script>
import { Icon } from '@iconify/vue'
export default {
  name: 'MISAComboboxTable',
  props: {
    modelValue: {
      type: String
    },
    listItemValue: {
      type: Array[Object],
      default: () => []
    },
    handleChooseRecordItem: {
      type: Function
    },
    handleBlurInputRecordItem: {
      type: Function
    },
    index: {
      type: Number
    },
    name: {
      type: String
    },
    listContentCb: {
      type: Array
    },
    valueTranfer: {
      type: String
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      contentCombobox: [],
      contentComboboxFilter: [],
      isShowContentCb: false,
      selectedRecord: {},
      currentListItemValue: [],
      selectedIndex: -1,
      isListItem: false,
      isShowBtnIcon: false,
      cbContentTop: 0,
      cbContentLeft: 0
    }
  },
  components: { Icon },
  watch: {
    listItemValue: {
      immediate: true,
      handler(newValue) {
        if (this.contentComboboxFilter.length === 0) {
          this.currentListItemValue = [...newValue]
          this.contentCombobox = [...this.currentListItemValue]
          this.contentComboboxFilter = [...this.currentListItemValue]
        }
      }
    },
    valueTranfer: {
      handler(newValue) {
        console.log('ServiceHobbyName: ', newValue)
        this.selectedRecord.ServiceHobbyName = newValue
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  mounted() {
    window.addEventListener('click', this.handleToggleContentCb)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleToggleContentCb)
  },
  methods: {
    /**
     * - Xử lí bật tắt nội dụng combobox
     * - Author: DDKhang (5/7/2023)
     */
    handleToggleContentCb(event) {
      // event.stopPropagation()
      // this.isShowContentCb = !this.isShowContentCb
      // event.preventDefault()
      // Thực hiện đóng những nội dung thẻ combobox khác
      if (!this.$el.contains(event?.target)) {
        // Nếu mà không phải thẻ hiện tại thì đóng toàn bộ thẻ combobox khác đi
        if (this.isShowContentCb) {
          this.isShowContentCb = false
        }
      } else {
        // Ngăn chặn sự kiện nổi bọt
        this.isShowContentCb = true
      }
    },
    /**
     * Xử lí đóng danh sách item của combobox
     * - Author: DDKhang (6/7/2023)
     */
    handleCloseListItem() {
      event.stopPropagation()
      this.isShowContentCb = false
    },
    /**
     *
     * @param {*} event - Sự kiện
     * - Thực hiện bắt sự thay đổi trên thẻ input
     * - Author: DDKhang (6/7/2023)
     */
    handleChangeInput(event) {
      const { value } = event.target
      if (value.trim()) {
        const result = this.currentListItemValue.filter((i) =>
          i.ServiceHobbyName.toLowerCase().includes(value.trim().toLowerCase())
        )
        console.log('Result: ', result)
        this.contentComboboxFilter = [...result]
      } else {
        this.contentComboboxFilter = [...this.currentListItemValue]
      }
    },
    /**
     *
     * @param {*} item  Option được chọn từ nội dung combobox
     * - Author: DDKhang (5/7/2023)
     */
    handleChooseRecord(item, index) {
      //event.stopPropagation() // Ngăn chặn hành vị mặc đinh khi
      this.handleCloseListItem()
      this.selectedIndex = index
      this.selectedRecord = { ...item }
      this.handleChooseRecordItem(item, this.index)
    },
    /**
     *
     * @param {*} event  - Đối tượng sự kiện
     * - Des: Xử lí bắt sự kiện khi nhấn mũi tên trên bàn phím
     * - Author: DDKhang (31/5/2023)
     */
    handleListItemKey(event) {
      console.log('Hello')
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (!this.isListItem) {
          // Nếu danh sách đóng thì thực hiện mở danh sách và focus vào item đầu tiên
          this.isListItem = true
          this.selectedIndex = 0
        } else {
          const newIndex = (this.selectedIndex + 1) % this.contentComboboxFilter.length // Thực hiện xét lại vị trí index (sử dụng % để xét vị trí khi vượt qua độ dài items)
          this.selectedIndex = newIndex
          this.value = this.contentComboboxFilter[newIndex]
          this.item = this.contentComboboxFilter[newIndex]
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (!this.isListItem) {
          // Nếu danh sách đóng thì thực hiện mở danh sách và focus vào item cuối
          this.isListItem = true
          this.selectedIndex = this.contentComboboxFilter.length - 1
        } else {
          const newIndex =
            this.selectedIndex === 0
              ? this.contentComboboxFilter.length - 1
              : this.selectedIndex - 1 // Thực hiện xét lại vị trí index (sử dụng % để xét vị trí khi vượt qua độ dài items)
          this.selectedIndex = newIndex
          this.value = this.contentComboboxFilter[newIndex]
          this.item = this.contentComboboxFilter[newIndex]
        }
      }
    },
    /**
     * - Des: Thực hiện nhấn phím enter trêm item của combobox
     * - Author: DDKhang (31/5/2023)
     */
    handleListItemEnterKey(item, index) {
      this.$refs.inputField.focus()
      this.handleChooseRecord(item, index)
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
        this.handleChooseRecord(newItem, this.selectedIndex)
      }
    },

    /**
     * 
     * @param {*} event - Sự kiện
     * - Bắt sự thay đổi giá trị trên input
     * - Author: DDKhang (31/5/2023)
     */
    handleChangeInputValue(event) {
      this.$emit('update:modelValue', event.target.value)
    },

    handleFocusShowBtnArrowIcon() {
      this.isShowBtnIcon = true
    },
    handleBlurShowBtnArrowIcon(event) {
      const { value } = event.target
      this.isShowBtnIcon = false
      this.handleBlurInputRecordItem(value)
    },

    handleGetPositionContent() {
      // this.handleToggleContentCb()

      const inputElement = this.$refs.inputField
      const { offsetLeft, offsetTop, offsetHeight } = inputElement

      this.cbContentTop = offsetTop + offsetHeight + 28
      this.cbContentLeft = offsetLeft + 28
    }
  }
}
</script>

<template>
  <div>
    <div class="combobox-table">
      <div class="combobox-table-panel">
        <input
          ref="inputField"
          class="combobox-table-input"
          type="text"
          :name="this.name"
          @input="handleChangeInput($event)"
          @focus="handleFocusShowBtnArrowIcon()"
          @blur="handleBlurShowBtnArrowIcon"
          @keydown="handleListItemKey"
          @keyup.enter="handleEnterKey"
          v-model="selectedRecord.ServiceHobbyName"
          @click="handleGetPositionContent"
          autocomplete="off"
        />
        <button class="combobox-table-btnIcon" v-show="this.isShowBtnIcon">
          <Icon
            icon="material-symbols:arrow-left"
            width="24"
            height="24"
            :rotate="1"
            :horizontalFlip="true"
          />
        </button>
      </div>

      <div class="combobox-table-content" v-show="this.isShowContentCb" style="overflow: auto">
        <div class="combobox-table-thead" style="position: sticky; top: -1px">
          <div class="combobox-table-thead-title border-right">Sở thích</div>
          <div class="combobox-table-thead-title">Thêm tiền</div>
        </div>
        <div class="combobox-table-body">
          <ul
            class="combobox-table-content-list"
            :style="`height: ${
              this.contentComboboxFilter?.length * 28 > 130
                ? 130
                : this.contentComboboxFilter?.length * 28
            }px;`"
          >
            <li
              v-for="(item, index) in this.contentComboboxFilter"
              :key="item.id"
              :class="`combobox-table-content-item ${index === selectedIndex ? 'selected' : ''}`"
              @click="handleChooseRecord(item)"
              @keydown.enter="handleListItemEnterKey(item, index)"
            >
              <div class="combobox-table-content-childItem border-right">
                {{ item.ServiceHobbyName }}
              </div>
              <div class="combobox-table-content-childItem">{{ item.MoreMoney }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.combobox-table {
  position: relative;
}
.combobox-table-panel {
  width: 100%;
  display: flex;
  height: 28px;
}

.combobox-table-input {
  border: none;
  width: 100%;
  padding: 0 3px;
}
.combobox-table-input:focus {
  border: 1px solid var(--color-border-blue-default);
}

.combobox-table-btnIcon {
  border: none;
  background-color: #fff;
  cursor: pointer;
}

.combobox-table-content {
  position: fixed;
  background-color: #fff;
  width: 350px;
  box-shadow: 0px 3px 25px rgba(124, 130, 141, 0.2);
  z-index: 6;
}

.combobox-table-thead {
  display: flex;
  justify-content: space-between;
  background-color: #ccc;
  align-items: center;
  height: 28px;
}

.combobox-table-thead-title {
  width: 100%;
  text-align: center;
}

.combobox-table-body {
  overflow: auto;
}
.combobox-table-content-list {
}
.combobox-table-content-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.combobox-table-content-item:hover {
  background-color: var(--color-table-row-hover-primary);
  cursor: pointer;
}
.combobox-table-content-item:focus {
  background-color: var(--background-item-selected);
}
.combobox-table-content-item.selected {
  background-color: var(--background-item-selected);
}

.combobox-table-content-childItem {
  display: flex;
  width: 100%;
  justify-content: center;
  height: 28px;
  align-items: center;
}

.border-right {
  border-right: 1px solid #e0e0e0;
}
</style>
