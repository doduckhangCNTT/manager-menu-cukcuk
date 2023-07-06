<script>
export default {
  name: 'MISAComboboxTable',
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    listItemValue: {
      type: Array[Object],
      default: () => []
    },
    handleChooseRecordItem: {
      type: Function
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      contentCombobox: [
        {
          id: 1,
          ServiceHobbyName: 'abc',
          MoreMoney: 1
        },
        {
          id: 2,
          ServiceHobbyName: 'abc1',
          MoreMoney: 2
        },
        {
          id: 3,
          ServiceHobbyName: 'abc2',
          MoreMoney: 3
        }
      ],
      contentComboboxFilter: [],
      isShowContentCb: false,
      selectedRecord: {}
    }
  },
  created() {
    this.contentComboboxFilter = [...this.contentCombobox]
  },
  methods: {
    handleToggleContentCb() {
      // Ngăn chặn sự kiện nổi bọt
      event.stopPropagation()
      this.isShowContentCb = !this.isShowContentCb
    },
    handleCloseListItem() {
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
        this.contentComboboxFilter = this.contentCombobox.filter((i) =>
          i.ServiceHobbyName.includes(value.trim())
        )
      } else {
        this.contentComboboxFilter = this.contentCombobox
      }
    },

    handleChooseRecord(item) {
      console.log('first: ', item.ServiceHobbyName)
      this.selectedRecord = { ...item }
    }
  },
  mounted() {
    window.addEventListener('click', this.handleCloseListItem)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleCloseListItem)
  }
}
</script>

<template>
  <div>
    <div class="combobox-table">
      <div class="" @click="handleToggleContentCb">
        <input
          class="combobox-table-input"
          type="text"
          @input="handleChangeInput($event)"
          v-model="this.selectedRecord.ServiceHobbyName"
        />
        <button class="combobox-table-btnIcon">abc</button>
      </div>

      <div class="combobox-table-content" v-show="this.isShowContentCb">
        <div class="combobox-table-thead">
          <div class="combobox-table-thead-title border-right">Title 1</div>
          <div class="combobox-table-thead-title">Title 2</div>
        </div>
        <div class="combobox-table-body">
          <ul class="combobox-table-content-list">
            <li
              v-for="item in this.contentComboboxFilter"
              :key="item.id"
              class="combobox-table-content-item"
              @click="handleChooseRecord(item)"
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

.combobox-table-input {
}

.combobox-table-btnIcon {
}

.combobox-table-content {
  position: absolute;
  background-color: #fff;
  width: 100%;
  box-shadow: 0px 3px 25px rgba(124, 130, 141, 0.2);
  z-index: 5;
}

.combobox-table-thead {
  display: flex;
  justify-content: space-between;
  background-color: #ccc;
}

.combobox-table-thead-title {
  width: 100%;
  text-align: center;
}

.combobox-table-body {
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
