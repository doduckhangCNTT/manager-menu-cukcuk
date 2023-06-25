<script>
import TabWrapper from '../../components/TabWrapper.vue'
import TabItem from '../../components/TabItem.vue'
import MISAButton from '@/components/MISAButton.vue'
import FormMenuDetail from './form/FormMenuDetail.vue'
import { Icon } from '@iconify/vue'
import FormServiceHobby from './form/FormServiceHobby.vue'

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
      }
    }
  },
  methods: {
    /**
     * Chuyển hướng sang trang mà hình chính
     * - Author: DDKhang (23/6/2023)
     */
    handleRedirectHome() {
      this.$router.push('/menu')
    },

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
              ><FormMenuDetail
            /></TabItem>
            <TabItem tabId="tab2" :titleTab="this.$ResourceDialogForm.TitleTab.serviceHobby"
              ><FormServiceHobby
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
</style>
