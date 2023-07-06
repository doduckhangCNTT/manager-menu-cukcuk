<script>
import TheMain from './layouts/TheMain.vue'
import TheHeader from './layouts/TheHeader.vue'
import TheNavbar from './layouts/TheNavbar.vue'
import MISAToast from './components/MISAToast.vue'
import MISADialog from './components/MISADialog.vue'

export default {
  name: 'App',
  components: { TheMain, TheHeader, TheNavbar, MISAToast, MISADialog },
  data() {
    return {
      // ##### --- Biến khởi tạo dialog thông báo
      objDialog: {}, // Chứa các thuộc tính để thực hiện hiển thị | thao tác trên dialog thông báo
      isDialogNotification: false, // Trạng thái đóng mở dialog
      typePerform: {} // Kiểu thực hiện khi bấm nút trên dialog
    }
  },
  created() {
    this.$msemitter.on(this.$EmitterEnum.showToast, this.showToast)
    this.$msemitter.on(this.$EmitterEnum.showDialogNotification, this.handleDialog)
  },
  beforeUnmount() {
    this.$msemitter.off(this.$EmitterEnum.showToast, this.showToast)
    this.$msemitter.off(this.$EmitterEnum.showDialogNotification, this.handleDialog)
  },
  methods: {
    /**
     * - Des: Thực hiện hiển thị Toast
     * - Author: DDKhang (2/6/2023)
     */
    showToast(toastInfo, duration = 5000) {
      this.$refs.toast.showToast(toastInfo, duration)
    },
    // ##### --- Methods xử lí trên dialog thông báo --- Start #####
    /**
     *
     * @param {*} typeBtn - Kiểu button dialog
     * - Thực hiện xử lí tác vụ của từng loại button trên dialog
     * - Author: DDKhang (23/6/2023)
     */
    handleChooseBtnPanelOnDialog(typeBtn, typeHandle) {
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
          // Thực hiện đóng dialog thông báo:
          this.isDialogNotification = false
          break
        case this.$TypeBtnDialogEnum.Agree:
          if (typeHandle === this.$TypeBtnDialogEnum.TypeHandleTask.validateElement) {
            // this.handleBtnDelete()
            console.log('Hello')
          }
          // Thực hiện đóng dialog thông báo
          this.isDialogNotification = false
          break
      }
    },

    // ##### --- Methods xử lí chọn button để xử lí --- Start #####
    /**
     *
     * @param {*} lstContent - (Array) danh sách là nội dung muốn hiển thị lên dialog
     * - Author: DDKhang (3/7/2023)
     */
    handleDialog(lstContent) {
      // Cấu tạo câu thông báo
      let sentenceNotifi = ''
      lstContent.forEach((lc) => {
        sentenceNotifi += lc.toString() + ' '
      })

      // Thực hiện thông báo hỏi xác nhận xóa
      // 1. Tạo dialog thông báo hỏi
      this.objDialog = {
        titleDialog: this.$ResourceDialogNotification.titleDialog,
        contentDialog: sentenceNotifi,
        iconContent: {
          name: 'ion:warning',
          color: 'yellow'
        },
        typeHandle: this.$TypeBtnDialogEnum.TypeHandleTask.validateElement,
        isBtnHave: false,
        isBtnNo: false,
        isBtnCancel: false,
        isBtnAgree: true
      }
      // 2. Mở dialog form
      this.isDialogNotification = true
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

  <MISAToast ref="toast"></MISAToast>
  <div class="program">
    <TheHeader />
    <div class="container">
      <TheNavbar />
      <TheMain />
    </div>
  </div>
</template>

<style scoped>
.program {
  height: 100vh;
}
.container {
  display: flex;
}
</style>
