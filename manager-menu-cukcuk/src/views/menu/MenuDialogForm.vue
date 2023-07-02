<script>
import TabWrapper from '../../components/TabWrapper.vue'
import TabItem from '../../components/TabItem.vue'
import MISAButton from '@/components/MISAButton.vue'
import FormMenuDetail from './form/FormMenuDetail.vue'
import { Icon } from '@iconify/vue'
import FormServiceHobby from './form/FormServiceHobby.vue'
import BaseUrl from '../../utils/BaseUrl'
import { postData, updateInfoEntity, getDataById } from '../../utils/FetchData'

export default {
  name: 'MenuDialogForm',
  components: {
    TabWrapper,
    TabItem,
    MISAButton,
    Icon,
    FormMenuDetail,
    FormServiceHobby
  },
  data() {
    return {
      food: {
        StopSelling: 0,
        ServiceHobbes: []
      },
      // Đối tượng dialgo thông báo/Hỏi/Cảnh báo
      objDialog: {
        titleDialog: 'CUKCUK-Quản lí nhà hàng',
        contentDialog: 'Nội dụng thông báo Nội dụng thông báoNội dụng thông báo',
        iconContent: {
          name: 'ph:question-fill',
          color: '#0072bc'
        },
        isBtnHave: true,
        isBtnNo: true,
        isBtnCancel: false,
        isBtnAgree: false
      },
      foodId: null
    }
  },
  async created() {
    this.foodId = this.$route.params.id
    await this.handleInitialDialog()
  },
  computed: {
    /**
     * Params:
     * Des:  Tính toán thêm hoặc cập nhật
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    behaviorHandle() {
      // if (this.employeeId && this.queryUrl.duplicate === "true") {
      //   return this.$BehaviorHandleEnum.Duplicate;
      // } else
      if (this.foodId) {
        return this.$BehaviorHandleEnum.Edit // Thực hiện Edit
      } else {
        return this.$BehaviorHandleEnum.AddNew // Thực hiện Create
      }
    }
  },
  methods: {
    async handleInitialDialog() {
      if (this.behaviorHandle === this.$BehaviorHandleEnum.AddNew) {
        console.log('Handle Initial Dialog Create')
      } else if (
        this.behaviorHandle === this.$BehaviorHandleEnum.Edit ||
        this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate
      ) {
        console.log('Handle Initial Dialog Update / Duplicate')
        if (this.foodId) {
          const res = await getDataById(this.$EntityNameEnum.Foods, { ids: this.foodId })
          console.log('Res: ', res)
          this.food = res.data[0]
        }
      }
    },

    /**
     * Chuyển hướng sang trang mà hình chính
     * - Author: DDKhang (23/6/2023)
     */
    handleRedirectHome() {
      this.$router.push('/menu')
    },

    /**
     *
     * @param {*} typeBtn - Kiểu button dialog
     * - Thực hiện xử lí tác vụ của từng loại button trên dialog
     * - Author: DDKhang (23/6/2023)
     */
    handleChooseBtnPanelOnDialog(typeBtn) {
      switch (typeBtn) {
        case this.$TypeBtnDialogEnum.Have:
          break
        case this.$TypeBtnDialogEnum.No:
          break
        case this.$TypeBtnDialogEnum.Cancel:
          break
        case this.$TypeBtnDialogEnum.Agree:
          break
      }
    },

    // ##### --- Methods xử lí thao tác trên form --- #####
    async handleSaveForm() {
      // Validate

      if (this.behaviorHandle === this.$BehaviorHandleEnum.AddNew) {
        const newFood = { ...this.food, StopSelling: this.food.StopSelling ? 1 : 0 }
        await postData(`${BaseUrl}/Foods`, newFood)

        // Thực hiện thông báo
        // 1. Thông tin thông báo
        const toastInfo = {
          status: this.$ResourceToast.AddEntity.AddSuccess.status,
          msg: this.$ResourceToast.AddEntity.AddSuccess.msg
        }
        // 2. Phát lên App.vue -> để hiển thị Toast
        this.$msemitter.emit(this.$EmitterEnum.showToast, toastInfo, 5000)
        this.$router.push('/menu')
      } else if (this.behaviorHandle === this.$BehaviorHandleEnum.Edit) {
        console.log('Edit')
        const newFood = { ...this.food, StopSelling: this.food.StopSelling ? 1 : 0 }
        await updateInfoEntity(this.$EntityNameEnum.Foods, newFood)
      }
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

  <div class="dialog-form-menu">
    <div class="dialog-form-menu__wrapper">
      <!-- Header form -->
      <div class="dialog-form-menu__wrapper-header">
        <div class="dialog-form-menu__wrapper-header-title">Thêm món</div>
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
              ><FormMenuDetail :foodValue="food" v-model:food="food"
            /></TabItem>
            <TabItem tabId="tab2" :titleTab="this.$ResourceDialogForm.TitleTab.serviceHobby"
              ><FormServiceHobby :foodValue="food" v-model:food="food"
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
              class="dialog-form-menu__wrapper-body-footer-btnHandle-save button px-3 py-10"
            >
              <Icon icon="ri:save-3-fill" color="#0072bc" width="20" height="20" />
              <span>{{ this.$ResourceDialogForm.Button.btnSave }}</span>
            </MISAButton>
            <MISAButton
              class="dialog-form-menu__wrapper-body-footer-btnHandle-save button px-3 py-10"
              ><Icon icon="mdi:content-save-plus" color="#0072bc" width="20" height="20" />
              <span>{{ this.$ResourceDialogForm.Button.btnSaveAdd }}</span>
            </MISAButton>
            <MISAButton
              class="dialog-form-menu__wrapper-body-footer-btnHandle-save button px-3 py-10"
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
