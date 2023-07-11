<script>
import MISAButton from '@/components/MISAButton.vue'
import MISAPopupInput from '@/components/MISAPopupInput.vue'
import MainListFooter from './MainListFooter.vue'
import MISACombobox from '../../components/MISACombobox.vue'
import MISAPopupRightClick from '../../components/MISAPopupRightClick.vue'
import { deleteMultiple } from '../../utils/FetchData'
import TheLoading from '../../components/TheLoading.vue'

import MISACheckbox from '../../components/MISACheckbox.vue'
import { filterInfoEntity } from '../../utils/FetchData'
import { useMenuFoodStore } from '../../stores/menuFood'
import MISADialog from '../../components/MISADialog.vue'
import ContentCombobox from '../../resources/contents/ContentCombobox'
import InputFunctions from '../../utils/functions/InputFunctions'
import { FormatNumberPrice } from '../../utils/functions/FormatNumber'

export default {
  data() {
    return {
      listToolbarItem: null, // Danh sách toolbar table
      optionsFoodTypeRecord: [],
      optionsStopSelling: [],
      optionsShowOnMenu: [],
      // ##### --- Biến khởi tạo cho popup right click --- #####
      isShowPopupRightClick: false, // Trạng thái đóng mở  "popup right click"
      popupX: 0, // Vị trí hiển thị popup theo trục x
      popupY: 0, // Vị trí hiển thị popup theo trục y

      // ##### --- Biến khởi tạo cho chọn nhiều dòng trên bảng --- #####
      selectedRows: [], // Chứa các dòng được chọn trên table
      selectedRowRightClick: [], // Chứa dòng được chọn khi click chuộ phải trên table
      filterOptions: [], // Chứa các thuộc tính được lọc
      menuFoods: [],
      // ##### --- Biển khởi tạo Loading
      loading: false,
      loadingProgress: 0,
      menuFoodStore: useMenuFoodStore(), // Kho quản lí state

      // ##### --- Biến khởi tạo dialog thông báo
      objDialog: {}, // Chứa các thuộc tính để thực hiện hiển thị | thao tác trên dialog thông báo
      isDialogNotification: false, // Trạng thái đóng mở dialog
      typePerform: {}, // Kiểu thực hiện khi bấm nút trên dialog
      newOptionFilters: [], // Chứa các giá trị filter

      // ##### --- Biến khởi tạo sắp xếp
      optionsSort: [] // Chứa các lựa chọn sắp xếp
    }
  },
  components: {
    MISAButton,
    MISAPopupInput,
    MainListFooter,
    MISACombobox,
    MISAPopupRightClick,
    MISACheckbox,
    TheLoading,
    MISADialog
  },
  created() {
    // Thực hiện lấy danh sách toolbar table
    this.listToolbarItem = this.$ResourceToolbarTable.toolbarItems
    // Thực hiện lấy danh sách nội dung combobox
    this.optionsFoodTypeRecord = ContentCombobox.optionsFoodTypeRecord
    this.optionsStopSelling = ContentCombobox.optionsStopSelling
    this.optionsShowOnMenu = ContentCombobox.optionsShowOnMenu
    // Lấy dữ liệu ban đầu
    this.fetchData()

    this.$msemitter.on(this.$EmitterEnum.loadAgainRecords, this.loadData)
    this.$msemitter.on(this.$EmitterEnum.refreshPage, this.fetchData)
    // this.$msemitter.on(this.$EmitterEnum.handleDuplicate, this.handleBtnDuplicate)
  },
  mounted() {
    window.addEventListener('click', this.handleClosePopupContent)
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleClosePopupContent)
    window.removeEventListener('keydown', this.handleKeyDown)

    this.$msemitter.off(this.$EmitterEnum.loadAgainRecords, this.loadData)
    this.$msemitter.off(this.$EmitterEnum.refreshPage, this.fetchData)
    // this.$msemitter.off(this.$EmitterEnum.handleDuplicate, this.handleBtnDuplicate)
  },
  computed: {
    /**
     * - Xử lí lấy các query trên url
     * - Author: DDKhang (1/7/2023)
     */
    handleQueryUrl() {
      const { page, limit } = this.$route.query
      const skip = (parseInt(page) - 1) * parseInt(limit)
      return { page, limit, skip }
    }
  },
  watch: {
    '$route.query': {
      async handler() {
        this.fetchDataByPageAndLimit()
      }
    }
  },
  methods: {
    handleIconSortByStatus(status) {
      console.log('Status Number: ', status)
      let nameIconSort = ''
      if (status === 0) {
        nameIconSort = ''
      } else if (status === 1) {
        nameIconSort = 'arrow-down'
      } else if (status === 2) {
        nameIconSort = 'arrow-up'
      }
      return nameIconSort
    },
    /**
     *
     * @param {*} event - Sự kiện mặc định
     * - Thực hiện xử lí khi nhấn phím
     * - Author: (8/5/2023)
     */
    handleKeyDown(event) {
      if (event.ctrlKey && event.key === this.$ResourceShortCut.BtnAdd.char) {
        event.preventDefault() // Ngăn chặn hành động mặc định của trình duyệt
        this.handleRedirectMenuCreate(
          this.$ResourceToolbarTable.toolbarItems.find(
            (tI) => tI.type === this.$TypeToolbarBtnEnum.create
          ).type
        )
      } else if (event.ctrlKey && event.key === this.$ResourceShortCut.BtnEdit.char) {
        event.preventDefault() // Ngăn chặn hành động mặc định của trình duyệt
        this.handleRedirectMenuCreate(
          this.$ResourceToolbarTable.toolbarItems.find(
            (tI) => tI.type === this.$TypeToolbarBtnEnum.edit
          ).type
        )
      } else if (event.ctrlKey && event.key === this.$ResourceShortCut.BtnDelete.char) {
        event.preventDefault() // Ngăn chặn hành động mặc định của trình duyệt
        this.handleRedirectMenuCreate(
          this.$ResourceToolbarTable.toolbarItems.find(
            (tI) => tI.type === this.$TypeToolbarBtnEnum.delete
          ).type
        )
      } else if (event.ctrlKey && event.key === this.$ResourceShortCut.BtnRefresh.char) {
        event.preventDefault() // Ngăn chặn hành động mặc định của trình duyệt
        this.handleRedirectMenuCreate(
          this.$ResourceToolbarTable.toolbarItems.find(
            (tI) => tI.type === this.$TypeToolbarBtnEnum.refresh
          ).type
        )
      }
    },
    /**
     * - Thực hiện lấy danh sách dữ liệu ban đầu
     * - Author: DDKhang (30/6/2023)
     */
    async fetchData() {
      this.loading = true
      const formatOptionFilter = {
        Page: 1,
        Start: 0,
        Limit: 30,
        Sorts: [...this.optionsSort],
        Filters: []
      }

      this.$router.push({
        query: { page: formatOptionFilter.Page, limit: formatOptionFilter.Limit }
      })

      const intervalId = setInterval(() => {
        if (this.loadingProgress < 100) {
          this.loadingProgress += 8
        } else {
          clearInterval(intervalId)
          this.loading = false
        }
      }, 2000)
      this.filterOptions = []
      const res = await filterInfoEntity(this.$EntityNameEnum.Foods, formatOptionFilter)
      this.loadingProgress = 100
      this.menuFoods = res.data.Data
      // Đặt giá trị cho store
      this.menuFoodStore.setDataFilter(res.data)
      this.loading = false
    },

    /**
     * - Lấy dữ liệu từ các thông tin page và limit
     * - Author: DDKhang (30/6/2023)
     */
    async fetchDataByPageAndLimit() {
      this.loading = true

      const { page, limit } = this.$route.query
      if (page && limit) {
        const formatOptionFilter = {
          Page: page,
          Start: 0,
          Limit: limit,
          Sorts: [...this.optionsSort],
          Filters: []
        }
        let newFormatOptionFilter = formatOptionFilter
        // Nếu mà có giá trị filter thì thực hiện hiển thị trang tương ứng với các giá trị filter đó
        if (this.filterOptions.length > 0) {
          newFormatOptionFilter = { ...formatOptionFilter, Filters: [...this.filterOptions] }
        }

        const intervalId = setInterval(() => {
          if (this.loadingProgress < 100) {
            this.loadingProgress += 8
          } else {
            clearInterval(intervalId)
            this.loading = false
          }
        }, 2000)
        const res = await filterInfoEntity(this.$EntityNameEnum.Foods, newFormatOptionFilter)
        this.loadingProgress = 100
        this.menuFoods = res.data.Data
        this.menuFoodStore.setDataFilter(res.data)
        this.loading = false
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
        case this.$TypeToolbarBtnEnum.duplicate:
          if (this.selectedRows.length > 0) {
            this.handleBtnDuplicate(this.selectedRows[0].FoodId)
          }
          break
        case this.$TypeToolbarBtnEnum.delete:
          if (this.selectedRows.length > 0) {
            this.handleDialogBtnDelete()
          }
          break
        case this.$TypeToolbarBtnEnum.refresh:
          this.handleBtnRefesh()
          break
      }
    },

    /**
     * - Thực hiện cung cấp các class (class trong component combobox) để thực hiện thay đổi trên combobox
     * - Author: DDKhang (23/6/2023)
     */
    handleCustomClassCombobox() {
      return {
        heightInput: 'height-28',
        noHandle: 'noHandle'
      }
    },

    // ##### --- Methods Popup right click - Start --- #####
    /**
     *
     * @param {*} event - Sự kiện
     * @param {*} row - Dòng hiện tại bấm chuột phải
     * - Author: DDKhang (24/6/2023)
     */
    showPopupRightClickAt(event, row) {
      this.isShowPopupRightClick = true
      this.popupX = event.clientX
      this.popupY = event.clientY

      // Thực hiện chỉ chọn vào dòng nhấn chuột phải
      this.selectedRowRightClick = [row]

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
          this.handleBtnDuplicate(this.selectedRowRightClick[0].FoodId)
          console.log('duplicate')
          break
        case this.$TypeToolbarBtnEnum.edit:
          this.handleEditRowItem(this.selectedRowRightClick[0].FoodId)
          console.log('edit')
          break
        case this.$TypeToolbarBtnEnum.delete:
          console.log('delete')
          this.handleDialogBtnDelete()
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
    /**
     *
     * @param {*} option - Gía trị chọn của combobox
     * - Thực hiện thao tác với thông tin đã chọn
     * - Author: DDKhang (30/6/2023)
     */
    async handleChooseRecordCombobox(option) {
      const filterOptions = [...this.filterOptions]
      let newOptionFilter = []
      if (filterOptions.length === 0) {
        // Thực hiện thêm đối tượng vào mảng
        const optionNewFilter = this.formatOptionFilter(option)
        newOptionFilter.push(optionNewFilter)
        this.filterOptions.push(optionNewFilter)
      } else {
        let isFlagReplace = false
        // Kiểm tra option đã tồn tại trong filterOptions
        newOptionFilter = filterOptions.map((fo) => {
          if (fo.property === option.property) {
            const optionNewFilter = this.formatOptionFilter(option)
            isFlagReplace = true
            return optionNewFilter
          }
          return fo
        })

        if (!isFlagReplace) {
          const optionNewFilterAdd = this.formatOptionFilter(option)
          newOptionFilter.push(optionNewFilterAdd)
        }
        this.filterOptions = newOptionFilter
      }

      // Cấu hình lại dữ liệu gửi lên để lọc
      const formatOptionFilter = {
        Page: 1,
        Start: 0,
        Limit: this.handleQueryUrl.limit,
        Sorts: [...this.optionsSort],
        Filters: [...newOptionFilter]
      }
      // Để ngăn trường hợp khi bấm btn "Tải lại" sẽ lấy giá trị page hiện tại trên url hiện tại làm giá giá filter (điều này có thể dẫn đến lấy ra số lượng giá trị hiển thị không đúng)
      this.$router.push({
        query: { page: formatOptionFilter.Page, limit: formatOptionFilter.Limit }
      })

      const res = await filterInfoEntity(this.$EntityNameEnum.Foods, formatOptionFilter)
      this.menuFoodStore.setDataFilter(res.data)
      this.menuFoods = res.data.Data
    },

    /**
     *
     * @param {*} option - Gía trị thuộc tính muốn lọc
     * - Thực hiện cấu trúc các trường thông tin cần lọc
     * - Author: DDKhang (3/7/2023)
     */
    formatOptionFilter(option) {
      // Thực hiện thêm đối tượng vào mảng
      const optionNewFilter = {}
      optionNewFilter.xType = 'filter'
      optionNewFilter.isCreateFromFilterRow = true
      optionNewFilter.property = option.property
      optionNewFilter.operator = option.typeCondition
      optionNewFilter.value = option.valueFilter?.trim()
      optionNewFilter.type = option.dataTypesFilter
      ;(optionNewFilter.addition = option.addition),
        (optionNewFilter.group = option.property + 'FromFilterRow')

      return optionNewFilter
    },

    /**
     *
     * @param {*} typeDb - Tên thuộc tính database
     * @param {*} value  - Gía trị muốn kiểm tra
     * - Kiểm tra có sự thay đổi giá trị trên các filter input
     * - Author: DDKhang (10/7/2023)
     */
    handleChangeValueFilter(typeDb, value, typeCondition) {
      console.log({ typeDb, value, typeCondition })
      let isFlagChange = false
      const item = this.newOptionFilters?.filter((n) => {
        return n.property === typeDb
      })
      // eslint-disable-next-line no-empty
      if (item?.length > 0) {
      } else {
        return true
      }

      this.newOptionFilters?.forEach((item) => {
        if (item.property === typeDb) {
          if (item.value !== value || item.operator !== typeCondition) {
            isFlagChange = true
          }
        }
      })
      return isFlagChange // Không có sự thay đổi về giá trị
    },

    /**
     *
     * @param {*} option - Gía trị lấy từ popup input
     * - Thực hiện lọc dữ liệu trên popup input
     * - Author: DDKhang (25/6/2023)
     */
    async handleFilterPopupInput(option) {
      console.log('Option: ', option)
      try {
        let isChangeFilter = true
        const filterOptions = [...this.filterOptions]
        let newOptionFilter = [] // Chứa option filter

        // Thực hiện kiểm tra có sự thay đổi giá trị trên input filter
        if (this.newOptionFilters?.length > 0) {
          const isHandleChange = this.handleChangeValueFilter(
            option.property,
            option.valueFilter?.trim(),
            option.typeCondition?.trim()
          )
          isChangeFilter = isHandleChange
        }

        console.log('IsChangeFilter: ', isChangeFilter)

        // Nếu có sự thay đổi giá trị filter
        if (isChangeFilter) {
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
              // Nếu option đó chưa tồn tại -> Thực hiện thêm option
              const optionNewFilterAdd = this.formatOptionFilter(option)
              newOptionFilter.push(optionNewFilterAdd)
            }

            // Thực hiện lọc bỏ các giá trị filter có kiểu "int" và value = ""
            newOptionFilter = newOptionFilter
              .map((itemFilter) => {
                if (itemFilter.type === 'int' && itemFilter.value.trim() === '') {
                  return null
                }
                return itemFilter
              })
              .filter(Boolean)
            // Lưu lại giá trị lọc
            this.filterOptions = newOptionFilter
          }
          // Thực hiện lưu lại sự thay đổi của các giá trị filter
          this.newOptionFilters = [...newOptionFilter]

          // Cấu hình lại dữ liệu gửi lên để lọc
          const formatOptionFilter = {
            Page: 1,
            Start: 0,
            Limit: this.handleQueryUrl.limit,
            Sorts: [...this.optionsSort],
            Filters: [...newOptionFilter]
          }
          // Để ngăn trường hợp khi bấm btn "Tải lại" sẽ lấy giá trị page hiện tại trên url hiện tại làm giá giá filter (điều này có thể dẫn đến lấy ra số lượng giá trị hiển thị không đúng)
          this.$router.push({
            query: { page: formatOptionFilter.Page, limit: formatOptionFilter.Limit }
          })

          const res = await filterInfoEntity(this.$EntityNameEnum.Foods, formatOptionFilter)
          this.menuFoodStore.setDataFilter(res.data)
          this.menuFoods = res.data.Data
        }
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
    /**
     * - Hiển thị dialog thông báo cho btn delete
     * - Author: DDKhang (3/7/2023)
     */
    handleDialogBtnDelete() {
      // Cấu tạo câu thông báo
      let sentenceNotifi = ''
      if (this.selectedRows.length > 1) {
        sentenceNotifi = this.$ResourceDialogNotification.deleteMulti
      } else {
        const foodInfo = this.selectedRows[0]
        sentenceNotifi = `Bạn có chắc chắn muốn xóa món <<${foodInfo.FoodCode} - ${foodInfo.FoodName} >> không?.`
      }

      // Thực hiện thông báo hỏi xác nhận xóa
      // 1. Tạo dialog thông báo hỏi
      this.objDialog = {
        titleDialog: this.$ResourceDialogNotification.titleDialog,
        contentDialog: sentenceNotifi,
        iconContent: {
          name: 'ph:question-fill',
          color: '#0072bc'
        },
        typeHandle: this.$TypeBtnDialogEnum.TypeHandleTask.deleteElement,
        isBtnHave: true,
        isBtnNo: true,
        isBtnCancel: false,
        isBtnAgree: false
      }
      // 2. Mở dialog form
      this.isDialogNotification = true
    },

    /**
     * - Thực xử lí bấm nút xóa trên popup right click | toolbar
     * - Author: DDKhang (30/6/2023)
     */
    async handleBtnDelete() {
      const listFoodIds = this.selectedRows.map((f) => {
        return f.FoodId
      })
      const strFoodListIds = listFoodIds.join(',')
      const res = await deleteMultiple(this.$EntityNameEnum.Foods, strFoodListIds)

      if (res.status === this.$HttpStatusCodeEnum.NoContent) {
        // Thực hiện Tải lại dữ liệu
        this.loadData(this.handleQueryUrl.page)

        // Hiển thị toast thông báo
        // 1. Thông tin thông báo
        const toastInfo = {
          status: this.$ResourceToast.DeleteEntity.DeleteSuccess.status,
          msg: this.$ResourceToast.DeleteEntity.DeleteSuccess.msg
        }
        // 2. Phát lên App.vue -> để hiển thị Toast
        this.$msemitter.emit(this.$EmitterEnum.showToast, toastInfo, 5000)
      }
    },

    /**
     *
     * @param {*} entityId - Mã đối tượng muốn nhân bản
     * - Author: DDKhang (3/7/2023)
     *
     */
    async handleBtnDuplicate(entityId) {
      this.$router.push(`/menu/${entityId}?type=duplicate`)
    },

    /**
     * - Thực hiện làm mới dữ liệu theo các điều kiện
     * - Author: DDKhang (30/6/2023)
     */
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
    async loadData(pagePresent = 1) {
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
        const { limit } = this.$route.query
        this.$router.push({ query: { page: pagePresent, limit } })
        // Cấu hình lại dữ liệu gửi lên để lọc
        const formatOptionFilter = {
          Page: pagePresent,
          Start: 0,
          Limit: limit,
          Sorts: [...this.optionsSort],
          Filters: [...this.filterOptions]
        }

        const res = await filterInfoEntity(this.$EntityNameEnum.Foods, formatOptionFilter)
        this.loadingProgress = 100
        this.menuFoods = res.data.Data
        this.menuFoodStore.setDataFilter(res.data)
        this.loading = false

        // Phát thông tin của các bản record -> EmployeeHomeFooter.vue
        // this.$msemitter.emit("recordsResInfo", res.data);
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    },
    // ##### --- Methods xử lí chọn button để xử lí --- End #####

    // ##### --- Methods xử lí trên dialog thông báo --- Start #####
    /**
     *
     * @param {*} typeBtn - Kiểu button dialog
     * - Thực hiện xử lí tác vụ của từng loại button trên dialog
     * - Author: DDKhang (23/6/2023)
     */
    async handleChooseBtnPanelOnDialog(typeBtn, typeHandle) {
      switch (typeBtn) {
        case this.$TypeBtnDialogEnum.Have:
          if (typeHandle === this.$TypeBtnDialogEnum.TypeHandleTask.deleteElement) {
            await this.handleBtnDelete()
          }
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.No:
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.Cancel:
          // Thực hiện đóng dialog thông báo:
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.Agree:
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
      }
    },
    // ##### --- Methods xử lí trên dialog thông báo --- End #####

    handleCustomClassPopupInput() {
      return {
        textAlignEnd: 'textAlignEnd'
      }
    },

    /**
     *
     * @param {*} event - Đối tượng sự kiện
     * - Thực hiện chỉ cho phép nhập Number vào input
     * - Author: DDKhang (1/7/2023)
     */
    restrictNonNumeric(event) {
      InputFunctions.restrictNonNumeric(event)
    },

    /**
     *
     * @param {*} value - Gía trị cần format theo dạng tiền
     * - Thực hiện cấu trúc lại định dạng số thành định dạng tiền
     * - Author: DDKhang (11/7/2023)
     */
    formatPriceData(value) {
      if (value) {
        const data = { type: 'number', value }
        return FormatNumberPrice(data)
      }
      return ''
    },

    /**
     *
     * @param {*} statusSort - Chỉ số trạng thái sắp xếp
     * - Thực hiện lấy giá trị sắp xếp theo chỉ số
     * - Author: DDKhang (11/7/2023)
     */
    handleTypeStatusSort(statusSort) {
      switch (statusSort) {
        case this.$StatusSortEnum.NoSort.number:
          return this.$StatusSortEnum.NoSort.text
        case this.$StatusSortEnum.Decrease.number:
          return this.$StatusSortEnum.Decrease.text
        case this.$StatusSortEnum.Increase.number:
          return this.$StatusSortEnum.Increase.text
      }
    },

    /**
     *
     * @param {*} event - Sự kiện
     * @param {*} data - Thông tin dữ liệu cột
     * - Thực hiện sắp xếp theo cột
     * - Author: DDKhang (11/7/2023)
     */
    async handleSortByColumn(event, data) {
      const optionSort = this.optionsSort?.find((os) => os.property === data.propertyDb)
      if (optionSort) {
        const changeStatusSort = this.optionsSort.map((os) => {
          const statusSort =
            parseInt(os.statusSort) + 1 > this.$StatusSortEnum.StatusMax
              ? 0
              : parseInt(os.statusSort) + 1
          if (os.property === data.propertyDb) {
            return {
              ...os,
              statusSort,
              direction: this.handleTypeStatusSort(statusSort)
            }
          }
          return os
        })
        this.optionsSort = [...changeStatusSort]
      } else {
        const optionSortNew = {
          property: data.propertyDb,
          statusSort: 1,
          direction: this.handleTypeStatusSort(this.$StatusSortEnum.Decrease.number)
        }

        this.optionsSort.push(optionSortNew)
      }

      // Cấu hình lại dữ liệu gửi lên để lọc
      const formatOptionFilter = {
        Page: 1,
        Start: 0,
        Limit: this.handleQueryUrl.limit,
        Sorts: [...this.optionsSort],
        Filters: [...this.filterOptions]
      }

      const res = await filterInfoEntity(this.$EntityNameEnum.Foods, formatOptionFilter)
      this.menuFoodStore.setDataFilter(res.data)
      this.menuFoods = res.data.Data
    }
  }
}
</script>

<template>
  <TheLoading v-if="this.loading" :loadingProgress="this.loadingProgress" />
  <MISADialog
    v-if="this.isDialogNotification"
    :objDialog="this.objDialog"
    :handleChooseBtnPanelOnDialog="handleChooseBtnPanelOnDialog"
  >
  </MISADialog>
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
                <div class="table-menu__title-col min-width-200">Loại món</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsFoodTypeRecord"
                    :handle-choose-record="handleChooseRecordCombobox"
                    :default-value-input="this.optionsFoodTypeRecord[0]"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div
                  class="table-menu__title-col"
                  @click="(event) => handleSortByColumn(event, { propertyDb: 'FoodCode' })"
                >
                  <p>Mã món</p>
                  <div
                    :class="
                      this.handleIconSortByStatus(
                        this.optionsSort?.find((os) => os.property === 'FoodCode')?.statusSort
                      )
                    "
                  ></div>
                </div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput
                    dataTypesFilter="string"
                    propertyDb="FoodCode"
                    :contentPopup="this.$ContentPopup.PopupNormal"
                    :handleFilterPopupInput="handleFilterPopupInput"
                    :defaultOptionPopupInput="this.$ContentPopup.PopupNormal[0]"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div
                  class="table-menu__title-col"
                  @click="(event) => handleSortByColumn(event, { propertyDb: 'FoodName' })"
                >
                  <p>Tên món</p>
                  <div
                    :class="
                      this.handleIconSortByStatus(
                        this.optionsSort?.find((os) => os.property === 'FoodName')?.statusSort
                      )
                    "
                  ></div>
                </div>
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
                <div
                  class="table-menu__title-col"
                  @click="(event) => handleSortByColumn(event, { propertyDb: 'MenuGroupName' })"
                >
                  <p>Nhóm thực đơn</p>
                  <div
                    :class="
                      this.handleIconSortByStatus(
                        this.optionsSort?.find((os) => os.property === 'MenuGroupName')?.statusSort
                      )
                    "
                  ></div>
                </div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput
                    dataTypesFilter="string"
                    propertyDb="MenuGroupName"
                    :contentPopup="this.$ContentPopup.PopupNormal"
                    :handleFilterPopupInput="handleFilterPopupInput"
                    :defaultOptionPopupInput="this.$ContentPopup.PopupNormal[0]"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div
                  class="table-menu__title-col"
                  @click="(event) => handleSortByColumn(event, { propertyDb: 'FoodUnitName' })"
                >
                  <p>Đơn vị tính</p>
                  <div
                    :class="
                      this.handleIconSortByStatus(
                        this.optionsSort?.find((os) => os.property === 'FoodUnitName')?.statusSort
                      )
                    "
                  ></div>
                </div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput
                    dataTypesFilter="string"
                    propertyDb="FoodUnitName"
                    :contentPopup="this.$ContentPopup.PopupNormal"
                    :handleFilterPopupInput="handleFilterPopupInput"
                    :defaultOptionPopupInput="this.$ContentPopup.PopupNormal[0]"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter width-100">
                <div
                  class="table-menu__title-col"
                  @click="(event) => handleSortByColumn(event, { propertyDb: 'Price' })"
                >
                  <p>Giá bán</p>
                  <div
                    :class="
                      this.handleIconSortByStatus(
                        this.optionsSort?.find((os) => os.property === 'Price')?.statusSort
                      )
                    "
                  ></div>
                </div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput
                    dataTypesFilter="int"
                    propertyDb="Price"
                    :contentPopup="this.$ContentPopup.PopupPrice"
                    :handleFilterPopupInput="handleFilterPopupInput"
                    :defaultOptionPopupInput="this.$ContentPopup.PopupPrice[2]"
                    :customClass="handleCustomClassPopupInput()"
                    @keydown="restrictNonNumeric"
                    typeFormat="number"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter width-200 min-width-200">
                <div class="table-menu__title-col">Hiển thị trên thực đơn</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    dataTypesFilter="int"
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsShowOnMenu"
                    :handle-choose-record="handleChooseRecordCombobox"
                    :defaultValueInput="this.optionsShowOnMenu[0]"
                  />
                </div>
              </th>
              <th class="table-menu__theadItem-filter width-200 min-width-120">
                <div class="table-menu__title-col">Ngừng bán</div>
                <div class="table-menu-thead__filter">
                  <MISACombobox
                    dataTypesFilter="int"
                    :customClass="handleCustomClassCombobox()"
                    :listItemValue="this.optionsStopSelling"
                    :handle-choose-record="handleChooseRecordCombobox"
                    :defaultValueInput="this.optionsStopSelling[0]"
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
                <!-- {{ food.TypeFoodName }} -->
                <div>Món ăn</div>
              </td>
              <td class="width-200" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                <div>{{ food.FoodCode }}</div>
              </td>
              <td class="max-width-300" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                <div class="text-ellipsis">
                  {{ food.FoodName }}
                </div>
              </td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                <div>{{ food.MenuGroupName }}</div>
              </td>
              <td class="" @contextmenu.prevent="showPopupRightClickAt($event, food)">
                <div>{{ food.FoodUnitName }}</div>
              </td>
              <td
                class=""
                style="text-align: end"
                @contextmenu.prevent="showPopupRightClickAt($event, food)"
              >
                <div>{{ formatPriceData(food.Price) }}</div>
              </td>
              <td
                class=""
                @contextmenu.prevent="showPopupRightClickAt($event, food)"
                style="text-align: center"
              >
                <MISACheckbox
                  class="disable"
                  @dblclick.stop
                  :checked="food.ShowOnMenu ? false : true"
                />
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
  display: flex;
  justify-content: center;
  column-gap: 5px;
  cursor: pointer;
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

.max-width-300 {
  max-width: 300px;
}
.max-width-200 {
  max-width: 200px;
}

.min-width-200 {
  min-width: 200px !important;
}
.min-width-120 {
  min-width: 120px !important;
}
.width-150 {
  width: 150px !important;
}
.width-100 {
  width: 100px !important;
}

.text-ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.arrow-up {
  background: url('@/assets/ResourceTable/img/Sprites.64af8f61.svg') no-repeat -1689px -524px;
  width: 11px;
  height: 14px;
}
.arrow-down {
  background: url('@/assets/ResourceTable/img/Sprites.64af8f61.svg') no-repeat -1729px -525px;
  width: 11px;
  height: 14px;
}
</style>
