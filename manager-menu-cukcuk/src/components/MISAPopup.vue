<script>
import { Icon } from '@iconify/vue'
export default {
  name: 'MISAPopup',
  props: {
    handleChooseRecord: {
      type: Function
    }
  },
  data() {
    return {
      isPopupContent: false,
      selectedIndex: null,
      valueFilter: null,
      optionsNumberRecord: [
        {
          id: 1,
          value: '* : Chứa',
          icon: '*',
          typeFilter: this.$TypeFilterEnum.Include
        },
        {
          id: 2,
          value: '= : Bằng',
          icon: '=',
          typeFilter: this.$TypeFilterEnum.Equal
        },
        {
          id: 3,
          value: '+ : Bắt đầu bẳng',
          icon: '+',
          typeFilter: this.$TypeFilterEnum.StartEqual
        },
        {
          id: 4,
          value: '-  : Kết thúc bằng',
          icon: '-',
          typeFilter: this.$TypeFilterEnum.EndEqual
        },
        {
          id: 5,
          value: '!  : Không chứa',
          icon: '!',
          typeFilter: this.$TypeFilterEnum.NotContain
        }
      ]
    }
  },
  created() {
    this.initialValueFilter()
  },
  methods: {
    initialValueFilter() {
      const itemInitial = this.optionsNumberRecord[0]
      this.valueFilter = itemInitial
      this.selectedIndex = itemInitial.id - 1
    },

    handleShowPopupContent(event) {
      event.stopPropagation()
      this.isPopupContent = !this.isPopupContent
    },
    handleClosePopupContent() {
      this.isPopupContent = false
    },
    handleChooseTypeFilter(item, index = 0) {
      this.valueFilter = item
      this.selectedIndex = index
      this.handleChooseRecord(item)
    }
  },
  mounted() {
    window.addEventListener('click', this.handleClosePopupContent)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleClosePopupContent)
  },
  components: { Icon }
}
</script>

<template>
  <div class="popup">
    <button class="popup-btn" @click="handleShowPopupContent">{{ this.valueFilter?.icon }}</button>
    <div class="popup-content" v-if="this.isPopupContent">
      <ul class="popup-content-list">
        <li
          v-for="(item, index) in this.optionsNumberRecord"
          :key="index"
          :class="`popup-content-list__item ${this.selectedIndex === index ? 'selected' : ''}`"
          @click="handleChooseTypeFilter(item, index)"
        >
          <div class="popup-content-list__item-icon-dot">
            <span class="popup-content-list__item-icon">
              <Icon icon="icon-park-outline:dot" color="green" width="24" height="24" />
            </span>
          </div>
          <span class="popup-content-list__item-content">{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  position: relative;
}

.popup-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border-default);
}

.popup-btn:hover {
  cursor: pointer;
}

.popup-content {
  background-color: #fff;
  border-radius: 2px;
  position: absolute;
  z-index: 3;
  width: 150px;
  box-shadow: 0px 3px 25px rgba(124, 130, 141, 0.2);
}

.popup-content-list {
  list-style-type: none;
  font-weight: 500;
}

.popup-content-list__item {
  padding: 3px;
  height: 28px;
  display: flex;
  column-gap: 10px;
  align-items: center;
}
.popup-content-list__item:hover {
  background-color: var(--color-table-row-hover-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.popup-content-list__item-icon {
  display: none;
}

.popup-content-list__item-icon-dot {
  width: 10%;
}

.selected .popup-content-list__item-icon {
  display: block;
}

.popup-content-list__item-content {
  // width: 90%;
}
</style>
