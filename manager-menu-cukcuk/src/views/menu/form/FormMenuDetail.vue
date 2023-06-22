<script>
import { Icon } from '@iconify/vue'
export default {
  name: 'FormMenuDetail',
  components: { Icon }
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
          <input class="input" type="text" />
          <Icon icon="material-symbols:error" color="red" width="20" height="20" />
        </div>
      </div>
      <!-- Input Mã món -->
      <div class="formDetail-item formMenu__info-foodCode">
        <label for="" class="lb-item">
          <p>Mã món</p>
        </label>
        <div class="formMenu__info-input w-full">
          <input class="input" type="text" />
          <Icon icon="material-symbols:error" color="red" width="20" height="20" />
        </div>
      </div>
      <!-- Input Thứ tự món -->
      <div class="formDetail-item formMenu__info-foodOrder">
        <label for="" class="lb-item">
          <p>Thứ tự món</p>
        </label>
        <div class="formMenu__info-input w-full">
          <input class="input" type="text" />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Nhóm thực đơn -->
      <div class="formDetail-item formMenu__info-groupMenu">
        <label for="" class="lb-item">
          <p>Nhóm thực đơn</p>
        </label>
        <div class="formMenu__info-input w-full">
          <input class="input" type="text" />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Đơn vị tính -->
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
          <input class="input" type="text" />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Giá vốn -->
      <div class="formDetail-item formMenu__info-initialPrice">
        <label for="" class="lb-item">
          <p>Giá vốn</p>
        </label>
        <div class="formMenu__info-input w-full">
          <input class="input" type="text" />
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Mô tả -->
      <div class="formDetail-item formMenu__info-description align-item-start">
        <label for="" class="lb-item align-item-start">
          <p>Mô tả</p>
        </label>
        <div class="formMenu__info-input w-full">
          <textarea id="" class="input formMenu__info-input-desc" name="" rows="4"></textarea>
          <!-- <Icon icon="material-symbols:error" color="red" width="20" height="20" /> -->
        </div>
      </div>
      <!-- Input Chế biến tại -->
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

    <div class="formMenu__image">Image</div>
  </div>
</template>

<style lang="scss" scoped>
.formMenu {
  display: flex;
  column-gap: 8px;
}

.formMenu__info {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 65%;
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
}

// Các tiện ích thêm
.w-full {
  width: 100%;
}

.align-item-start {
  align-items: flex-start;
}
</style>
