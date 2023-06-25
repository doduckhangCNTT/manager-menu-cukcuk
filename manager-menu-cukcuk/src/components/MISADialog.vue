<script>
import MISAButton from './MISAButton.vue'
import { Icon } from '@iconify/vue'
export default {
  name: 'MISADialog',
  props: {
    objDialog: {
      type: Object
    },
    handleChooseBtnPanelOnDialog: {
      type: Function
    }
  },
  components: { MISAButton, Icon },
  data() {
    return {}
  },
  methods: {
    handleChooseBtnPanel(typeBtn) {
      this.handleChooseBtnPanelOnDialog(typeBtn)
    }
  }
}
</script>

<template>
  <div class="dialog">
    <div class="dialog-info">
      <div class="dialog-info__header">{{ this.objDialog?.titleDialog }}</div>
      <div class="dialog-info__body">
        <div class="dialog-info__body-content">
          <div class="dialog-info__body-content-icon">
            <Icon
              :icon="this.objDialog?.iconContent.name"
              :color="this.objDialog?.iconContent.color"
              width="35"
              height="35"
            />
          </div>
          <div class="dialog-info__body-content-notification">
            {{ this.objDialog?.contentDialog }}
          </div>
        </div>
        <div class="dialog-info__body-btn-panel">
          <MISAButton
            v-if="this.objDialog?.isBtnHave"
            @click="handleChooseBtnPanel(this.$TypeBtnDialogEnum.Have)"
            class="button px-3 py-10"
          >
            <span>Có</span>
          </MISAButton>
          <MISAButton
            v-if="this.objDialog?.isBtnNo"
            @click="handleChooseBtnPanel(this.$TypeBtnDialogEnum.No)"
            class="button px-3 py-10"
          >
            <span>Không</span>
          </MISAButton>
          <MISAButton
            v-if="this.objDialog?.isBtnCancel"
            @click="handleChooseBtnPanel(this.$TypeBtnDialogEnum.Cancel)"
            class="button px-3 py-10"
          >
            <span>Hủy bỏ</span>
          </MISAButton>
          <MISAButton
            v-if="this.objDialog?.isBtnAgree"
            @click="handleChooseBtnPanel(this.$TypeBtnDialogEnum.Agree)"
            class="button px-3 py-10"
          >
            <span>Đồng ý</span>
          </MISAButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  z-index: var(--zIndex-dialog-notification);
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.322);
}

.dialog-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: var(--zIndex-dialog-notification);
  border-radius: var(--border-radius-primary);
  width: 400px;
  background-color: var(--background-color-dialog-form);
}

.dialog-info__header {
  height: 29px;
  padding: 4px;
  color: #fff;
}

.dialog-info__body {
  margin: 0 4px 4px 4px;
  background-color: var(--background-color-dialog-notification-body);
  border-radius: var(--border-radius-primary);
}

.dialog-info__body-content {
  display: flex;
  column-gap: 5px;
  padding: 10px;
  align-items: center;
}

.dialog-body-content-icon {
}

.dialog-info__body-content-notification {
}

.dialog-info__body-btn-panel {
  display: flex;
  column-gap: 5px;
  justify-content: flex-end;
  padding: 6px;
  margin-top: 10px;
}

// Các tiện ích thêm
.button {
  width: 76px;
}
</style>
