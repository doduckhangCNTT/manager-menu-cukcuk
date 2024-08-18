<script>
import MISAButton from '../../../components/MISAButton.vue'
import { Icon } from '@iconify/vue'
import { filterInfoEntity, getDataById } from '../../../utils/FetchData'
import InputFunctions from '../../../utils/functions/InputFunctions'
import MISAComboboxTable from '../../../components/MISAComboboxTable.vue'
import { FormatNumberPrice } from '../../../utils/functions/FormatNumber'
// import { FormatNumberPrice } from '../../../utils/functions/FormatNumber'
import MISADialog from '../../../components/MISADialog.vue'
// import MISAInput from '../../../components/MISAInput.vue'

export default {
  name: 'FormServiceHobby',
  props: {
    food: {
      type: Object
    }
  },
  components: { MISAButton, Icon, MISAComboboxTable, MISADialog },
  data() {
    return {
      dataListServiceHobby: [{ ServiceHobbyId: '', ServiceHobbyName: '', MoreMoney: '' }], // Dánh sách chứa các giá trị của dòng input trong bảng
      selectIndexLine: 0, // Vị trí hiện tại trên dòng tương ứng (mặc định đang focus vào dòng đầu tiên)
      foodChild: {},
      foodServiceHobbes: [],
      foodId: null,
      serviceHobbes: [],

      // Đối tượng dialog thông báo/Hỏi/Cảnh báo
      objDialog: {},
      isDialogNotification: false // Trạng thái đóng mở dialog
    }
  },
  async created() {
    await this.handleFetchServiceHobby()

    this.foodChild = this.food
    this.foodId = this.$route.params.id
    // if (this.foodId) {
    //   const res = await getDataById(this.$EntityNameEnum.Foods, { ids: this.foodId })
    //   this.foodChild = res.data[0]
    // }
    await this.handleInitialServiceHobby()
  },
  mounted() {},
  watch: {
    food: {
      deep: true,
      handler(newValue) {
        this.foodChild = newValue
      }
    },
    // Thực hiện bắt sự thay đổi trong danh sách sở thích phục vụ -> truyền lên giá trị cha
    dataListServiceHobby() {
      this.$emit('update:food', { ...this.foodChild, ServiceHobbes: this.dataListServiceHobby })
      // Thực hiện cập nhật giá trị sở thích phục vụ cho nội dung con
      this.foodChild = { ...this.foodChild, ServiceHobbes: this.dataListServiceHobby }
    }
  },
  computed: {
    /**
     * - Thực hiện tạo điều kiện ẩn button xóa dòng
     * - Author: DDKhang (22/6/2023)
     */
    isDisableBtnRemoveLine() {
      const qualityItems = this.dataListServiceHobby.length
      if (qualityItems < 1) {
        return true // Thực hiện ẩn
      }
      return false // Không thực hiện ẩn
    }
  },
  methods: {
    /**
     *
     * @param {*} value - Gía trị tiền muốn cấu trúc định dạng
     * - Author: DDKhang (13/7/2023)
     */
    handleFormatNumberPrice(value) {
      const data = { type: 'number', value }
      return FormatNumberPrice(data)
    },
    /**
     * - Thực hiện lấy dữ liệu các sở thích dịch vụ
     * - Author: DDKhang (8/7/2023)
     */
    async handleFetchServiceHobby() {
      const dataFilterServiceHobby = {
        Page: 1,
        Start: 0,
        Limit: 20,
        Filters: []
      }
      const result = await filterInfoEntity(
        this.$EntityNameEnum.ServiceHobbes,
        dataFilterServiceHobby
      )
      this.serviceHobbes = result.data.Data
    },

    /**
     * - Thực hiện chuyển đổi thành cấu trúc dữ liệu cho combobox
     * - Author: DDKhang (3/7/2023)
     */
    handleConvertFormatDataCbTable() {
      const result = this.serviceHobbes.map((sh) => {
        return {
          id: sh.ServiceHobbyId,
          ServiceHobbyName: sh.ServiceHobbyName,
          MoreMoney: sh.MoreMoney
        }
      })
      return result
    },

    /**
     * - Thực hiện lấy các thông tin sở thích theo món ăn tương ứng
     * - Author: DDKhang (3/7/2023)
     */
    async handleInitialServiceHobby() {
      if (this.foodChild.FoodServiceHobby?.length > 0) {
        this.foodServiceHobbes = this.foodChild.FoodServiceHobby?.map((fs) => {
          return fs.ServiceHobbyId
        })

        const serviceHobbyIds = this.foodServiceHobbes.join(',')
        const res = await getDataById(this.$EntityNameEnum.ServiceHobbes, { ids: serviceHobbyIds })
        const formatValueServiceHobby = res.data.map((item) => {
          if (!item.MoreMoney) {
            return { ...item, MoreMoney: 0 }
          }
          return item
        })
        this.dataListServiceHobby = [...formatValueServiceHobby]
      }
    },

    /**
     * - Thực hiện thêm dòng sở thích phục vụ
     * - Author: DDKhang (22/6/2023)
     */
    handleAddLineServiceHobby() {
      this.dataListServiceHobby = [
        ...this.dataListServiceHobby,
        { ServiceHobbyName: '', MoreMoney: '' }
      ]
    },

    /**
     * - Thực hiện xóa 1 dòng trong bảng sở thích phụ vụ
     * - Author: DDKhang (22/6/2023)
     */
    handleRemoveLineServiceHobby() {
      const dataList = [...this.dataListServiceHobby]
      dataList.splice(this.selectIndexLine, 1)
      this.dataListServiceHobby = dataList
    },

    /**
     *
     * @param {*} event - Sự kiện mặc định
     * @param {*} index - Chỉ số thẻ input đang thay đổi
     * - Thực hiện bắt sự thay đổi trên các thẻ input tương ứng
     * - Author: DDKhang (22/6/2023)
     */
    handleChangeInput(event, index) {
      const { value, name } = event.target
      const dataList = [...this.dataListServiceHobby]
      dataList[index][name] = value.split('.').join('')

      // Khi có sự thay đổi trên input thì loại bỏ thuộc tính ServiceHobbyId để khi chuyển
      // lên backend sẽ được hiểu là thêm mới
      if (dataList[index]?.ServiceHobbyId) {
        // eslint-disable-next-line no-unused-vars
        const { ServiceHobbyId, ...newData } = dataList[index]
        dataList[index] = newData
      }
      this.dataListServiceHobby = dataList
    },

    handleBlurInputChange(event) {
      const { value } = event.target
      console.log('Hello 123', value)
      const isDupNameServiceHobby = this.handleDuplicateNameServiceHobby(value)
      if (isDupNameServiceHobby) {
        // Thông báo lỗi
        this.objDialog = {
          titleDialog: this.$ResourceDialogNotification.titleDialog,
          contentDialog: 'Dữ liệu vừa nhập đã tồn tại trong danh sở thích đã chọn.',
          iconContent: {
            name: 'ph:question-fill',
            color: '#0072bc'
          },
          // typeHandle: this.$TypeBtnDialogEnum.TypeHandleTask.deleteElement,
          isBtnHave: false,
          isBtnNo: false,
          isBtnCancel: false,
          isBtnAgree: true
        }
        // 2. Mở dialog form
        this.isDialogNotification = true
        // Thực hiện xóa dòng trùng lặp tên
        this.handleRemoveLineServiceHobby()
      } else {
        this.handleChangeInput(event)
      }
    },

    /**
     * @param {*} index - Chỉ số dòng hiện tại
     * - Lấy chỉ số dòng hiện tại (đang nhấn vào)
     * - Author: DDKhang (22/6/2023)
     */
    handleGetIndexLine(index) {
      this.selectIndexLine = index
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

    handleDuplicateNameServiceHobby(nameServiceHobby, typeChooseRecordeCb) {
      const serviceHobbes = this.dataListServiceHobby.filter(
        (sh) => sh.ServiceHobbyName === nameServiceHobby
      )
      if (typeChooseRecordeCb && typeChooseRecordeCb === 'typeChooseRecordCb') {
        if (serviceHobbes.length >= 1) {
          return true
        }
      } else {
        if (serviceHobbes.length >= 2) {
          return true
        }
      }
      return false
    },

    /**
     * - Thực hiện xử lí chọn option của combobox
     * - Author: DDKhang (3/7/2023)
     */
    handleChooseRecordCombobox(item, index) {
      console.log('Item: ', item)
      const { ServiceHobbyName, MoreMoney } = item
      // let isDupNameServiceHobby = false
      // if (ServiceHobbyName) {
      //   isDupNameServiceHobby = this.handleDuplicateNameServiceHobby(
      //     ServiceHobbyName,
      //     'typeChooseRecordCb'
      //   )
      // }

      // if (isDupNameServiceHobby) {
      //   // Thông báo lỗi
      //   this.objDialog = {
      //     titleDialog: this.$ResourceDialogNotification.titleDialog,
      //     contentDialog: 'Dữ liệu vừa nhập đã tồn tại trong danh sở thích đã chọn.',
      //     iconContent: {
      //       name: 'ph:question-fill',
      //       color: '#0072bc'
      //     },
      //     typeHandle: this.$TypeBtnDialogEnum.TypeHandleTask.validateDuplicateNameChooseRecord,
      //     isBtnHave: false,
      //     isBtnNo: false,
      //     isBtnCancel: false,
      //     isBtnAgree: true
      //   }
      //   // 2. Mở dialog form
      //   this.isDialogNotification = true
      // } else {
      const dataList = [...this.dataListServiceHobby]
      // if (id) {
      //   dataList[index]['ServiceHobbyId'] = id
      // }
      dataList[index]['ServiceHobbyName'] = ServiceHobbyName
      dataList[index]['MoreMoney'] = MoreMoney + '' // Chuyển "Thêm tiền" thành string để đồng nhất vs dữ liệu thay đổi

      // if (dataList[index]?.ServiceHobbyId) {
      //   // eslint-disable-next-line no-unused-vars
      //   const { ServiceHobbyId, ...newData } = dataList[index]
      //   dataList[index] = newData
      // }
      this.dataListServiceHobby = dataList
      // }
    },

    handleChangeInputValue(value) {
      this.foodChild.ServiceHobbyName = value
    },

    async handleChooseBtnPanelOnDialog(typeBtn) {
      switch (typeBtn) {
        case this.$TypeBtnDialogEnum.Have:
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.No:
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.Cancel:
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.Agree:
          if (
            this.objDialog.typeHandle ===
              this.$TypeBtnDialogEnum.TypeHandleTask.validateDuplicateNameBlurInput ||
            this.objDialog.typeHandle ===
              this.$TypeBtnDialogEnum.TypeHandleTask.validateDuplicateNameChooseRecord
          ) {
            // Thực hiện xóa dòng trùng lặp tên
            this.handleRemoveLineServiceHobby()
          }

          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
      }
    },

    handleBlurInputRecordItem(value) {
      let isDupNameServiceHobby = false
      if (value.trim() !== '') {
        isDupNameServiceHobby = this.handleDuplicateNameServiceHobby(value)
      }

      if (isDupNameServiceHobby) {
        // Thông báo lỗi
        this.objDialog = {
          titleDialog: this.$ResourceDialogNotification.titleDialog,
          contentDialog: 'Dữ liệu vừa nhập đã tồn tại trong danh sở thích đã chọn 123.',
          iconContent: {
            name: 'ph:question-fill',
            color: '#0072bc'
          },
          typeHandle: this.$TypeBtnDialogEnum.TypeHandleTask.validateDuplicateNameBlurInput,
          isBtnHave: false,
          isBtnNo: false,
          isBtnCancel: false,
          isBtnAgree: true
        }
        // 2. Mở dialog form
        this.isDialogNotification = true
      } else {
        // const serviceHobbes = this.foodChild.ServiceHobbes.map((sh) => {
        //   if (sh.ServiceHobbyId) {
        //     return sh
        //   }
        // })
        // this.foodChild.ServiceHobbes = serviceHobbes
      }
    }
  }
}
</script>

<template>
  <MISADialog
    v-if="this.isDialogNotification"
    :objDialog="this.objDialog"
    :handleChooseBtnPanelOnDialog="handleChooseBtnPanelOnDialog"
  >
  </MISADialog>

  <div class="formService">
    <!-- Ghi chú & giải thích cách thêm sở thích -->
    <div class="formService__info-attention">
      <p class="formService__info-attention-food">Món ăn:</p>
      <div class="formService__info-attention-serviceHobby">
        <Icon icon="material-symbols:info-outline" color="#0072bc" width="35" height="35" />
        <div class="formService__info-attention-serviceHobby-content">
          <p class="formService__info-attention-serviceHobby-desc">
            Ghi chú lại các sở thích của khách hàng giúp nhân viên phục vụ chọn nhanh order
          </p>
          <p class="formService__info-attention-serviceHobby-example">
            VD: không cay/ít hành/thêm phomai...
          </p>
        </div>
      </div>
    </div>
    <div class="formService__list-serviceByHobby">
      <!-- Tiêu đề bảng thông tin sở thích -->
      <div class="formService__list-serviceByHobby-thead h-28 border-bottom">
        <div
          class="formService__list-serviceByHobby-thead-column-serviceHobby w-1-2 text-center border-right"
        >
          Sở thích dịch vụ
        </div>
        <div class="formService__list-serviceByHobby-thead-column-moreMoney w-1-2 text-center">
          Thu thêm
        </div>
      </div>

      <!-- Nội dung bảng sở thích  -->
      <div class="formService__list-serviceByHobby-tbody">
        <div
          class="formService__list-serviceByHobby-tbody-item"
          v-for="(itemServiceHobby, index) in dataListServiceHobby"
          :key="index"
          @click="handleGetIndexLine(index)"
        >
          <div
            class="formItem-value formService__list-serviceByHobby-tbody-item-col-one border-right"
          >
            <!-- <input
              type="text"
              name="ServiceHobbyName"
              :value="itemServiceHobby.ServiceHobbyName"
              @input="(event) => handleChangeInput(event, index)"
              class="input"
              autocomplete="off"
            /> -->
            <MISAComboboxTable
              ref="comboboxTableRef"
              @input="handleChangeInput($event, index)"
              :handle-choose-record-item="handleChooseRecordCombobox"
              name="ServiceHobbyName"
              :index="index"
              :value-tranfer="itemServiceHobby.ServiceHobbyName"
              :list-item-value="this.handleConvertFormatDataCbTable()"
              @focus="$event.target.select()"
            />
          </div>
          <div class="formItem-value formService__list-serviceByHobby-tbody-item-col-two">
            <input
              type="text"
              style="text-align: end"
              name="MoreMoney"
              :value="handleFormatNumberPrice(itemServiceHobby.MoreMoney)"
              @keydown="restrictNonNumeric"
              @input="(event) => handleChangeInput(event, index)"
              @focus="$event.target.select()"
              class="input"
              autocomplete="off"
            />

            <!-- <MISAInput
              type="number"
              style="text-align: end"
              name="MoreMoney"
              :model-value="this.handleFormatNumberPrice(itemServiceHobby.MoreMoney)"
              @keydown="restrictNonNumeric"
              @input="(event) => handleChangeInput(event, index)"
              @focus="$event.target.select()"
              class="input"
              autocomplete="off"
            /> -->
          </div>
        </div>
      </div>
    </div>
    <div class="formService__listBtn">
      <MISAButton class="formService__panelBtn button px-3 py-10" @click="handleAddLineServiceHobby"
        ><Icon icon="zondicons:add-solid" color="#0072bc" width="18" height="18" />
        <span>{{ this.$ResourceDialogForm.Button.btnAddLine }}</span>
      </MISAButton>
      <MISAButton
        :class="`formService__panelBtn button px-3 py-10 ${
          this.isDisableBtnRemoveLine ? 'disable-btn' : ''
        } }`"
        @click="handleRemoveLineServiceHobby"
      >
        <Icon icon="mingcute:close-fill" color="red" width="20" height="20" />
        <span>{{ this.$ResourceDialogForm.Button.btnRemoveLine }}</span>
      </MISAButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.formService {
  padding: 8px;
}

.formService__info-attention {
  display: flex;
  flex-direction: column;
  row-gap: 3px;
}

.formService__info-attention-food {
}

.formService__info-attention-serviceHobby {
  display: flex;
  column-gap: 5px;
}

.formService__info-attention-serviceHobby-content {
  font-style: italic;
}

.formService__info-attention-serviceHobby-desc {
}

.formService__info-attention-serviceHobby-example {
}

// ##### --- Xử lí thêm dòng dữ liệu --- Start --- #####
.formService__list-serviceByHobby {
  border: 1px solid var(--color-border-default);
  position: relative;
  height: var(--height-dialog-table-service);
  overflow: auto;
  margin-top: 10px;
}
.formService__list-serviceByHobby-thead {
  display: flex;
  background-color: var(--background-color-table-primary);
  position: sticky;
  top: 0;
  z-index: 3;
}

.formService__list-serviceByHobby-thead-column-serviceHobby {
}

.formService__list-serviceByHobby-thead-column-moreMoney {
}

.formService__list-serviceByHobby-tbody {
}

.formService__list-serviceByHobby-tbody-item {
  display: flex;
  border-top: 1px solid var(--color-border-default);
}
.formService__list-serviceByHobby-tbody-item:is(:first-child) {
  border-top: none;
}
.formService__list-serviceByHobby-tbody-item:is(:last-child) {
  border-bottom: 1px solid var(--color-border-default);
}
.formService__list-serviceByHobby-tbody-item:hover {
  background-color: var(--color-table-row-hover-primary);
}

.formService__list-serviceByHobby-tbody-item-col-one {
}

.formService__list-serviceByHobby-tbody-item-col-two {
}

// ##### --- Xử lí thêm dòng dữ liệu --- End --- #####

.formService__listBtn {
  display: flex;
  column-gap: 10px;
  margin-top: 10px;
}

.formService__panelBtn {
  display: flex;
  align-items: center;
  column-gap: 8px;
  height: 25px;
}

// Các tiện ích
.w-1-2 {
  width: 50%;
}

.text-center {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.text-height-center {
  display: flex;
  align-items: center;
}

.h-28 {
  height: 28px;
}

.border-right {
  border-right: 1px solid var(--color-border-default);
}
.border-bottom {
  border-bottom: 1px solid var(--color-border-default);
}

.formItem-value {
  // padding: 5px 10px;
  width: 50%;
}

.formItem-value input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  height: 28px;
}

.disable-btn {
  opacity: 0.3;
  background-color: var(--background-disable);
  border: 1px solid var(--color-border-default);
  pointer-events: none;
}

.input {
  padding: 3px 5px;
}
</style>
<!-- w-1-2 h-28 text-height-center border-right border-bottom -->
