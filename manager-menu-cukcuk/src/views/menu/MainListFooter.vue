<script>
import MISAButton from '../../components/MISAButton.vue'
import { Icon } from '@iconify/vue'
import MISATooltip from '../../components/MISATooltip.vue'
export default {
  name: 'MainListFooter',
  components: { MISAButton, Icon, MISATooltip }
}
</script>

<template>
  <footer class="footer">
    <div class="footer-panel">
      <!-- Arrow Previous -->
      <div class="footer-panel__arrows footer-panel__arrow-previous">
        <div class="footer-panel__arrow-previous-firstPage">
          <MISATooltip positionTooltip="tooltip-top">
            <template #tooltip-explain>
              <MISAButton
                class="border-default-none border-transparent button-footer footer-panel__btnRefreshCondition"
              >
                <Icon
                  icon="ic:baseline-double-arrow"
                  color="#9e9e9e"
                  width="25"
                  height="25"
                  :horizontalFlip="true"
                />
              </MISAButton>
            </template>
            <template #tooltip-content>
              <p>Trang đầu</p>
            </template>
          </MISATooltip>
        </div>
        <div class="footer-panel__arrow-previous-one">
          <MISATooltip positionTooltip="tooltip-top">
            <template #tooltip-explain>
              <MISAButton
                class="border-default-none border-transparent button-footer footer-panel__btnRefreshCondition"
              >
                <Icon
                  icon="fe:arrow-right"
                  color="#9e9e9e"
                  width="25"
                  height="25"
                  :horizontalFlip="true"
                />
              </MISAButton>
            </template>
            <template #tooltip-content>
              <p>Trang tiếp</p>
            </template>
          </MISATooltip>
        </div>
      </div>
      <span class="footer-panel__separate"></span>
      <!-- Show Page Number -->
      <div class="footer-panel__page">
        Trang
        <input type="text" class="page-number" value="1" style="width: 30px" />
        trên
        <span class="totalPage">10</span>
      </div>
      <span class="footer-panel__separate"></span>
      <!-- Arrow Next -->
      <div class="footer-panel__arrows footer-panel__arrow-next">
        <div class="footer-panel__arrow-next-one">
          <MISATooltip positionTooltip="tooltip-top">
            <template #tooltip-explain>
              <MISAButton
                class="border-default-none border-transparent button-footer footer-panel__btnRefreshCondition"
              >
                <Icon icon="fe:arrow-right" color="#9e9e9e" width="25" height="25" />
              </MISAButton>
            </template>
            <template #tooltip-content>Trang sau</template>
          </MISATooltip>
        </div>
        <div class="footer-panel__arrow-next-lastPage">
          <MISATooltip positionTooltip="tooltip-top">
            <template #tooltip-explain>
              <MISAButton
                class="border-default-none border-transparent button-footer footer-panel__btnRefreshCondition"
              >
                <Icon icon="ic:baseline-double-arrow" color="#9e9e9e" width="25" height="25" />
              </MISAButton>
            </template>
            <template #tooltip-content>
              <p>Trang cuối</p>
            </template>
          </MISATooltip>
        </div>
      </div>
      <span class="footer-panel__separate"></span>
      <!-- Button Refresh -->
      <MISATooltip positionTooltip="tooltip-top">
        <template #tooltip-explain>
          <MISAButton
            class="border-default-none border-transparent button-footer footer-panel__btnRefreshCondition"
            ><Icon icon="ic:sharp-refresh" color="#9e9e9e" width="25" height="25" />
          </MISAButton>
        </template>
        <template #tooltip-content>
          <p>Tải lại</p>
        </template>
      </MISATooltip>

      <span class="footer-panel__separate"></span>
      <!-- Combobox choose quality records -->
      <div class="footer-panel__combobox-quality-record">Combobox</div>
    </div>
    <div class="footer__show-info-table">
      <span>Hiển thị 1 - 20 trên 300 kết quả</span>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  height: var(--height-main-footer-table);
  border-top: 1px solid var(--color-border-default);
  border-radius: 0 0 var(--border-radius-primary) var(--border-radius-primary);
}

.footer-panel {
  display: flex;
  align-items: center;
  margin: 0 5px;
}

.footer__show-info-table {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.footer-panel__btnRefreshCondition {
  height: 27px;
}

.footer-panel__arrows {
  display: flex;
  align-items: center;
}

.footer-panel__arrow-previous {
}

.footer-panel__page {
}

.footer-panel__arrow-next {
}

.footer-panel__separate {
  border-right: 1px solid var(--color-border-default);
  height: 14px;
  margin: 0 8px;
}

// Tiện ích khác
.border-transparent {
  border: 1px solid #fff;
}
</style>
