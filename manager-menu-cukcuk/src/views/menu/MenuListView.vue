<script>
import MISAButton from '@/components/MISAButton.vue'
import MISAPopupInput from '@/components/MISAPopupInput.vue'
import MainListFooter from './MainListFooter.vue'
import MenuDialogForm from './MenuDialogForm.vue'
export default {
  data() {
    return {
      listToolbarItem: null // Danh sách toolbar table
    }
  },
  components: { MISAButton, MISAPopupInput, MainListFooter, MenuDialogForm },
  created() {
    // Thực hiện lấy danh sách toolbar table
    this.listToolbarItem = this.$ResourceToolbarTable.toolbarItems
  },
  methods: {
    handleDirectionFormAddMenu() {}
  }
}
</script>

<template>
  <main class="main-content">
    <MenuDialogForm />
    <div class="main-content--primary">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-item" v-for="(toolbarItem, index) in listToolbarItem" :key="index">
          <MISAButton
            :title="toolbarItem.tooltip"
            class="button border-transparent px-3 py-10 toolbar-item-btn border-default-none"
          >
            <div :class="toolbarItem.classIcon"></div>
            <span>{{ toolbarItem.title }}</span>
          </MISAButton>
        </div>
      </div>
    </div>
    <div class="main-table">
      <!-- Table -->
      <div class="main__table-info">
        <table id="table-menu">
          <thead>
            <tr>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 1</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 2</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 3</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 4</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 5</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 6</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 7</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 8</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 9</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 10</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
              <th class="table-menu__theadItem-filter">
                <div class="table-menu__title-col">Title 11</div>
                <div class="table-menu-thead__filter">
                  <MISAPopupInput />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 30" :key="i">
              <td class="">Value 1</td>
              <td class="">Value 1</td>
              <td class="">Value 1</td>
              <td class="">Value 1</td>
              <td class="">Value 1</td>
              <td class="">Value 1</td>
              <td class="">Value 1</td>
              <td class="">Value 1</td>
              <td class="">Value 1</td>
              <td class="">Value 1</td>
              <td class="">Value 1</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Footer table -->
      <footer class="main-content__footer">
        <MainListFooter />
      </footer>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-content--primary {
}

.main-table {
  border: 1px solid var(--color-border-default);
}

.toolbar {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-default);
  height: var(--height-main-toolbar-table);
  padding: 3px;
  column-gap: 10px;
  background-color: var(--background-color-table-primary);
  border-bottom: none;
}

.toolbar-item {
  box-sizing: border-box;
}
.toolbar-item-btn {
  display: flex;
  column-gap: 8px;
  align-items: center;
  background-color: var(--background-color-table-primary);
}
.toolbar-item-btn:hover {
  background-color: #fff;
}

.toolbarItem-add-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat -1px -2648px;
  width: 14px;
  height: 16px;
}
.toolbarItem-edit-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat 0 -1872px;
  width: 15px;
  height: 15px;
}
.toolbarItem-delete-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat -2px -2683px;
  width: 12px;
  height: 11px;
}
.toolbarItem-duplicate-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat -1px -1888px;
  width: 14px;
  height: 15px;
}
.toolbarItem-refresh-icon {
  background: url('@/assets/cukcukResource/IconSprite.png') no-repeat 0 -2586px;
  width: 16px;
  height: 13px;
}

// ##### --- Table - Start --- #####
.main__table-info {
  height: calc(
    100vh - var(--height-header-primary) - var(--height-main-top-title) -
      var(--height-main-toolbar-table) - var(--height-main-footer-table) - 10px
  );
  width: 100%;
  overflow: auto;
  position: relative;
  min-width: 700px;
}

#table-menu thead {
  position: sticky;
  top: 0;
  z-index: var(--zIndex-table-menu-thead);
}

#table-menu {
  border-collapse: separate;
  border-spacing: 0;
  /* Phải thêm cả "overflow: scroll;" cho cả thẻ cha(.main__table-info) và thẻ con (#table-menu) */
  overflow: scroll;
}

.main__table-info thead {
  background-color: #f2f2f2;
  position: sticky;
  top: 0;
}

.main__table-info tr:first-child th {
  position: sticky;
  top: 0;
  min-width: 50px;
}
.main__table-info tbody tr:hover td {
  background-color: var(--color-table-row-hover-primary);
}

.main__table-info table {
  border-collapse: collapse;
  width: 100%;
  border: 0;
  text-align: left;
  background-color: #fff;
  overflow: hidden;
}

// ##### -- Thực hiện thêm các border - Start -- #####
.main__table-info th,
td {
  border-bottom: 1px solid var(--color-border-default);
}
.main__table-info td {
  padding: 5px 10px;
}

// ##### --- Thực hiện điều chỉnh border cho "thead th" --- #####
.main__table-info th:not(:last-child) {
  border-left: 1px solid #e0e0e0;
}
.main__table-info th:is(:first-child) {
  border-left: none;
}
.main__table-info th:is(:last-child) {
  border-left: 1px solid #e0e0e0;
  // border-right: 1px solid #e0e0e0;
}

.main__table-info th {
  // border-top: 1px solid #e0e0e0;
}

// ##### --- Thực hiện điều chỉnh border cho "td" --- #####
.main__table-info td:not(:last-child) {
  border-left: 1px solid #e0e0e0;
}
.main__table-info td:is(:first-child) {
  border-left: none;
}
.main__table-info td:is(:last-child) {
  border-left: 1px solid #e0e0e0;
  // border-right: 1px solid #e0e0e0;
}

// ##### -- Thực hiện thêm các border - End -- #####

// Css mới
.table-menu {
}

.main__table-info tbody tr {
  position: relative;
  height: 28px;
}
.table-menu__title-col {
  padding: 7px 10px;
}

.table-menu-thead__filter {
}

// Những tiện ích chung
.table-menu__theadItem-filter {
  height: 64px;
  text-align: center;
}

.border-transparent {
  border: 1px solid var(--background-color-table-primary);
}
</style>
