<script>
import MISAButton from '@/components/MISAButton.vue'
import MISAPopupInput from '@/components/MISAPopupInput.vue'
import MainListFooter from './MainListFooter.vue'
// import MenuDialogForm from './MenuDialogForm.vue'
import MISACombobox from '../../components/MISACombobox.vue'
import MISAPopupRightClick from '../../components/MISAPopupRightClick.vue'

export default {
  data() {
    return {
      listToolbarItem: null, // Danh sách toolbar table
      optionsNumberRecord: [
        {
          id: 1,
          value: 10
        },
        {
          id: 2,
          value: 15
        },
        {
          id: 3,
          value: 20
        },
        {
          id: 4,
          value: 30
        },
        {
          id: 5,
          value: 40
        },
        {
          id: 6,
          value: 50
        },
        {
          id: 7,
          value: 60
        },
        {
          id: 8,
          value: 70
        },
        {
          id: 9,
          value: 80
        }
      ],
      // ##### --- Biến khởi tạo cho popup right click --- #####
      isShowPopupRightClick: false, // Trạng thái đóng mở  "popup right click"
      popupX: 0, // Vị trí hiển thị popup theo trục x
      popupY: 0, // Vị trí hiển thị popup theo trục y

      // ##### --- Biến khởi tạo cho chọn nhiều dòng trên bảng --- #####
      selectedRows: [] // Chứa các dòng được chọn trên table
    }
  },
  components: { MISAButton, MISAPopupInput, MainListFooter, MISACombobox, MISAPopupRightClick },
  created() {
    // Thực hiện lấy danh sách toolbar table
    this.listToolbarItem = this.$ResourceToolbarTable.toolbarItems
  },
  mounted() {
    window.addEventListener('click', this.handleClosePopupContent)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleClosePopupContent)
  },
  methods: {
    /**
     *
     * @param {*} typeBtn - Kiểu btn toolbar
     * - Thực hiện điều hướng sang việc xử lí các btn tương ứng
     * - Author: DDKhang (23/6/2023)
     */
    handleRedirectMenuCreate(typeBtn) {
      switch (typeBtn) {
        case this.$TypeToolbarBtnEnum.create:
          this.$router.push('/menu/create')
          break
        case this.$TypeToolbarBtnEnum.edit:
          console.log('Edit')
          break
      }
    },

    /**
     * - Thực hiện cung cấp các class (class trong component combobox) để thực hiện thay đổi trên combobox
     * - Author: DDKhang (23/6/2023)
     */
    handleCustomClassCombobox() {
      return {
        heightInput: 'height-28'
      }
    },

    // ##### --- Methods Popup right click - Start --- #####
    showPopupRightClickAt(event, row) {
      this.isShowPopupRightClick = true
      this.popupX = event.clientX
      this.popupY = event.clientY

      // Xử lí nội dung lấy từ việc nhấn lên dòng tương ứng
      console.log('Row: ', row)
    },

    /**
     * - Xử lí đóng "popup right click" khi nhấn chuột trái trên màn hình
     * - Author: DDKhang (24/6/2023)
     */
    handleClosePopupContent() {
      this.isShowPopupRightClick = false
    },

    /**
     * - Xử lí khi nhấn trên các thành phần của popup
     * - Author: DDKhang (24/6/2023)
     */
    handleClickPopupRightItem() {
      console.log('Hello')
    },
    // ##### --- Methods Popup right click - End --- #####

    // ##### --- Methods Chọn nhiều dòng trên bảng - Start --- #####
    /**
     *
     * @param {*} event - Sự kiện mặc định
     * @param {*} rowItem - Đối tượng rowItem được chọn
     * - Xử lí việc chọn dòng dữ liệu trên table
     * - Author: DDKhang (24/6/2023)
     */
    handleSelectedRow(event, rowItem) {
      if (event.ctrlKey) {
        // Kiểm tra dòng đó đã được chọn chưa
        const index = this.selectedRows.indexOf(rowItem)
        if (index === -1) {
          // Dòng chưa được chọn
          this.selectedRows.push(rowItem)
        } else {
          // Dòng đã được chọn, thì loại bỏ đối tượng đó ra khỏi mảng
          this.selectedRows.splice(index, 1)
        }
      } else {
        // Nếu chỉ bấm chuột mà không sử dụng kèm với nút Ctrl -> chọn 1 dòng
        this.selectedRows = [rowItem]
      }
    },

    /**
     *
     * @param {*} rowItem - Đối tương dòng hiện tại
     * @returns { boolean }
     * - Thực hiện kiểm tra xem đối tượng dòng hiện tại trong bảng đã được chọn hay chưa
     * - Author: DDKhang (24/6/2023)
     */
    isSelectedRows(rowItem) {
      return this.selectedRows.includes(rowItem)
    }

    // ##### --- Methods Chọn nhiều dòng trên bảng - End --- #####
  }
}
</script>

<template>
  <main class="main-content">
    <!-- <MenuDialogForm /> -->
    <router-view name="MenuDialogFormRouterView"></router-view>
    <!-- Hiển thị popup right click -->
    <MISAPopupRightClick
      v-if="isShowPopupRightClick"
      :qualityItemPopup="this.$ResourceToolbarTable.toolbarItems.length"
      :x="this.popupX"
      :y="this.popupY"
    >
      <ul class="popup-rightClick__list-option">
        <li
          class="popup-rightClick__list-option-item"
          v-for="(itemToolbarPopup, index) in this.$ResourceToolbarTable.toolbarItems"
          :key="index"
          @click="handleClickPopupRightItem"
        >
          <div :class="itemToolbarPopup.classIcon"></div>
          <p class="popup-rightClick__list-option-item-content">
            {{ itemToolbarPopup.title }}
          </p>
        </li>
      </ul>
    </MISAPopupRightClick>

    <div class="main-content--primary">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-item" v-for="(toolbarItem, index) in listToolbarItem" :key="index">
          <MISAButton
            :title="toolbarItem.tooltip"
            class="button border-transparent px-3 py-10 toolbar-item-btn border-default-none"
            @click="handleRedirectMenuCreate(toolbarItem.type)"
          >
            <div :class="toolbarItem.classIcon"></div>
            <span>{{ toolbarItem.title }}</span>
          </MISAButton>
        </div>
      </div>
    </div>
    <div class="main-table">
      <!-- Table -->
      <div class="main__table-info">
        <table id="table-menu">
          <thead>
            <tr>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Loại món</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsNumberRecord"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Mã món</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Tên món</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Nhóm thực đơn</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Đơn vị tính</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Giá bán</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Thay đổi theo thời giá</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsNumberRecord"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Điều chỉnh giá tự do</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsNumberRecord"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Định lượng NVL</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsNumberRecord"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Hiển thị trên thực đơn</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Ngừng bán</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="i in 30"
              :key="i"
              :class="`${isSelectedRows(i) ? 'selectedRow' : ''}`"
              @click="handleSelectedRow($event, i)"
            >
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Footer table -->
      <footer class="main-content__footer">
        <MainListFooter />
      </footer>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-content--primary {
}

.main-table {
  border: 1px solid var(--color-border-default);
}

.toolbar {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-default);
  height: var(--height-main-toolbar-table);
  padding: 3px;
  column-gap: 10px;
  background-color: var(--background-color-table-primary);
  border-bottom: none;
}

.toolbar-item {
  box-sizing: border-box;
}
.toolbar-item-btn {
  display: flex;
  column-gap: 8px;
  align-items: center;
  background-color: var(--background-color-table-primary);
}
.toolbar-item-btn:hover {
  background-color: #fff;
}

.toolbarItem-add-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat -1px -2648px;
  width: 14px;
  height: 16px;
}
.toolbarItem-edit-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat 0 -1872px;
  width: 15px;
  height: 15px;
}
.toolbarItem-delete-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat -2px -2683px;
  width: 12px;
  height: 11px;
}
.toolbarItem-duplicate-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat -1px -1888px;
  width: 14px;
  height: 15px;
}
.toolbarItem-refresh-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat 0 -2586px;
  width: 16px;
  height: 13px;
}

// ##### --- Table - Start --- #####
.main__table-info {
  height: calc(
    100vh - var(--height-header-primary) - var(--height-main-top-title) -
      var(--height-main-toolbar-table) - var(--height-main-footer-table) - 10px
  );
  width: 100%;
  overflow: auto;
  position: relative;
  min-width: 700px;
}

#table-menu thead {
  position: sticky;
  top: 0;
  z-index: var(--zIndex-table-menu-thead);
}

#table-menu {
  border-collapse: separate;
  border-spacing: 0;
  /* Phải thêm cả "overflow: scroll;" cho cả thẻ cha(.main__table-info) và thẻ con (#table-menu) */
  overflow: scroll;
}

.main__table-info thead {
  background-color: #f2f2f2;
  position: sticky;
  top: 0;
}

.main__table-info tr:first-child th {
  position: sticky;
  top: 0;
  min-width: 50px;
}
.main__table-info tbody tr:hover td {
  background-color: var(--color-table-row-hover-primary);
}

.main__table-info table {
  border-collapse: collapse;
  width: 100%;
  border: 0;
  text-align: left;
  background-color: #fff;
  overflow: hidden;
}

// ##### -- Thực hiện thêm các border - Start -- #####
.main__table-info th,
td {
  border-bottom: 1px solid var(--color-border-default);
}
.main__table-info td {
  padding: 5px 10px;
}

// ##### --- Thực hiện điều chỉnh border cho "thead th" --- #####
.main__table-info th:not(:last-child) {
  border-left: 1px solid #e0e0e0;
}
.main__table-info th:is(:first-child) {
  border-left: none;
}
.main__table-info th:is(:last-child) {
  border-left: 1px solid #e0e0e0;
  // border-right: 1px solid #e0e0e0;
}

.main__table-info th {
  // border-top: 1px solid #e0e0e0;
}

// ##### --- Thực hiện điều chỉnh border cho "td" --- #####
.main__table-info td:not(:last-child) {
  border-left: 1px solid #e0e0e0;
}
.main__table-info td:is(:first-child) {
  border-left: none;
}
.main__table-info td:is(:last-child) {
  border-left: 1px solid #e0e0e0;
  // border-right: 1px solid #e0e0e0;
}

// ##### -- Thực hiện thêm các border - End -- #####

// Css mới
.table-menu {
}

.main__table-info tbody tr {
  position: relative;
  height: 28px;
}
.table-menu__title-col {
  font-weight: 500;
  padding: 7px 10px;
}

.table-menu-thead__filter {
}

// ##### --- Popup right click --- #####
.popup-rightClick__list-option {
  list-style-type: none;
}

.popup-rightClick__list-option-item {
  display: flex;
  column-gap: 8px;
  padding: 5px;
  height: 28px;
  align-items: center;
}
.popup-rightClick__list-option-item:hover {
  background-color: var(--color-table-row-hover-primary);
  cursor: pointer;
  transition: all 0.3s;
}

.popup-rightClick__list-option-item-content {
}

// Những tiện ích chung
.table-menu__theadItem-filter {
  height: 64px;
  text-align: center;
}

.border-transparent {
  border: 1px solid var(--background-color-table-primary);
}

.selectedRow {
  background-color: var(--background-item-selected);
}
</style>
