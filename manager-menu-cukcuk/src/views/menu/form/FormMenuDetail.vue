<script>
import { Icon } from '@iconify/vue'
import MISAInput from '../../../components/MISAInput.vue'

import MISACombobox from '../../../components/MISACombobox.vue'
import MISAButton from '../../../components/MISAButton.vue'

export default {
  name: 'FormMenuDetail',
  components: { Icon, MISAInput, MISACombobox, MISAButton },
  data() {
    return {
      optionsNumberRecord: [
        {
          id: 1,
          value: 10
        },
        {
          id: 2,
          value: 15
        },
        {
          id: 3,
          value: 20
        },
        {
          id: 4,
          value: 30
        },
        {
          id: 5,
          value: 40
        },
        {
          id: 6,
          value: 50
        },
        {
          id: 7,
          value: 60
        },
        {
          id: 8,
          value: 70
        },
        {
          id: 9,
          value: 80
        }
      ]
    }
  },
  methods: {
    handleCustomClassGroupMenuCombobox() {
      return {
        borderLeftNone: 'border-left--none',
        backgroundWhite: 'backgroundColor--white',
        widthInput: 'width-full'
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
        <div class="formMenu__info-input w-full">
          <MISAInput />
          <Icon icon="material-symbols:error" color="red" width="20" height="20" />
        </div>
      </div>
      <!-- Input Mã món -->
      <div class="formDetail-item formMenu__info-foodCode">
        <label for="" class="lb-item">
          <p>Mã món</p>
        </label>
        <div class="formMenu__info-input w-full">
          <MISAInput />
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
            :customClass="handleCustomClassGroupMenuCombobox()"
            :listItemValue="this.optionsNumberRecord"
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
          <input class="input" type="text" />
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
          <MISAInput class="w-1-2" />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Giá vốn -->
      <div class="formDetail-item formMenu__info-initialPrice">
        <label for="" class="lb-item">
          <p>Giá vốn</p>
        </label>
        <div class="formMenu__info-input w-full">
          <MISAInput class="w-1-2" />
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
          <input class="input" type="text" />
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
            <input class="input" type="checkbox" />
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

// Các tiện ích thêm
.w-full {
  width: 100%;
}

.align-item-start {
  align-items: flex-start;
}
</style>
