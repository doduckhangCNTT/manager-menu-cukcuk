<script>
import TabWrapper from '../../components/TabWrapper.vue'
import TabItem from '../../components/TabItem.vue'
import MISAButton from '@/components/MISAButton.vue'
import FormMenuDetail from './form/FormMenuDetail.vue'
import { Icon } from '@iconify/vue'
import FormServiceHobby from './form/FormServiceHobby.vue'
import BaseUrl from '../../utils/BaseUrl'
import { updateInfoEntity, getDataById, postData, getNewCode } from '../../utils/FetchData'
// import { updateInfoEntity, getDataById } from '../../utils/FetchData'
// import { checkBlank } from '../../utils/functions/ValidateForm'
import MISADialog from '../../components/MISADialog.vue'

export default {
  name: 'MenuDialogForm',
  components: {
    TabWrapper,
    TabItem,
    MISAButton,
    Icon,
    FormMenuDetail,
    FormServiceHobby,
    MISADialog
  },
  data() {
    return {
      food: {
        StopSelling: 0,
        ShowOnMenu: 0,
        Price: '0',
        InitialPrice: '0',
        ServiceHobbes: []
      },
      // Đối tượng dialgo thông báo/Hỏi/Cảnh báo
      objDialog: {},
      foodId: null,
      isCheckBlankInput: true, // Trạng thái lỗi của thẻ input required
      isDialogNotification: false, // Trạng thái đóng mở dialog
      foodBeforeUpdate: {} // Gía trị nhân viên trước khi cập nhật
    }
  },
  async created() {
    this.foodId = this.$route.params.id
    this.queryUrl = this.$route.query
    await this.handleInitialDialog()
    // Nhận từ FormMenuDetail
    this.$msemitter.on(this.$EmitterEnum.statusCheckBlankInput, this.statusCheckBlankInput)
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
    },

    /**
     * - Xử lí hiển thị tiêu đề cho form
     * - Author: DDKhang (3/6/2023)
     */
    titleDialog() {
      switch (this.behaviorHandle) {
        case this.$BehaviorHandleEnum.AddNew:
          return this.$ResourceDialogForm.TitleForm.Food.addFood
        case this.$BehaviorHandleEnum.Edit:
          return this.$ResourceDialogForm.TitleForm.Food.editFood
        case this.$BehaviorHandleEnum.Duplicate:
          return this.$ResourceDialogForm.TitleForm.Food.addFood
        default:
          return ''
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    this.$msemitter.off(this.$EmitterEnum.statusCheckBlankInput, this.statusCheckBlankInput)
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    onResize(event) {
      // Cập nhật kích thước của form khi thay đổi kích thước
      this.formWidth = event.width
      this.formHeight = event.height
    },
    /**
     *
     * @param {*} status - Trạng thái của việc kiểm tra rỗng trên các thẻ input
     * - Author: DDKhang (3/7/2023)
     */
    statusCheckBlankInput(status) {
      this.isCheckBlankInput = status
    },

    /**
     * - Xử lí khởi tạo giá trị cho form dialog khi mới vào form
     * - Author: DDKhang (23/6/2023)
     */
    async handleInitialDialog() {
      if (this.behaviorHandle === this.$BehaviorHandleEnum.AddNew) {
        console.log('Handle Initial Dialog Create')
      } else if (this.behaviorHandle === this.$BehaviorHandleEnum.Edit) {
        console.log('Handle Initial Dialog Update / Duplicate')
        if (this.foodId) {
          const res = await getDataById(this.$EntityNameEnum.Foods, { ids: this.foodId })
          const foodItem = res.data[0]
          if (!foodItem.Price) foodItem.Price = '0'
          if (!foodItem.InitialPrice) foodItem.InitialPrice = '0'

          // Lưu giữ giá trị ban đầu -> close Form
          this.foodBeforeUpdate = JSON.stringify(foodItem)
          this.food = foodItem
        }
      } else if (this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate) {
        if (this.foodId) {
          const res = await getDataById(this.$EntityNameEnum.Foods, { ids: this.foodId })
          // Lưu giữ giá trị ban đầu -> close Form
          this.foodBeforeUpdate = JSON.stringify(res.data[0])
          this.food = res.data[0]

          // Thực hiện tạo mã món ăn
          const value = res.data[0]
          // Lấy các chữ cái đầu của tên món ăn
          let code = ''
          const words = value.FoodName?.split(/\s+/)
          words.forEach(
            (w) =>
              (code += w[0]
                ?.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ|Đ/, 'd'))
          )

          const newFoodCode = await getNewCode(this.$EntityNameEnum.Foods, code)
          this.food.FoodCode = newFoodCode?.data
        }
      }
    },

    /**
     * Chuyển hướng sang trang mà hình chính
     * - Author: DDKhang (23/6/2023)
     */
    handleRedirectHome() {
      let flagEmpty = false // Mặc định ban đầu không có thay đổi dữ liêu

      switch (this.behaviorHandle) {
        case this.$BehaviorHandleEnum.Edit:
          // Kiểm tra sự thay đổi trên form sửa
          // 1. Lấy toàn bộ key của đối tượng  cập nhật trước đó
          // eslint-disable-next-line no-case-declarations
          const keysFoodOld = Object.keys(JSON.parse(this.foodBeforeUpdate))
          // 2. Thực hiện kiểm tra đối tượng trước và sau khi thay đổi
          for (let key = 0; key < keysFoodOld.length; key++) {
            const keyEntity = keysFoodOld[key]
            if (
              (JSON.stringify(this.food[keyEntity]) === false
                ? 0
                : JSON.stringify(this.food[keyEntity])) !==
              JSON.stringify(JSON.parse(this.foodBeforeUpdate)[keyEntity])
            ) {
              flagEmpty = true
              break
            }
          }
          if (flagEmpty) {
            flagEmpty = true
          }
          break
        case this.$BehaviorHandleEnum.AddNew:
          // eslint-disable-next-line no-case-declarations
          const noCheckEmpty = ['StopSelling', 'ShowOnMenu']
          // eslint-disable-next-line no-case-declarations
          const keysFood = Object.keys(this.food)
          // Kiểm tra có sự thay đổi trên form create
          if (noCheckEmpty.filter((item) => this.food[item] != 0).length > 0) {
            flagEmpty = true
          }
          keysFood.forEach((key) => {
            if (key === 'ServiceHobbes') {
              if (this.food[key].length > 0) {
                flagEmpty = true
              }
            } else if (key === 'Price' || key === 'InitialPrice') {
              if (this.food[key] === 0) {
                flagEmpty = false
              }
            } else if (!noCheckEmpty.includes(key)) {
              if (this.food[key]?.trim() !== '') {
                flagEmpty = true
                return
              }
            }
          })
          break
      }

      if (flagEmpty) {
        // Thực hiện thông báo hỏi xác nhận xóa
        // 1. Tạo dialog thông báo hỏi
        this.objDialog = {
          titleDialog: this.$ResourceDialogNotification.titleDialog,
          contentDialog: 'Dữ liệu đã thay đổi, bạn có muốn cất không?',
          iconContent: {
            name: 'ph:question-fill',
            color: '#0072bc'
          },
          typeHandle: this.$TypeBtnDialogEnum.TypeHandleTask.deleteElement,
          isBtnHave: true,
          isBtnNo: true,
          isBtnCancel: true,
          isBtnAgree: false
        }
        // 2. Mở dialog form
        this.isDialogNotification = true
      } else {
        console.log('Not change')
        this.$router.push('/menu?page=1&limit=30')
        // this.$router.go(-1)
      }
    },

    /**
     *
     * @param {*} typeBtn - Kiểu button dialog
     * - Thực hiện xử lí tác vụ của từng loại button trên dialog
     * - Author: DDKhang (23/6/2023)
     */
    async handleChooseBtnPanelOnDialog(typeBtn) {
      switch (typeBtn) {
        case this.$TypeBtnDialogEnum.Have:
          await this.handleSaveForm()
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.No:
          this.$router.push('/menu?page=1&limit=30')
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.Cancel:
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.Agree:
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
      }
    },

    // ##### --- Methods xử lí thao tác trên form --- #####
    async handleSaveForm() {
      // Phát lên FormMenuDetail.vue - Mục đích là kiểm các thẻ input [required] đã được cung cấp giá trị hay chưa
      this.$msemitter.emit(this.$EmitterEnum.showValidateInput)

      if (!this.isCheckBlankInput) {
        if (
          this.behaviorHandle === this.$BehaviorHandleEnum.AddNew ||
          this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate
        ) {
          let newFood = {
            ...this.food,
            StopSelling: this.food.StopSelling ? 1 : 0,
            ShowOnMenu: this.food.ShowOnMenu ? 1 : 0
          }

          // Thực hiện lọc bỏ các giá trị sở thích rỗng
          const filterEmptyServiceHobbes = newFood.ServiceHobbes?.map((sh) => {
            if (sh.ServiceHobbyName.trim() !== '' || sh.MoreMoney.trim() !== '') {
              return sh
            }
          }).filter(Boolean) // Filter sẽ chỉ giữ những giá trị true
          newFood = { ...newFood, ServiceHobbes: filterEmptyServiceHobbes }

          let formData = new FormData()
          // formData.append('ImageFile', file)
          console.log('NewFood: ', newFood)
          for (let key in newFood) {
            if (key !== 'ServiceHobbes') {
              if (newFood[key] !== null) {
                formData.append(key, newFood[key])
              }
            }
          }
          if (newFood.ServiceHobbes) {
            // Thực hiện thêm trường ServiceHobbes và các giá trị vào FormData
            for (let i = 0; i < newFood.ServiceHobbes?.length; i++) {
              formData.append(
                `ServiceHobbes[${i}].ServiceHobbyName`,
                newFood.ServiceHobbes[i].ServiceHobbyName
              )
              formData.append(`ServiceHobbes[${i}].MoreMoney`, newFood.ServiceHobbes[i].MoreMoney)
            }
          }
          // for (let pair of formData.entries()) {
          //   console.log(pair[0], pair[1])
          // }
          const res = await postData(`${BaseUrl}/Foods`, formData)
          console.log('Res post: ', res)

          if (res.status === this.$HttpStatusCodeEnum.Success) {
            // Thực hiện thông báo
            // 1. Thông tin thông báo
            const toastInfo = {
              status: this.$ResourceToast.AddEntity.AddSuccess.status,
              msg: this.$ResourceToast.AddEntity.AddSuccess.msg
            }
            // 2. Phát lên App.vue -> để hiển thị Toast
            this.$msemitter.emit(this.$EmitterEnum.showToast, toastInfo, 5000)
          }
          // Thực hiện tải lại dữ liệu
          // Phát lên MenuListView
          // this.$msemitter.emit(this.$EmitterEnum.refreshPage)
          this.$router.push('/menu?page=1&limit=30')
          // this.$router.go(-1)
        } else if (this.behaviorHandle === this.$BehaviorHandleEnum.Edit) {
          console.log('Edit')
          let newFood = {
            ...this.food,
            StopSelling: this.food.StopSelling ? 1 : 0,
            ShowOnMenu: this.food.ShowOnMenu ? 1 : 0
          }

          // Thực hiện lọc bỏ các giá trị sở thích rỗng
          const filterEmptyServiceHobbes = newFood.ServiceHobbes?.map((sh) => {
            if (sh.ServiceHobbyName.trim() !== '' || sh.MoreMoney.trim() !== '') {
              return sh
            }
          }).filter(Boolean) // Filter sẽ chỉ giữ những giá trị true
          newFood = { ...newFood, ServiceHobbes: filterEmptyServiceHobbes }

          let formData = new FormData()
          // formData.append('ImageFile', file)
          console.log('NewFood: ', newFood)
          const arrPropertyTypeObject = ['ServiceHobbes', 'FoodServiceHobby']

          for (let key in newFood) {
            if (!arrPropertyTypeObject.includes(key)) {
              if (newFood[key] != null) {
                formData.append(key, newFood[key])
              }
            }
          }
          // Thực hiện thêm trường ServiceHobbes và các giá trị vào FormData
          for (let i = 0; i < newFood.ServiceHobbes?.length; i++) {
            formData.append(
              `ServiceHobbes[${i}].ServiceHobbyName`,
              newFood.ServiceHobbes[i].ServiceHobbyName
            )
            formData.append(
              `ServiceHobbes[${i}].MoreMoney`,
              newFood.ServiceHobbes[i].MoreMoney ? newFood.ServiceHobbes[i].MoreMoney : ''
            )
          }
          // Thực hiện thêm trường ServiceHobbes và các giá trị vào FormData
          for (let i = 0; i < newFood.FoodServiceHobby.length; i++) {
            formData.append(`FoodServiceHobby[${i}].FoodId`, newFood.FoodServiceHobby[i].FoodId)
            formData.append(
              `FoodServiceHobby[${i}].ServiceHobbyId`,
              newFood.FoodServiceHobby[i].ServiceHobbyId
            )
          }

          const res = await updateInfoEntity(this.$EntityNameEnum.Foods, formData)
          if (res.status === this.$HttpStatusCodeEnum.Success) {
            // Thực hiện thông báo
            // 1. Thông tin thông báo
            const toastInfo = {
              status: this.$ResourceToast.UpdateEntity.UpdateSuccess.status,
              msg: this.$ResourceToast.UpdateEntity.UpdateSuccess.msg
            }
            // 2. Phát lên App.vue -> để hiển thị Toast
            this.$msemitter.emit(this.$EmitterEnum.showToast, toastInfo, 5000)
            this.$router.go(-1)
          }
        }
      }
    },

    /**
     * - Thực hiện xử lí khi lưu và thêm
     * - Author: DDKhang (3/7/2023)
     */
    async handleSaveAdd() {
      await this.handleSaveForm()
      // await getNewCode(this.$EntityNameEnum.Foods, 'abc')

      setTimeout(() => {
        // Mở lại form thêm thông tin
        if (
          this.behaviorHandle === this.$BehaviorHandleEnum.AddNew ||
          this.behaviorHandle === this.$BehaviorHandleEnum.Edit
        ) {
          this.$router.push('/menu/create')
        } else if (this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate) {
          // this.$router.push(`/employee/${this.employeeId}?duplicate=true`);
          this.$router.push(`/menu/create?type=duplicate`)
        }
      }, 100)
    },

    /**
     * @param {*} event - Sự kiên
     * - Des: Thực hiện nhấn phím tắt
     * - Author: DDKhang
     * - CreateAt: 11/5/2023
     * - ModifierAt: 11/5/2023
     */
    handleKeyDown(event) {
      if (event.key === this.$ResourceShortCut.CloseForm.char) {
        event.preventDefault() // Ngăn chặn hành động mặc định của trình duyệt
        // Thực hiện nhấn phím đóng Form
        this.handleBtnCancel()
      } else if (
        event.ctrlKey &&
        event.altKey &&
        event.key === this.$ResourceShortCut.BtnSaveAdd.char
      ) {
        event.preventDefault() // Ngăn chặn hành động mặc định của trình duyệt
        // Không bắt sự kiến key trên form Edit
        this.handleSaveAdd()
      } else if (event.ctrlKey && event.key === this.$ResourceShortCut.BtnSave.char) {
        event.preventDefault() // Ngăn chặn hành động mặc định của trình duyệt
        // Thực hiện nhấn phím tắt nút Save
        this.handleSaveForm()
      }
    },

    /**
     * - Thực hiện đóng form và chuyển về trang trước đó
     * - Author: DDKhang (3/7/2023)
     */
    handleBtnCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<template>
  <!-- <MISADialog
    :objDialog="this.objDialog"
    :handleChooseBtnPanelOnDialog="handleChooseBtnPanelOnDialog"
  >
  </MISADialog> -->
  <MISADialog
    v-if="this.isDialogNotification"
    :objDialog="this.objDialog"
    :handleChooseBtnPanelOnDialog="handleChooseBtnPanelOnDialog"
  >
  </MISADialog>

  <div class="dialog-form-menu">
    <div class="dialog-form-menu__wrapper">
      <!-- Header form -->
      <div class="dialog-form-menu__wrapper-header">
        <div class="dialog-form-menu__wrapper-header-title">{{ titleDialog }}</div>
        <!-- Icon đóng form -->
        <div class="dialog-form-menu__wrapper-header-iconClose" @click="handleRedirectHome">
          <Icon icon="carbon:close-filled" color="white" width="24" height="24" />
        </div>
      </div>
      <!-- Nội dung form -->
      <div class="dialog-form-menu__wrapper-body">
        <!-- Xử lí tab -->
        <div class="dialog-form-menu__wrapper-body-details">
          <TabWrapper class="dialog-form-menu__wrapper-body-details-tabs">
            <TabItem tabId="tab1" :titleTab="this.$ResourceDialogForm.TitleTab.commonInfo"
              ><FormMenuDetail v-model:food="food"
            /></TabItem>
            <TabItem tabId="tab2" :titleTab="this.$ResourceDialogForm.TitleTab.serviceHobby"
              ><FormServiceHobby v-model:food="food"
            /></TabItem>
            <TabItem
              tabId="tab3"
              :titleTab="this.$ResourceDialogForm.TitleTab.materialQuantification"
              >{{ this.$ResourceDialogForm.TitleTab.noContent }}</TabItem
            >
            <TabItem tabId="tab4" :titleTab="this.$ResourceDialogForm.TitleTab.pricePolicy">{{
              this.$ResourceDialogForm.TitleTab.noContent
            }}</TabItem>
          </TabWrapper>
        </div>
        <div class="dialog-form-menu__wrapper-body-footer">
          <div class="dialog-form-menu__wrapper-body-footer-btnHelp">
            <MISAButton
              class="dialog-form-menu__wrapper-body-footer-btnHandle-save button px-3 py-10"
              ><Icon icon="ri:question-fill" color="#0072bc" width="20" height="20" />
              <span>{{ this.$ResourceDialogForm.Button.btnHelp }}</span>
            </MISAButton>
          </div>
          <div class="dialog-form-menu__wrapper-body-footer-btnHandle">
            <MISAButton
              @click="handleSaveForm"
              :title="this.$ResourceShortCut.BtnSave.tooltip"
              class="dialog-form-menu__wrapper-body-footer-btnHandle-save button px-3 py-10"
              :tabindex="this.$TabIndexEnum.formFoodInfo.btnSave"
            >
              <Icon icon="ri:save-3-fill" color="#0072bc" width="20" height="20" />
              <span>{{ this.$ResourceDialogForm.Button.btnSave }}</span>
            </MISAButton>
            <MISAButton
              class="dialog-form-menu__wrapper-body-footer-btnHandle-save button px-3 py-10"
              :title="this.$ResourceShortCut.BtnSaveAdd.tooltip"
              :tabindex="this.$TabIndexEnum.formFoodInfo.btnSaveAdd"
              @click="handleSaveAdd"
              ><Icon icon="mdi:content-save-plus" color="#0072bc" width="20" height="20" />
              <span>{{ this.$ResourceDialogForm.Button.btnSaveAdd }}</span>
            </MISAButton>
            <MISAButton
              @click="handleBtnCancel"
              class="dialog-form-menu__wrapper-body-footer-btnHandle-save button px-3 py-10"
              :tabindex="this.$TabIndexEnum.formFoodInfo.btnDelete"
            >
              <Icon icon="fontisto:ban" color="red" width="16" height="16" />
              <span>{{ this.$ResourceDialogForm.Button.btnDelete }}</span>
            </MISAButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog-form-menu {
  position: fixed;
  z-index: var(--zIndex-dialog-form-info);
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.322);
}

.dialog-form-menu__wrapper {
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: var(--border-radius-primary);
  overflow: hidden;
  background-color: var(--background-color-dialog-form);
  width: var(--width-dialogForm);
  padding: 5px;
  height: 673px;
}

.dialog-form-menu__wrapper-header {
  display: flex;
  justify-content: space-between;
  height: var(--height-header-dialogForm);
  color: var(--color-text-white);
}

.dialog-form-menu__wrapper-header-title {
  line-height: 21px;
  margin-left: 5px;
}

.dialog-form-menu__wrapper-header-iconClose:hover {
  cursor: pointer;
  opacity: 0.9;
}

.dialog-form-menu__wrapper-body {
  background-color: var(--background-color-dialog-form-wrapper-body);
  padding: 8px;
  height: calc(100% - var(--height-header-dialogForm));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dialog-form-menu__wrapper-body-details {
}

.dialog-form-menu__wrapper-body-details-tabs {
}
//  ##### --- Xử lí Footer --- #####
.dialog-form-menu__wrapper-body-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.dialog-form-menu__wrapper-body-footer-btnHelp {
}

.dialog-form-menu__wrapper-body-footer-btnHandle {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.dialog-form-menu__wrapper-body-footer-btnHandle-save {
  display: flex;
  align-items: center;
  column-gap: 5px;
  height: 25px;
}

// Các tiện ích thêm
</style>
