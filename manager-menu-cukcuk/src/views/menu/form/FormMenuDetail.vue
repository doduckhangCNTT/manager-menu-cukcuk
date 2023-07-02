<script>
import { Icon } from '@iconify/vue'
import MISAInput from '../../../components/MISAInput.vue'

import MISACombobox from '../../../components/MISACombobox.vue'
import MISAButton from '../../../components/MISAButton.vue'
import { filterInfoEntity, getDataById } from '../../../utils/FetchData'

export default {
  name: 'FormMenuDetail',
  components: { Icon, MISAInput, MISACombobox, MISAButton },
  props: {
    food: {
      type: Object
    },
    foodValue: {
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
      foodProcessingPlace: {}
    }
  },
  async created() {
    await this.fetchData()

    await this.handleFetchDataMenuGroup()
    await this.handleFetchDataFoodUnit()
    await this.handleFetchDataFoodProcessingPlace()
  },
  mounted() {
    // Thực hiện lấy toàn bộ giá trị đối tượng food cha
    this.foodChild = this.food
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
  methods: {
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
      switch (option.typeCombobox) {
        case this.$TypeComboboxEnum.MenuGroup:
          this.foodChild.MenuGroupId = option.id
          break
        case this.$TypeComboboxEnum.FoodUnit:
          this.foodChild.FoodUnitId = option.id
          break
        case this.$TypeComboboxEnum.FoodProcessingPlace:
          this.foodChild.FoodProcessingPlaceId = option.id
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
    }

    // ##### --- Methods khởi tạo giá trị ban đầu cho combobox - End --- #####
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
        <div class="formMenu__info-input w-full">
          <MISAInput v-model="this.foodChild.FoodName" />
          <Icon icon="material-symbols:error" color="red" width="20" height="20" />
        </div>
      </div>
      <!-- Input Mã món -->
      <div class="formDetail-item formMenu__info-foodCode">
        <label for="" class="lb-item">
          <p>Mã món</p>
        </label>
        <div class="formMenu__info-input w-full">
          <MISAInput v-model="this.foodChild.FoodCode" />
          <Icon icon="material-symbols:error" color="red" width="20" height="20" />
        </div>
      </div>
      <!-- Combobox Nhóm thực đơn -->
      <div class="formDetail-item formMenu__info-groupMenu">
        <label for="" class="lb-item">
          <p>Nhóm thực đơn</p>
        </label>
        <div class="formMenu__info-input w-full">
          <!-- <input class="input" type="text" /> -->
          <MISACombobox
            :type-combobox="this.$TypeComboboxEnum.MenuGroup"
            :handle-choose-record="handleChooseRecordCombobox"
            :customClass="handleCustomClassGroupMenuCombobox()"
            :listItemValue="this.menuGroups"
            :defaultValueInput="handleDefaultValueMenuGroupCombobox()"
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
        <div class="formMenu__info-input w-full">
          <MISACombobox
            :type-combobox="this.$TypeComboboxEnum.FoodUnit"
            :handle-choose-record="handleChooseRecordCombobox"
            :customClass="handleCustomClassGroupMenuCombobox()"
            :listItemValue="this.foodUnits"
            :default-value-input="handleDefaultValueFoodUnitCombobox()"
          />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Giá bán -->
      <div class="formDetail-item formMenu__info-price">
        <label for="" class="lb-item">
          <p>Giá bán</p>
          <span class="lb-item-required">(*)</span>
        </label>
        <div class="formMenu__info-input w-full">
          <MISAInput class="w-1-2 input-text-right" v-model="this.foodChild.Price" />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Giá vốn -->
      <div class="formDetail-item formMenu__info-initialPrice">
        <label for="" class="lb-item">
          <p>Giá vốn</p>
        </label>
        <div class="formMenu__info-input w-full">
          <MISAInput class="w-1-2 input-text-right" v-model="this.foodChild.InitialPrice" />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Mô tả -->
      <div class="formDetail-item formMenu__info-description align-item-start">
        <label for="" class="lb-item align-item-start">
          <p>Mô tả</p>
        </label>
        <div class="formMenu__info-input w-full">
          <textarea
            id=""
            class="input formMenu__info-input-desc textField-input input-focus"
            name=""
            rows="4"
            v-model="this.foodChild.Description"
            style="height: 80px"
          ></textarea>
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Combobox Chế biến tại -->
      <div class="formDetail-item formMenu__info-foodProcessingPlace">
        <label for="" class="lb-item">
          <p>Chế biến tại</p>
        </label>
        <div class="formMenu__info-input w-full">
          <MISACombobox
            :type-combobox="this.$TypeComboboxEnum.FoodProcessingPlace"
            :handle-choose-record="handleChooseRecordCombobox"
            :customClass="handleCustomClassGroupMenuCombobox()"
            :listItemValue="this.foodProcessingPlaces"
            :default-value-input="handleDefaultValueFoodProcessingPlaceCombobox()"
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
              class="input"
              type="checkbox"
              :checked="this.foodChild.StopSelling > 0 ? true : false"
              v-model="this.foodChild.StopSelling"
            />
            <label for="">Không hiển thị trên thực đơn</label>
          </div>
        </div>
      </div>
    </div>

    <div class="formMenu__image">
      <fieldset>
        <legend>Ảnh đại diện</legend>
        <div class="formMenu__image-panel">
          <div class="formMenu__image-panel-info-image">
            <img
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
              <Icon
                icon="ph:dots-three-bold"
                width="24"
                height="24"
                :horizontalFlip="true"
                :verticalFlip="true"
              />
            </MISAButton>
            <MISAButton class="formMenu__image-panel-btn-handle-closeImg">
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
  width: 150px;
  height: 150px;
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
</style>
