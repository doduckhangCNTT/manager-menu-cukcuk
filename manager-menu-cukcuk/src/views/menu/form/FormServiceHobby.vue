<script>
import MISAButton from '../../../components/MISAButton.vue'
import { Icon } from '@iconify/vue'
export default {
  name: 'FormServiceHobby',
  data() {
    return {}
  },
  methods: {},
  components: { MISAButton, Icon }
}
</script>

<template>
  <div class="formService">
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
        <div class="formService__list-serviceByHobby-tbody-item" v-for="i in 10" :key="i">
          <div
            class="formItem-value formService__list-serviceByHobby-tbody-item-col-one border-right"
          >
            Value 1
          </div>
          <div class="formItem-value formService__list-serviceByHobby-tbody-item-col-two">
            Value 2
          </div>
        </div>
      </div>
    </div>
    <div class="formService__listBtn">
      <MISAButton class="formService__panelBtn button px-3 py-10"
        ><Icon icon="zondicons:add-solid" color="#0072bc" width="18" height="18" />
        <span>{{ this.$ResourceDialogForm.Button.btnAddLine }}</span>
      </MISAButton>
      <MISAButton class="formService__panelBtn button px-3 py-10">
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
}
.formService__list-serviceByHobby-thead {
  display: flex;
  background-color: var(--background-color-table-primary);
  position: sticky;
  top: 0;
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
  padding: 5px 10px;
  width: 50%;
}
</style>
<!-- w-1-2 h-28 text-height-center border-right border-bottom -->
