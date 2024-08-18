<script>
import { Icon } from '@iconify/vue'
import MISAInput from '../../../components/MISAInput.vue'

import MISACombobox from '../../../components/MISACombobox.vue'
import MISAButton from '../../../components/MISAButton.vue'
import { filterInfoEntity, getDataById, getNewCode } from '../../../utils/FetchData'
import MISATooltip from '../../../components/MISATooltip.vue'
import InputFunctions from '../../../utils/functions/InputFunctions'

export default {
  name: 'FormMenuDetail',
  components: { Icon, MISAInput, MISACombobox, MISAButton, MISATooltip },
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      optionsMenuGroupRecord: [
        {
          id: 1,
          value: 10,
          typeCombobox: this.$TypeComboboxEnum.MenuGroup
        },
        {
          id: 2,
          value: 15,
          typeCombobox: this.$TypeComboboxEnum.MenuGroup
        },
        {
          id: 3,
          value: 20,
          typeCombobox: this.$TypeComboboxEnum.MenuGroup
        }
      ],
      optionsFoodUnitRecord: [
        {
          id: 1,
          value: 10,
          typeCombobox: this.$TypeComboboxEnum.FoodUnit
        },
        {
          id: 2,
          value: 15,
          typeCombobox: this.$TypeComboboxEnum.FoodUnit
        },
        {
          id: 3,
          value: 20,
          typeCombobox: this.$TypeComboboxEnum.FoodUnit
        }
      ],
      optionsFoodProcessingPlaceRecord: [
        {
          id: 1,
          value: 10,
          typeCombobox: this.$TypeComboboxEnum.FoodProcessingPlace
        },
        {
          id: 2,
          value: 15,
          typeCombobox: this.$TypeComboboxEnum.FoodProcessingPlace
        },
        {
          id: 3,
          value: 20,
          typeCombobox: this.$TypeComboboxEnum.FoodProcessingPlace
        }
      ],
      foodChild: {}, // Đối tượng chứa các thay đổi trên component con
      // MenuGroup
      menuGroups: [],
      menuGroup: {},
      // FoodUnit
      foodUnits: [],
      foodUnit: {},
      // FoodProcessingPlace
      foodProcessingPlaces: [],
      foodProcessingPlace: {},
      fileTest: '',
      moneyInput: '',
      // ##### Khởi tạo Input
      inputsRequired: [],
      isFirstFocusInput: false, // Trạng thái focus lần đầu input
      newFoodCode: '',
      foodId: null
    }
  },
  async created() {
    this.foodId = this.$route.params?.id
    await this.fetchData()

    await this.handleFetchDataMenuGroup()
    await this.handleFetchDataFoodUnit()
    await this.handleFetchDataFoodProcessingPlace()

    // Nhận từ MenuDialogForm.vue
    this.$msemitter.on(this.$EmitterEnum.showValidateInput, this.handleShowValidateInputError)
  },
  mounted() {
    // Thực hiện lấy toàn bộ giá trị đối tượng food cha
    this.foodChild = this.food
    this.handleReferenceInputRequired()
    window.addEventListener('keydown', this.handleTabKey)
  },
  beforeUnmount() {
    this.$msemitter.off(this.$EmitterEnum.showValidateInput, this.handleShowValidateInputError)
    window.removeEventListener('keydown', this.handleTabKey)
  },
  watch: {
    foodChild() {
      this.$emit('update:food', this.foodChild) // Thực hiện phát sự thay đổi lên component cha qua tham số "food"
    },

    food: {
      deep: true,
      handler(newValue) {
        this.foodChild = newValue
      }
    }
  },
  computed: {
    /**
     * - Xử lí lấy các query trên url
     * - Author: DDKhang (1/7/2023)
     */
    handleQueryUrl() {
      const { page, limit, type } = this.$route.query
      const skip = (parseInt(page) - 1) * parseInt(limit)
      return { page, limit, skip, type }
    },

    /**
     * Params:
     * Des:  Tính toán thêm hoặc cập nhật
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    behaviorHandle() {
      if (this.foodId && this.handleQueryUrl.type === 'duplicate') {
        return this.$BehaviorHandleEnum.Duplicate
      } else if (this.foodId) {
        return this.$BehaviorHandleEnum.Edit // Thực hiện Edit
      } else {
        return this.$BehaviorHandleEnum.AddNew // Thực hiện Create
      }
    }
  },
  methods: {
    /**
     * - Thực hiện bắt sự kiện enter trên checkbox
     * - Author: DDKhang (9/7/2023)
     */
    handleKeyEnter() {
      this.foodChild.ShowOnMenu = !this.foodChild.ShowOnMenu
    },
    /**
     *
     * @param {*} event - Sự kiện khi gọi hàm
     * Author: DDKhang (11/5/2023)
     */
    handleTabKey(event) {
      if (event.keyCode === 9 && event.target === document.activeElement) {
        // Kiểm tra xem phần tử đang focus có phải là phần tử cuối cùng hay không
        const lastTabIndex = 12 // Thay thế N bằng tabIndex của phần tử cuối cùng
        if (event.target.tabIndex === lastTabIndex) {
          event.preventDefault() // Ngăn chặn hành vi mặc định của tab
          this.focusFirstInput() // Set focus vào phần tử input đầu tiên
        }
      }
    },
    /**
     * - Thực forcus vào thẻ input employeeCode
     * - Author: DDKhang (11/5/2023)
     */
    focusFirstInput() {
      this.$refs.foodNameRef?.focusInput() // Set focus vào phần tử input đầu tiên
    },

    formatMoney() {
      // Loại bỏ các ký tự không phải số từ chuỗi nhập vào
      let rawValue = this.moneyInput.replace(/[^0-9]/g, '')

      // Định dạng số tiền bằng cách thêm dấu chấm theo từng hàng
      let formattedValue = ''
      while (rawValue.length > 3) {
        formattedValue = '.' + rawValue.slice(-3) + formattedValue
        rawValue = rawValue.slice(0, -3)
      }
      formattedValue = rawValue + formattedValue

      // Cập nhật giá trị định dạng vào biến dữ liệu
      this.moneyInput = formattedValue
      this.foodChild.InitialPrice = formattedValue.split('.').join('')
    },

    /**
     * - Thực hiện lấy dữ liệu
     * - Author: DDKhang (3/7/2023)
     */
    async fetchData() {
      // Thực hiện khởi tạo đối tượng lọc thông tin ban đầu cho Combobox "Nhóm thực đơn"
      await this.fetchInitialMenuGroupComboboxFilter()

      await this.fetchInitialFoodUnitComboboxFilter()

      await this.fetchInitialFoodProcessingComboboxFilter()
    },

    /**
     * - Thực hiện lấy thông tin filter combobox ban đầu
     * - Author: DDKhang (29/6/2023)
     */
    async fetchInitialMenuGroupComboboxFilter() {
      const formatOptionFilter = {
        Page: 1,
        Start: 0,
        Limit: 10,
        Filters: []
      }
      // Gọi api
      const res = await filterInfoEntity(this.$EntityNameEnum.MenuGroups, formatOptionFilter)
      const menuGroups = res.data.Data
      // Cấu trúc lại giá trị cho combobox
      const formatDataCombobox = menuGroups.map((m) => {
        return {
          id: m.MenuGroupId,
          value: m.MenuGroupName
        }
      })
      this.menuGroups = formatDataCombobox
    },

    /**
     * - Thực hiện lấy thông tin filter combobox ban đầu
     * - Author: DDKhang (29/6/2023)
     */
    async fetchInitialFoodUnitComboboxFilter() {
      const formatOptionFilter = {
        Page: 1,
        Start: 0,
        Limit: 10,
        Filters: []
      }
      // Gọi api
      const res = await filterInfoEntity(this.$EntityNameEnum.FoodUnits, formatOptionFilter)
      const foodUnits = res.data.Data
      // Cấu trúc lại giá trị cho combobox
      const formatDataCombobox = foodUnits.map((m) => {
        return {
          id: m.FoodUnitId,
          value: m.FoodUnitName
        }
      })
      this.foodUnits = formatDataCombobox
    },

    /**
     * - Thực hiện lấy thông tin filter combobox ban đầu
     * - Author: DDKhang (29/6/2023)
     */
    async fetchInitialFoodProcessingComboboxFilter() {
      const formatOptionFilter = {
        Page: 1,
        Start: 0,
        Limit: 10,
        Filters: []
      }
      // Gọi api
      const res = await filterInfoEntity(
        this.$EntityNameEnum.FoodProcessingPlaces,
        formatOptionFilter
      )
      const foodUnits = res.data.Data
      // Cấu trúc lại giá trị cho combobox
      const formatDataCombobox = foodUnits.map((m) => {
        return {
          id: m.FoodProcessingPlaceId,
          value: m.FoodProcessingPlaceName
        }
      })
      this.foodProcessingPlaces = formatDataCombobox
    },

    /**
     * - Tùy chỉnh class cho combobox nhóm thực đơn
     * - Author: DDKhang (27/6/2023)
     */
    handleCustomClassGroupMenuCombobox() {
      return {
        borderLeftNone: 'border-left--none',
        backgroundWhite: 'backgroundColor--white',
        widthInput: 'width-full'
      }
    },

    /**
     *
     * @param {*} option - Gía chọn từ combobox
     * - Thực hiện lấy giá trị được chọn trong combobox
     * - Author: DDKhang (27/6/2023)
     */
    handleChooseRecordCombobox(option) {
      console.log('Option: ', option)
      switch (option.typeCombobox) {
        case this.$TypeComboboxEnum.MenuGroup:
          this.foodChild.MenuGroupId = option.id
          this.foodChild.MenuGroupName = option.value

          // Cập nhật cho đối tượng nhóm đồ ăn
          this.menuGroup.MenuGroupId = option.id
          this.menuGroup.MenuGroupName = option.value

          break
        case this.$TypeComboboxEnum.FoodUnit:
          this.foodChild.FoodUnitId = option.id
          this.foodChild.FoodUnitName = option.value

          // Cập nhật cho đối tượng đơn vị đồ ăn
          this.foodUnit.FoodUnitId = option.id
          this.foodUnit.FoodUnitName = option.value
          break
        case this.$TypeComboboxEnum.FoodProcessingPlace:
          this.foodChild.FoodProcessingPlaceId = option.id
          // this.foodChild.FoodProcessingPlaceId = option.value
          // Cập nhật cho đối tượng nơi chế biếnk
          this.foodProcessingPlace.FoodProcessingPlaceId = option.id
          // this.foodProcessingPlace.FoodProcessingPlaceName = option.value

          this.foodProcessingPlace.FoodProcessingPlaceId = option.id
          this.foodProcessingPlace.FoodProcessingPlaceName = option.value

          break
      }
    },

    // ##### --- Methods khởi tạo giá trị ban đầu cho combobox - Start --- #####
    // ### MenuGroup
    /**
     * - Des: Khởi tạo giá trị mặc định cho combobox để hiển thị ngay khi ban đầu (dùng cho update mà muốn hiển thi)
     * - Author: DDKhang (1/6/2023)
     */
    handleDefaultValueMenuGroupCombobox() {
      return {
        id: this.menuGroup.MenuGroupId,
        value: this.menuGroup.MenuGroupName
        // id: this.menuGroup.MenuGroupId,
        // value: this.menuGroup.MenuGroupName
      }
    },
    /**
     * - Thực hiện lấy thông tin của nhóm thực đơn theo id
     * - Author: DDKhang (1/6/2023)
     */
    async handleFetchDataMenuGroup() {
      if (this.foodChild?.MenuGroupId) {
        const res = await getDataById(this.$EntityNameEnum.MenuGroups, {
          ids: this.foodChild?.MenuGroupId
        })
        this.menuGroup = res.data[0]
      }
    },

    // ### FoodUnit
    handleDefaultValueFoodUnitCombobox() {
      return {
        id: this.foodUnit.FoodUnitId,
        value: this.foodUnit.FoodUnitName
      }
    },
    /**
     * - Thực hiện lấy thông tin của nhóm thực đơn theo id
     * - Author: DDKhang (1/6/2023)
     */
    async handleFetchDataFoodUnit() {
      if (this.foodChild?.FoodUnitId) {
        const res = await getDataById(this.$EntityNameEnum.FoodUnits, {
          ids: this.foodChild?.FoodUnitId
        })
        this.foodUnit = res.data[0]
      }
    },

    // ### FoodProcessingPlace
    handleDefaultValueFoodProcessingPlaceCombobox() {
      return {
        id: this.foodProcessingPlace.FoodProcessingPlaceId,
        value: this.foodProcessingPlace.FoodProcessingPlaceName
      }
    },
    /**
     * - Thực hiện lấy thông tin của nhóm thực đơn theo id
     * - Author: DDKhang (1/6/2023)
     */
    async handleFetchDataFoodProcessingPlace() {
      if (this.foodChild?.FoodProcessingPlaceId) {
        const res = await getDataById(this.$EntityNameEnum.FoodProcessingPlaces, {
          ids: this.foodChild?.FoodProcessingPlaceId
        })
        this.foodProcessingPlace = res.data[0]
      }
    },

    // ##### --- Methods khởi tạo giá trị ban đầu cho combobox - End --- #####
    /**
     * - Xử lí thay đổi file hình ảnh
     * - Author: DDKhang (2/7/2023)
     */
    handleChangeFile(event) {
      // event.preventDefault()
      console.log('Hello')
      const file = event.target.files[0] // Lấy tệp hình ảnh từ sự kiện
      const reader = new FileReader() // Tạo đối tượng đọc file

      console.log('Hello1')
      reader.onload = (e) => {
        this.fileTest = e.target.result // Đặt đường dẫn hình ảnh cho thuộc tính dữ liệu
      }
      this.foodChild = { ...this.foodChild, ImageFile: file }

      reader.readAsDataURL(file) // Đọc file và chuyển đổi thành đường dẫn dữ liệu
    },

    /**
     * - Thực hiện xóa hình ảnh
     * - Author: DDKhang (2/7/2023)
     */
    handleDeleteImg() {
      this.fileTest = null
      // eslint-disable-next-line no-unused-vars
      const { ImageFile, ...newFoodChild } = this.foodChild
      this.foodChild = newFoodChild
      if (newFoodChild.Image) {
        this.foodChild = { ...newFoodChild, Image: '' }
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

    // ##### --- Methods xử lí hiển thị lỗi trên input- Start --- #####

    /**
     * - Thực hiện tham chiếu đến các thẻ input [required]
     * - Author: DDKhang (3/7/2023)
     */
    handleReferenceInputRequired() {
      const inputFoodName = this.$refs.foodNameRef
      const inputFoodCode = this.$refs.foodCodeRef
      const inputPrice = this.$refs.priceRef
      const cbCalcUnit = this.$refs.calcUnitRef

      const inputsRequired = [
        {
          inputElement: inputFoodName,
          name: 'FoodName'
        },
        {
          inputElement: inputFoodCode,
          name: 'FoodCode'
        },
        {
          inputElement: inputPrice,
          name: 'Price'
        },
        {
          inputElement: cbCalcUnit,
          name: 'FoodUnitId'
        }
      ]
      this.inputsRequired = inputsRequired
    },

    /**
     * - Hiển thị lỗi trên tất cả các input | combobox
     * - Author: DDKhang (3/7/2023)
     */
    handleShowValidateInputError() {
      let flagErrorInput = false
      this.isFirstFocusInput = true

      this.inputsRequired.forEach((input) => {
        if (!this.food[input.name]) {
          flagErrorInput = true
          // Tham chieu len thẻ cha (".formGroup")
          const tagParent = input.inputElement.$el.closest('.form-group')
          tagParent.classList.add('invalid')
          if (this.isFirstFocusInput) {
            input.inputElement.$el.focus()
            // Thực hiện không focus vào các thẻ input lỗi khác
            this.isFirstFocusInput = false
          }
        } else {
          flagErrorInput = false
        }
      })
      // Phát lên MenuDialogForm.vue
      this.$msemitter.emit(this.$EmitterEnum.statusCheckBlankInput, flagErrorInput)
      return flagErrorInput
    },

    // ##### --- Methods xử lí hiển thị lỗi trên input- End --- #####
    /**
     * - Thực hiện tạo mã món ăn mới khi thực hiện blur ra ngoài thẻ input FoodName
     * - Author: DDKhang (4/7/2023)
     */
    async handleGenerationFoodCode(event) {
      const { value } = event.target
      // Lấy các chữ cái đầu của tên món ăn
      let code = ''
      const words = value.split(/\s+/)
      words.forEach(
        (w) =>
          (code += w[0]
            ?.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ|Đ/, 'd'))
      )

      if (this.food.FoodName && !this.food.FoodCode) {
        const newFoodCode = await getNewCode(this.$EntityNameEnum.Foods, code)
        this.foodChild = { ...this.foodChild, FoodCode: newFoodCode.data }
      }
    }
  }
}
</script>

<template>
  <div class="formMenu">
    <div class="formMenu__info">
      <!-- Input tên món -->
      <div class="formDetail-item formMenu__info-nameFood">
        <label for="" class="lb-item">
          <p>Tên món</p>
          <span class="lb-item-required">(*)</span>
        </label>
        <div class="form-group formMenu__info-input w-full">
          <MISAInput
            :focus="true"
            v-model="this.foodChild.FoodName"
            name="FoodName"
            :required="true"
            ref="foodNameRef"
            @blur="handleGenerationFoodCode($event)"
            :tabindex="this.$TabIndexEnum.formFoodInfo.FoodName"
          />
          <MISATooltip positionTooltip="tooltip-right">
            <template #tooltip-explain>
              <Icon icon="material-symbols:error" color="red" width="20" height="20" />
            </template>
            <template #tooltip-content> Trường này không được để trống. </template>
          </MISATooltip>
        </div>
      </div>
      <!-- Input Mã món -->
      <div class="formDetail-item formMenu__info-foodCode">
        <label for="" class="lb-item">
          <p>Mã món</p>
          <span class="lb-item-required">(*)</span>
        </label>
        <div class="form-group formMenu__info-input w-full">
          <MISAInput
            v-model="this.foodChild.FoodCode"
            name="FoodCode"
            :required="true"
            ref="foodCodeRef"
            :tabindex="this.$TabIndexEnum.formFoodInfo.FoodCode"
          />
          <MISATooltip positionTooltip="tooltip-right">
            <template #tooltip-explain>
              <Icon icon="material-symbols:error" color="red" width="20" height="20" />
            </template>
            <template #tooltip-content>Trường này không được để trống.</template>
          </MISATooltip>
        </div>
      </div>
      <!-- Combobox Nhóm thực đơn -->
      <div class="formDetail-item formMenu__info-groupMenu">
        <label for="" class="lb-item">
          <p>Nhóm thực đơn</p>
        </label>
        <div class="form-group formMenu__info-input w-full">
          <!-- <input class="input" type="text" /> -->
          <MISACombobox
            :type-combobox="this.$TypeComboboxEnum.MenuGroup"
            :handle-choose-record="handleChooseRecordCombobox"
            :customClass="handleCustomClassGroupMenuCombobox()"
            :listItemValue="this.menuGroups"
            :defaultValueInput="handleDefaultValueMenuGroupCombobox()"
            :tabindex="this.$TabIndexEnum.formFoodInfo.MenuGroup"
          />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Combobox Đơn vị tính -->
      <div class="formDetail-item formMenu__info-unit">
        <label for="" class="lb-item">
          <p>Đơn vị tính</p>
          <span class="lb-item-required">(*)</span>
        </label>
        <div class="form-group formMenu__info-input w-full">
          <MISACombobox
            :type-combobox="this.$TypeComboboxEnum.FoodUnit"
            :handle-choose-record="handleChooseRecordCombobox"
            :customClass="handleCustomClassGroupMenuCombobox()"
            :required="true"
            :listItemValue="this.foodUnits"
            :default-value-input="handleDefaultValueFoodUnitCombobox()"
            ref="calcUnitRef"
            :tabindex="this.$TabIndexEnum.formFoodInfo.FoodUnit"
          />
          <MISATooltip positionTooltip="tooltip-right">
            <template #tooltip-explain>
              <Icon icon="material-symbols:error" color="red" width="20" height="20" />
            </template>
            <template #tooltip-content>Trường này không được để trống.</template>
          </MISATooltip>
        </div>
      </div>
      <!-- Input Giá bán -->
      <div class="formDetail-item formMenu__info-price">
        <label for="" class="lb-item">
          <p>Giá bán</p>
          <span class="lb-item-required">(*)</span>
        </label>
        <div class="form-group formMenu__info-input w-full">
          <MISAInput
            class="w-1-2 input-text-right"
            v-model="this.foodChild.Price"
            :required="true"
            @keydown="restrictNonNumeric"
            @focus="$event.target.select()"
            ref="priceRef"
            type="number"
            :tabindex="this.$TabIndexEnum.formFoodInfo.Price"
          />
          <MISATooltip positionTooltip="tooltip-right">
            <template #tooltip-explain>
              <Icon icon="material-symbols:error" color="red" width="20" height="20" />
            </template>
            <template #tooltip-content>Trường này không được để trống.</template>
          </MISATooltip>
        </div>
      </div>
      <!-- Input Giá vốn -->
      <div class="formDetail-item formMenu__info-initialPrice">
        <label for="" class="lb-item">
          <p>Giá vốn</p>
        </label>
        <div class="form-group formMenu__info-input w-full">
          <MISAInput
            class="w-1-2 input-text-right"
            v-model="this.foodChild.InitialPrice"
            @keydown="restrictNonNumeric"
            @focus="$event.target.select()"
            type="number"
            :tabindex="this.$TabIndexEnum.formFoodInfo.InitialPrice"
          />
          <!-- ref="moneyInput" -->
          <!-- @input="formatMoney" -->
          <!-- <MISAInput class="w-1-2 input-text-right" v-model="this.foodChild.InitialPrice" /> -->

          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Mô tả -->
      <div class="formDetail-item formMenu__info-description align-item-start">
        <label for="" class="lb-item align-item-start">
          <p>Mô tả</p>
        </label>
        <div class="form-group formMenu__info-input w-full">
          <textarea
            id=""
            class="input formMenu__info-input-desc textField-input input-focus"
            name=""
            rows="4"
            v-model="this.foodChild.Description"
            style="height: 80px"
            :tabindex="this.$TabIndexEnum.formFoodInfo.Description"
          ></textarea>
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Combobox Chế biến tại -->
      <div class="formDetail-item formMenu__info-foodProcessingPlace">
        <label for="" class="lb-item">
          <p>Chế biến tại</p>
        </label>
        <div class="form-group formMenu__info-input w-full">
          <MISACombobox
            :type-combobox="this.$TypeComboboxEnum.FoodProcessingPlace"
            :handle-choose-record="handleChooseRecordCombobox"
            :customClass="handleCustomClassGroupMenuCombobox()"
            :listItemValue="this.foodProcessingPlaces"
            :default-value-input="handleDefaultValueFoodProcessingPlaceCombobox()"
            :tabindex="this.$TabIndexEnum.formFoodInfo.FoodProcessingPlace"
          />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Checkbox -->
      <div class="formDetail-item formMenu__info-checkbox">
        <label for="" class="lb-item">
          <p></p>
        </label>
        <div class="formMenu__info-input-checkbox-list w-full">
          <div class="formMenu__info-input-checkbox-noShowOnMenu">
            <input
              class="input input-checkbox"
              type="checkbox"
              :checked="this.foodChild.ShowOnMenu"
              v-model="this.foodChild.ShowOnMenu"
              id="ckShowOnMenu"
              :tabindex="this.$TabIndexEnum.formFoodInfo.ShowOnMenu"
              @keydown.enter="handleKeyEnter($event)"
            />
            <label for="ckShowOnMenu">Không hiển thị trên thực đơn</label>
          </div>

          <div
            class="formMenu__info-input-checkbox-noShowOnMenu"
            v-if="behaviorHandle === this.$BehaviorHandleEnum.Edit"
          >
            <input
              class="input input-checkbox"
              type="checkbox"
              id="ckStopSelling"
              :checked="this.foodChild.StopSelling > 0 ? true : false"
              v-model="this.foodChild.StopSelling"
              :tabindex="this.$TabIndexEnum.formFoodInfo.StopSelling"
            />
            <label for="ckStopSelling">Ngừng bán</label>
          </div>
        </div>
      </div>
    </div>

    <div class="formMenu__image">
      <fieldset>
        <legend>Ảnh đại diện</legend>
        <div class="formMenu__image-panel">
          <div class="formMenu__image-panel-info-image">
            <!-- Image chọn -->
            <img
              v-if="this.fileTest !== ''"
              :src="fileTest"
              alt=""
              class="formMenu__image-panel-info-image-show"
            />
            <!-- Image đã tồn tại -->
            <img
              v-else-if="this.foodChild.Image !== '' && this.foodChild.Image"
              :src="`https://localhost:44333/Resources/${this.foodChild.Image}`"
              alt="Không có hình ảnh"
              class="formMenu__image-panel-info-image-show"
            />
            <!-- Image mặc định -->
            <img
              v-else
              src="https://media.istockphoto.com/id/1013809392/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-vector-dao-k%C3%A9o-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-c%E1%BB%A7a-m%E1%BB%99t-qu%C3%A1n-c%C3%A0-ph%C3%AA-nh%C3%A0-h%C3%A0ng-dao-n%C4%A9a-v%C3%A0-th%C3%ACa-c%C3%B3-b%C3%B3ng.jpg?s=2048x2048&w=is&k=20&c=3zdWyV_f9pxc_fk_fRMvMvsaSevNecHNaU3EgT28jXc="
              alt=""
              class="formMenu__image-panel-info-image-show"
            />
            <div class="formMenu__image-panel-info-image-type">
              <p>Chọn các ảnh có định dạng</p>
              <p class="formMenu__image-panel-info-image-type-extension">
                (.jpg, .jpeg, .png, .gif)
              </p>
            </div>
          </div>
          <div class="formMenu__image-panel-btn-handle">
            <MISAButton class="formMenu__image-panel-btn-handle-chooseImg">
              <input
                type="file"
                style="
                  display: none;
                  height: 100%;
                  width: 50px;
                  position: absolute;
                  cursor: pointer;
                  border: none;
                "
                accept="image/*"
                @change="handleChangeFile"
                id="fileImg"
              />
              <label for="fileImg" style="cursor: pointer">
                <Icon
                  icon="ph:dots-three-bold"
                  width="24"
                  height="24"
                  :horizontalFlip="true"
                  :verticalFlip="true"
                />
              </label>
            </MISAButton>
            <MISAButton @click="handleDeleteImg" class="formMenu__image-panel-btn-handle-closeImg">
              <Icon
                icon="iconamoon:close"
                color="red"
                width="24"
                height="24"
                :horizontalFlip="true"
                :verticalFlip="true"
              />
            </MISAButton>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.formMenu {
  display: flex;
  column-gap: 8px;
  justify-content: space-between;
}

.formMenu__info {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 70%;
  margin-top: 8px;
}

.formDetail-item {
  display: flex;
  align-items: center;
}

.formMenu__info-nameFood {
}

.lb-item {
  display: flex;
  align-items: center;
  column-gap: 3px;
  min-width: 120px;
}

.lb-item-required {
  color: var(--color-text-required);
}

.formMenu__info-input {
  display: flex;
  align-items: center;
  column-gap: 6px;
}

.form-group .tooltip {
  display: none;
}

.invalid input {
  border: 1px solid #cf4c35;
}
.invalid .tooltip {
  display: block;
}

.formMenu__info-input .input {
  flex: 1;
}

.formMenu__info-input-des {
}

.formMenu__info-input-checkbox {
}

.formMenu__info-input-checkbox-noShowOnMenu {
  display: flex;
  align-items: center;
  height: 30px;
  column-gap: 5px;
}

// ##### --- Form Image --- #####
.formMenu__image {
  width: 30%;
}
.formMenu__image fieldset {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--color-border-default);
}

.formMenu__image-panel {
  display: flex;
  column-gap: 8px;
}

.formMenu__image-panel-info-image {
  flex: 1;
  text-align: center;
}

.formMenu__image-panel-info-image-show {
  min-width: 150px;
  min-height: 150px;
  max-width: 150px;
  max-height: 150px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
}

.formMenu__image-panel-info-image-type {
}

.formMenu__image-panel-info-image-type-extension {
  font-weight: 600;
}

.formMenu__image-panel-btn-handle {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}

.formMenu__image-panel-btn-handle-chooseImg {
  position: relative;
}

.formMenu__image-panel-btn-handle-closeImg {
}

.formMenu__info-input-desc {
  font-family: 'Tahoma', Geneva, sans-serif;
}

// Các tiện ích thêm
.w-full {
  width: 100%;
}

.align-item-start {
  align-items: flex-start;
}

.input-text-right {
  text-align: right;
}

.input-checkbox {
  cursor: pointer;
}
.input-checkbox:focus {
  outline: 1px solid blue;
}
</style>
