<script>
import MISAButton from '@/components/MISAButton.vue'
import MISAPopupInput from '@/components/MISAPopupInput.vue'
import MainListFooter from './MainListFooter.vue'
import MISACombobox from '../../components/MISACombobox.vue'
import MISAPopupRightClick from '../../components/MISAPopupRightClick.vue'
import { deleteMultiple, postData } from '../../utils/FetchData'
import BaseUrl from '../../utils/BaseUrl'
import TheLoading from '../../components/TheLoading.vue'

import MISACheckbox from '../../components/MISACheckbox.vue'
import { filterInfoEntity } from '../../utils/FetchData'
import { useMenuFoodStore } from '../../stores/menuFood'

export default {
  data() {
    return {
      listToolbarItem: null, // Danh sách toolbar table
      optionsFoodTypeRecord: [
        {
          id: 'ft-1',
          value: 'Tất cả',
          valueFilter: 1,
          typeCondition: '=',
          property: 'TypeFoodId',
          type: 'GUID',
          addition: 'and'
        },
        {
          id: 'ft-2',
          value: 'Món ăn',
          valueFilter: 2,
          typeCondition: '=',
          property: 'TypeFoodId',
          type: 'GUID',
          addition: 'and'
        },
        {
          id: 'ft-3',
          value: 'Đồ uống',
          valueFilter: 3,
          typeCondition: '=',
          property: 'TypeFoodId',
          type: 'GUID',
          addition: 'and'
        }
      ],
      optionsStopSelling: [
        {
          id: 'ss-1',
          value: 'Có',
          valueFilter: 1, // Tìm kiếm theo điều kiện có
          typeCondition: '=',
          property: 'StopSelling',
          type: 'int',
          addition: 'and'
        },
        {
          id: 'ss-2',
          value: 'Không',
          valueFilter: 0, // Tìm kiếm theo điều kiện không
          typeCondition: '=',
          property: 'StopSelling',
          type: 'int',
          addition: 'and'
        }
      ],
      // ##### --- Biến khởi tạo cho popup right click --- #####
      isShowPopupRightClick: false, // Trạng thái đóng mở  "popup right click"
      popupX: 0, // Vị trí hiển thị popup theo trục x
      popupY: 0, // Vị trí hiển thị popup theo trục y

      // ##### --- Biến khởi tạo cho chọn nhiều dòng trên bảng --- #####
      selectedRows: [], // Chứa các dòng được chọn trên table
      filterOptions: [], // Chứa các thuộc tính được lọc
      menuFoods: [],
      loading: false,
      loadingProgress: 0,
      menuFoodStore: useMenuFoodStore()
    }
  },
  components: {
    MISAButton,
    MISAPopupInput,
    MainListFooter,
    MISACombobox,
    MISAPopupRightClick,
    MISACheckbox,
    TheLoading
  },
  created() {
    // Thực hiện lấy danh sách toolbar table
    this.listToolbarItem = this.$ResourceToolbarTable.toolbarItems
    this.fetchData()
  },
  mounted() {
    window.addEventListener('click', this.handleClosePopupContent)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleClosePopupContent)
  },
  watch: {
    '$route.query': {
      async handler() {
        this.fetchDataByPageAndLimit()
      }
    }
  },
  methods: {
    async fetchData() {
      const formatOptionFilter = {
        Page: 1,
        Start: 0,
        Limit: 30,
        Filters: []
      }
      this.$router.push({
        query: { page: formatOptionFilter.Page, limit: formatOptionFilter.Limit }
      })
      const res = await filterInfoEntity(this.$EntityNameEnum.Foods, formatOptionFilter)
      this.menuFoods = res.data.Data
      // Đặt giá trị cho store
      this.menuFoodStore.setDataFilter(res.data)
    },

    async fetchDataByPageAndLimit() {
      const { page, limit } = this.$route.query
      if (page && limit) {
        const formatOptionFilter = {
          Page: page,
          Start: 0,
          Limit: limit,
          Filters: []
        }

        const res = await filterInfoEntity(this.$EntityNameEnum.Foods, formatOptionFilter)
        this.menuFoods = res.data.Data
        this.menuFoodStore.setDataFilter(res.data)
      }
    },

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
          if (this.selectedRows.length > 0) {
            this.handleEditRowItem(this.selectedRows[0].FoodId)
          }
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

      // Kiểm tra dòng đã tồn tại trong danh sách dòng đã lựa chọn trước đó
      const isRowItemExist = this.selectedRows.indexOf(row)
      if (isRowItemExist === -1) {
        // Thực hiện chọn 1 dòng khi nhấn vào dòng đó
        this.selectedRows = [row]
      }
      // Xử lí nội dung lấy từ việc nhấn lên dòng tương ứng
      if (this.selectedRows.length > 0) {
        // Thực hiện bấm chuột phải lên 1 trong các dòng đã chọn -> xử lí các dòng đó || Bấm ra ngoài các dòng đã chọn thì xử lí dòng hiện tại
        console.log('Handle Rows', this.selectedRows)
      }
      // console.log('Row: ', row)
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
    handleClickPopupRightItem(btnType) {
      switch (btnType) {
        case this.$TypeToolbarBtnEnum.create:
          console.log('Create')
          break
        case this.$TypeToolbarBtnEnum.duplicate:
          console.log('duplicate')
          break
        case this.$TypeToolbarBtnEnum.edit:
          console.log('edit')
          break
        case this.$TypeToolbarBtnEnum.delete:
          console.log('delete')
          this.handleBtnDelete()
          break
        case this.$TypeToolbarBtnEnum.refresh:
          console.log('refresh')
          this.handleBtnRefesh()
          break
      }
    },
    // --- End ---

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
    },
    // --- End ---

    // ##### --- Methods Thực hiện lọc trên cột tương ứng - Start --- #####
    handleChooseRecordCombobox(option) {
      const filterOptions = [...this.filterOptions]
      if (filterOptions.length === 0) {
        // Thực hiện thêm đối tượng vào mảng
        const optionNewFilter = {}
        optionNewFilter.xType = 'filter'
        optionNewFilter.isCreateFromFilterRow = true
        optionNewFilter.property = option.property
        optionNewFilter.operator = option.typeCondition
        optionNewFilter.value = option.valueFilter
        ;(optionNewFilter.addition = option.addition),
          (optionNewFilter.group = option.property + 'FromFilterRow')

        this.filterOptions.push(optionNewFilter)
      } else {
        let isFlagReplace = false
        // Kiểm tra option đã tồn tại trong filterOptions
        const newOptionFilter = filterOptions.map((fo) => {
          console.log('fo.property: ', fo.property)
          console.log('Condition: ', fo.property === option.property)
          if (fo.property === option.property) {
            const optionNewFilter = {}
            optionNewFilter.xType = 'filter'
            optionNewFilter.isCreateFromFilterRow = true
            optionNewFilter.property = option.property
            optionNewFilter.operator = option.typeCondition
            optionNewFilter.value = option.valueFilter
            ;(optionNewFilter.addition = option.addition),
              (optionNewFilter.group = option.property + 'FromFilterRow')

            isFlagReplace = true
            return optionNewFilter
          }
          return fo
        })

        if (!isFlagReplace) {
          const optionNewFilterAdd = {}
          optionNewFilterAdd.xType = 'filter'
          optionNewFilterAdd.isCreateFromFilterRow = true
          optionNewFilterAdd.property = option.property
          optionNewFilterAdd.operator = option.typeCondition
          optionNewFilterAdd.value = option.valueFilter
          ;(optionNewFilterAdd.addition = option.addition),
            (optionNewFilterAdd.group = option.property + 'FromFilterRow')

          newOptionFilter.push(optionNewFilterAdd)
        }
        console.log('NewOptionFilter: ', newOptionFilter)
        this.filterOptions = newOptionFilter
      }
      console.log('Option: ', option)
    },

    formatOptionFilter(option) {
      // Thực hiện thêm đối tượng vào mảng
      const optionNewFilter = {}
      optionNewFilter.xType = 'filter'
      optionNewFilter.isCreateFromFilterRow = true
      optionNewFilter.property = option.property
      optionNewFilter.operator = option.typeCondition
      optionNewFilter.value = option.valueFilter
      optionNewFilter.type = option.dataTypesFilter
      ;(optionNewFilter.addition = option.addition),
        (optionNewFilter.group = option.property + 'FromFilterRow')

      return optionNewFilter
    },

    /**
     *
     * @param {*} option - Gía trị lấy từ popup input
     * - Thực hiện lọc dữ liệu trên popup input
     * - Author: DDKhang (25/6/2023)
     */
    async handleFilterPopupInput(option) {
      try {
        const filterOptions = [...this.filterOptions]
        let newOptionFilter = [] // Chứa option filter

        if (filterOptions.length === 0) {
          // Nếu filterOptions ban đầu chưa có giá trị
          // 1. Cấu trúc lại option theo đúng quy định
          const optionNewFilter = this.formatOptionFilter(option)
          // 2. Thực hiện thêm đối tượng vào mảng
          newOptionFilter.push(optionNewFilter)
          this.filterOptions.push(optionNewFilter)
        } else {
          let isFlagPushOption = false
          // Kiểm tra option đã tồn tại trong filterOptions
          newOptionFilter = filterOptions.map((fo) => {
            if (fo.property === option.property) {
              // Nếu option đó đã tồn tại
              const optionNewFilter = this.formatOptionFilter(option)
              isFlagPushOption = true
              return optionNewFilter
            }
            return fo
          })

          if (!isFlagPushOption) {
            // Nếu option đó chưa tồn tại
            const optionNewFilterAdd = this.formatOptionFilter(option)
            newOptionFilter.push(optionNewFilterAdd)
          }
          this.filterOptions = newOptionFilter
        }

        // Cấu hình lại dữ liệu gửi lên để lọc
        const formatOptionFilter = {
          Page: 1,
          Start: 0,
          Limit: 20,
          Filters: [...newOptionFilter]
        }

        const res = await postData(`${BaseUrl}/Foods/filter`, formatOptionFilter)
        console.log('Res filter: ', res)
        this.menuFoods = res.data.Data

        console.log('Option: ', option)
      } catch (error) {
        console.log('error: ', error)
      }
    },
    // --- End ---

    // ##### --- Xử lí thao tác cho dialog form - Start --- #####
    handleEditRowItem(menuId) {
      this.$router.push(`/menu/${menuId}`)
    },
    // --- End ---

    // ##### --- Methods xử lí chọn button để xử lí --- Start #####
    async handleBtnDelete() {
      const listFoodIds = this.selectedRows.map((f) => {
        return f.FoodId
      })
      const strFoodListIds = listFoodIds.join(',')
      await deleteMultiple(this.$EntityNameEnum.Foods, strFoodListIds)
    },

    async handleBtnRefesh() {
      this.loadData()
    },

    /**
     * Params: null
     * Des: Xử lí tải dữ liệu employee từ server ("Không sử dụng nữa, thay bằng fetchDataByPageAndLimit()")
     * Author: DDKhang
     * CreateAt: 30/6/2023
     * ModifierAt: 30/6/2023
     */
    async loadData() {
      this.loading = true
      try {
        const intervalId = setInterval(() => {
          if (this.loadingProgress < 100) {
            this.loadingProgress += 8
          } else {
            clearInterval(intervalId)
            this.loading = false
          }
        }, 2000)
        this.$router.push('/menu?page=1&limit=30')
        const formatOptionFilter = {
          Page: 1,
          Start: 0,
          Limit: 30,
          Filters: []
        }
        const res = await filterInfoEntity(this.$EntityNameEnum.Foods, formatOptionFilter)
        this.loadingProgress = 100
        this.menuFoods = res.data.Data
        this.loading = false

        // Phát thông tin của các bản record -> EmployeeHomeFooter.vue
        // this.$msemitter.emit("recordsResInfo", res.data);
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    }

    // ##### --- Methods xử lí chọn button để xử lí --- End #####
  }
}
</script>

<template>
  <TheLoading v-if="this.loading" :loadingProgress="this.loadingProgress" />
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
          @click="handleClickPopupRightItem(itemToolbarPopup.type)"
        >
          <div :class="itemToolbarPopup.classIcon"></div>
          <p class="popup-rightClick__list-option-item-content">
            {{ itemToolbarPopup.title }}
          </p>
        </li>
      </ul>
    </MISAPopupRightClick>

    <div class="main-content--primary">
      <!-- ######### --- Toolbar ---######### -->
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
      <!-- ######### --- Table ---######### -->
      <div class="main__table-info">
        <table id="table-menu">
          <thead>
            <tr>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Loại món</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsFoodTypeRecord"
                    :handle-choose-record="handleChooseRecordCombobox"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Mã món</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput
                    dataTypesFilter="string"
                    propertyDb="foodCode"
                    :handleFilterPopupInput="handleFilterPopupInput"
                    :defaultOptionPopupInput="this.$ContentPopup.PopupNormal[0]"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Tên món</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput
                    dataTypesFilter="string"
                    propertyDb="FoodName"
                    :contentPopup="this.$ContentPopup.PopupNormal"
                    :handleFilterPopupInput="handleFilterPopupInput"
                    :defaultOptionPopupInput="this.$ContentPopup.PopupNormal[0]"
                  />
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
                  <MISAPopupInput
                    dataTypesFilter="int"
                    propertyDb="Price"
                    :contentPopup="this.$ContentPopup.PopupPrice"
                    :handleFilterPopupInput="handleFilterPopupInput"
                    :defaultOptionPopupInput="this.$ContentPopup.PopupPrice[2]"
                  />
                </div>
              </th>
              <!-- <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Thay đổi theo thời giá</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsFoodTypeRecord"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Điều chỉnh giá tự do</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsFoodTypeRecord"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Định lượng NVL</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsFoodTypeRecord"
                  />
                </div>
              </th> -->
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Hiển thị trên thực đơn</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Ngừng bán</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsStopSelling"
                    :handle-choose-record="handleChooseRecordCombobox"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="food in this.menuFoods"
              :key="food.FoodId"
              :class="`${isSelectedRows(food) ? 'selectedRow' : ''}`"
              @click="handleSelectedRow($event, food)"
              @dblclick="handleEditRowItem(food.FoodId)"
            >
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                {{ food.TypeFoodName }}
              </td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                {{ food.FoodCode }}
              </td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                {{ food.FoodName }}
              </td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                {{ food.MenuGroupName }}
              </td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                {{ food.FoodUnitName }}
              </td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                {{ food.Price }}
              </td>
              <td
                class=""
                @contextmenu.prevent="showPopupRightClickAt($event, food)"
                style="text-align: center"
              >
                <MISACheckbox class="disable" @dblclick.stop :checked="false" />
              </td>
              <td
                class=""
                @contextmenu.prevent="showPopupRightClickAt($event, food)"
                style="text-align: center"
              >
                <MISACheckbox
                  class="disable"
                  @dblclick.stop
                  :checked="food.StopSelling ? true : false"
                />
              </td>
              <!-- <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, i)">Value 1</td> -->
            </tr>
          </tbody>
        </table>
      </div>
      <!-- ######### ---  Footer table ######### -->
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
