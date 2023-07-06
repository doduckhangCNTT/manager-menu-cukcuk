<script>
import MISAButton from '../../components/MISAButton.vue'
import { Icon } from '@iconify/vue'
import MISATooltip from '../../components/MISATooltip.vue'
import { useMenuFoodStore } from '../../stores/menuFood'
import InputFunctions from '../../utils/functions/InputFunctions'
import MISACombobox from '../../components/MISACombobox.vue'

export default {
  name: 'MainListFooter',
  components: { MISAButton, Icon, MISATooltip, MISACombobox },
  data() {
    return {
      menuFoodsStore: useMenuFoodStore(),
      selectedPageNumber: 1,
      qualityRecordsStart: null,
      optionsNumberRecord: [
        {
          id: 1,
          value: 25
        },
        {
          id: 2,
          value: 30
        },
        {
          id: 3,
          value: 50
        },
        {
          id: 4,
          value: 100
        },
        {
          id: 5,
          value: 10
        }
      ],
      comboboxValue: 0,
      // defaultValue: this.optionsNumberRecord[2],
      defaultValue: {
        id: 2,
        value: 30
      }
    }
  },
  mounted() {},
  watch: {
    '$route.query.limit': {
      handler() {
        this.defaultValue = { ...this.defaultValue, value: this.$route.query.limit }
      }
    }
  },
  computed: {
    /**
     * - Tính toán tổng số trang tương ứng với số bản ghi và giới hạn bản ghi trên trang (limit)
     * - Author: DDKhang (1/7/2023)
     */
    calcTotalPage() {
      const { limit } = this.$route.query
      // Tổng số bản ghi chưa lọc
      const menuFoods = this.menuFoodsStore.getDataStore()
      const totalRecords = menuFoods.TotalRecordsResult
      const totalPage = Math.ceil(totalRecords / parseInt(limit))
      return totalPage
    },

    /**
     * - Xử lí lấy các query trên url
     * - Author: DDKhang (1/7/2023)
     */
    handleQueryUrl() {
      const { page, limit } = this.$route.query
      const skip = (parseInt(page) - 1) * parseInt(limit)
      return { page, limit, skip }
    }
  },

  methods: {
    // Methods xử lí chuyển tiếp trang
    /**
     * - Thực hiện xử lí đi đến trang đầu tiên
     * - Author: DDKhang (1/7/2023)
     */
    handlePageBtnPreviousHome() {
      // Cập nhật thông tin trang
      this.selectedPageNumber = 1
      this.$router.push({ query: { page: 1, limit: this.handleQueryUrl.limit } })
    },

    /**
     * - Thực hiện xử lí đến trang trước đó
     * - Author: DDKhang (1/7/2023)
     */
    handlePageBtnPrevious() {
      const { page, limit } = this.handleQueryUrl
      const minusPage = parseInt(page) - 1
      // Cập nhật thông tin trang
      this.selectedPageNumber = minusPage
      this.$router.push({ query: { page: minusPage <= 0 ? 1 : minusPage, limit: limit } })
    },

    // Methods xử lí trang tiếp theo
    /**
     * - Thực hiện xử lí đi đến trang tiếp theo
     * - Author: DDKhang (1/7/2023)
     */
    handlePageBtnNext() {
      const { page, limit } = this.handleQueryUrl
      const totalPage = this.calcTotalPage
      const incrementPage = parseInt(page) + 1
      // Cập nhật thông tin trang
      this.selectedPageNumber = incrementPage
      this.$router.push({
        query: { page: incrementPage >= totalPage ? totalPage : incrementPage, limit: limit }
      })
    },
    /**
     * - Thực hiện xử lí đi đến trang cuối
     * - Author: DDKhang (1/7/2023)
     */
    handlePageBtnNextEnd() {
      const { limit } = this.handleQueryUrl
      // Cập nhật thông tin trang
      this.selectedPageNumber = this.calcTotalPage
      this.$router.push({
        query: { page: this.calcTotalPage, limit: limit }
      })
    },

    // Methods xử lí thay đổi giá trị trên input
    /**
     *
     * @param {*} event - Đối tượng sự kiện mặc định
     * - Thực hiện bắt sự thay đổi dữ liệu trên thẻ input chọn trang
     * - Author: DDKhang (1/7/2023)
     */
    handleChangePageNumber(event) {
      const { value } = event.target
      this.selectedPageNumber = value

      // this.$router.push({ query: { page: value, limit: this.handleQueryUrl.limit } })
    },

    /**
     * - Bắt sự kiện enter trên input
     * - Author: DDKhang (1/7/2023)
     */
    handleSelectedInputEnter() {
      const { limit } = this.handleQueryUrl
      // Nếu số trang lớn hơn số trang hiện tại thì chỉ lấy trang hiện tại
      let newPageNumber = this.selectedPageNumber

      if (this.selectedPageNumber > this.calcTotalPage) {
        newPageNumber = this.calcTotalPage
      } else if (this.selectedPageNumber < 0) {
        newPageNumber = 1
      }
      this.$router.push({ query: { page: newPageNumber, limit } })
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

    // ##### Xử lí combobox
    /**
     * - Thực hiện thêm các class tương ứng để điều chỉnh combobox
     * - Author: DDKhang (1/7/2023)
     */
    handleCustomClassCombobox() {
      return {
        borderLeftNone: 'border-left--none',
        listItemTop: 'list-item--top',
        backgroundWhite: 'backgroundColor--white',
        widthInput: 'width-50'
      }
    },

    /**
     * @param {object} option - Gía trị Option của combobox
     * - Thực hiện xử lí chọn option của combobox
     * - Author: DDKhang (1/7/2023)
     */
    handleChooseQualityRecord(option) {
      const { page } = this.handleQueryUrl
      const { value } = option
      const menuFoods = this.menuFoodsStore.getDataStore()
      const totalRecords = menuFoods.TotalRecordsResult
      let newPage = page

      // Số trang sau khi chọn số bản ghi
      const pageAfterChoose = Math.ceil(parseInt(totalRecords) / value)

      // Xử lí tạo trang tương ứng trong các trường hợp
      if (totalRecords - this.handleQueryUrl.skip < value) {
        newPage = pageAfterChoose
      } else if (pageAfterChoose < this.handleQueryUrl.page) {
        newPage = pageAfterChoose
      }
      // Nếu số lượng bản ghi lấy ra lớn hơn số bản ghi ở trang hiện tại thì cần tính toán lại page mới

      this.$router.push({ query: { page: newPage, limit: value } })
    },

    /**
     * - Thực hiện tải lại dữ liệu (theo các điều kiện đã tồn tại)
     * - Author: DDKhang (1/7/2023)
     */
    handleLoadAgainRecords() {
      // Phát tín hiệu lên MenuListView.vue
      this.$msemitter.emit(this.$EmitterEnum.loadAgainRecords, this.handleQueryUrl.page)
    }
  }
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
                @click="handlePageBtnPreviousHome"
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
                @click="handlePageBtnPrevious"
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
        <input
          type="text"
          class="page-number"
          @input="handleChangePageNumber"
          :value="this.handleQueryUrl.page"
          @keydown="restrictNonNumeric"
          @keydown.enter="handleSelectedInputEnter"
          style="width: 30px"
        />
        trên
        <span class="totalPage">{{ calcTotalPage }}</span>
      </div>
      <span class="footer-panel__separate"></span>
      <!-- Arrow Next -->
      <div class="footer-panel__arrows footer-panel__arrow-next">
        <div class="footer-panel__arrow-next-one">
          <MISATooltip positionTooltip="tooltip-top">
            <template #tooltip-explain>
              <MISAButton
                @click="handlePageBtnNext"
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
                @click="handlePageBtnNextEnd"
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
            @click="handleLoadAgainRecords"
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
      <div class="footer-panel__combobox-quality-record">
        <MISACombobox
          ref="comboboxRef"
          :customClass="this.handleCustomClassCombobox()"
          placeholderInput="30"
          v-model="this.comboboxValue"
          :listItemValue="this.optionsNumberRecord"
          :defaultValueInput="this.defaultValue"
          :handleChooseRecord="this.handleChooseQualityRecord"
        ></MISACombobox>
      </div>
    </div>
    <div class="footer__show-info-table">
      <span
        >Hiển thị {{ this.handleQueryUrl.skip + 1 }} -
        {{ this.handleQueryUrl.skip + parseInt(this.menuFoodsStore.getDataStore().Data?.length) }}
        trên {{ this.menuFoodsStore.getDataStore().TotalRecordsResult }} kết quả</span
      >
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
