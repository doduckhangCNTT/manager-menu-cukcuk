<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import ResourceNavbar from '../resources/resource/ResourceNavbar'
import MISAPopupMenuItem from '../components/MISAPopupMenuItem.vue'
/**
 * - Danh sách các mục của navbar
 * - Author: DDKhang (20/6/2023)
 */
const listNavbarItem = [
  {
    id: 1,
    title: ResourceNavbar.NavbarHome.Overview.title,
    tooltip: ResourceNavbar.NavbarHome.Overview.tooltip,
    link: '/overview',
    elementIcon: 'material-symbols:overview-outline-rounded'
  },
  {
    id: 2,
    title: ResourceNavbar.NavbarHome.Menu.title,
    tooltip: ResourceNavbar.NavbarHome.Menu.tooltip,
    link: '/menu',
    elementIcon: 'fluent:tasks-app-28-regular'
  },
  {
    id: 3,
    title: ResourceNavbar.NavbarHome.Report.title,
    tooltip: ResourceNavbar.NavbarHome.Report.tooltip,
    link: '/report',
    elementIcon: 'mdi:report-donut',
    children: [
      {
        title: 'Khang',
        components: [
          {
            title: 'abc 1',
            link: '/abc'
          },
          {
            title: 'bcd 1',
            link: '/bcd'
          },
          {
            title: 'cbd 1',
            link: '/cbd'
          }
        ]
      },
      {
        title: 'Khang',
        components: [
          {
            title: 'abc 1',
            link: '/abc'
          },
          {
            title: 'bcd 1',
            link: '/bcd'
          },
          {
            title: 'cbd 1',
            link: '/cbd'
          }
        ]
      },
      {
        title: 'Khang',
        components: [
          {
            title: 'abc 1',
            link: '/abc'
          },
          {
            title: 'bcd 1',
            link: '/bcd'
          },
          {
            title: 'cbd 1',
            link: '/cbd'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: ResourceNavbar.NavbarHome.Purchase.title,
    tooltip: ResourceNavbar.NavbarHome.Purchase.tooltip,
    link: '/purchase',
    elementIcon: 'bytesize:cart'
  },
  {
    id: 5,
    title: ResourceNavbar.NavbarHome.Store.title,
    tooltip: ResourceNavbar.NavbarHome.Store.tooltip,
    link: '/store',
    elementIcon: 'map:store'
  },
  {
    id: 9,
    title: 'Bán hàng Online',
    tooltip: ResourceNavbar.NavbarHome.Store.tooltip,
    link: '',
    elementIcon: 'map:store',
    menuType: 1, // Bán hàng online
    components: [
      {
        id: 9.1,
        title: 'OCM',
        tooltip: ResourceNavbar.NavbarHome.Store.tooltip,
        link: '/ocm',
        elementIcon: 'map:store'
      },
      {
        id: 9.2,
        title: 'Cửa hàng điện tử',
        tooltip: ResourceNavbar.NavbarHome.Store.tooltip,
        link: '/electronic',
        elementIcon: 'map:store'
      }
    ]
  },
  {
    id: 6,
    title: ResourceNavbar.NavbarHome.App.title,
    tooltip: ResourceNavbar.NavbarHome.App.tooltip,
    link: '/app',
    elementIcon: 'tabler:apps'
  },
  {
    id: 7,
    title: ResourceNavbar.NavbarHome.Expense.title,
    tooltip: ResourceNavbar.NavbarHome.Expense.tooltip,
    link: '/expense',
    elementIcon: 'mdi:user-multiple'
  },
  {
    id: 8,
    title: ResourceNavbar.NavbarHome.ServiceSoftware.title,
    tooltip: ResourceNavbar.NavbarHome.ServiceSoftware.tooltip,
    link: '/serviceSoftware',
    elementIcon: 'mdi:user-multiple'
  }
]

onMounted(() => {
  window.addEventListener('click', handleClosePopupContent)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClosePopupContent)
})

/**Trạng thí đóng mở menu */
let isCollapsed = ref(false)
let activePopup = ref(null)
let popupStyle = ref({})
let menuItemRect = ref({})

function toggleMenu() {
  isCollapsed.value = !isCollapsed.value
}

function handleClosePopupContent() {
  if (activePopup && activePopup.value) {
    activePopup.value = null
    popupStyle.value = {}
  }
}

function beforeEnter(el) {
  el.style.opacity = 0
  el.style.maxWidth = '0px'
}
function enter(el, done) {
  el.offsetWidth // trigger reflow
  el.style.transition = 'opacity 1s ease, max-width 1s ease'
  el.style.opacity = 1
  el.style.maxWidth = '230px'
  done()
}
function leave(el, done) {
  el.style.transition = 'opacity 1s ease, max-width 1s ease'
  el.style.opacity = 0
  el.style.maxWidth = '0px'
  done()
}

/**
 * Hiển thị popup menu item khi nhấn vào
 * @param {*} event Sự kiện
 * @param {*} id Mã của item Menu
 * Created By; DDKhang (17/08/2024)
 */
function showPopup(event, id) {
  // Ngăn sự kiện nổi bột ra ngoài sự kiện đóng của window
  event.stopPropagation()
  // Toggle hiển thị popup
  if (activePopup && activePopup.value === id) {
    activePopup.value = null
    popupStyle.value = {}
  } else {
    activePopup.value = id
    // Lấy đối tượng menu Item
    const menuItem = event.currentTarget
    // Lấy kích thước của thành phần menu vừa bấm vào
    let menuItemRectValue = menuItem.getBoundingClientRect()

    if (menuItemRectValue) {
      const value = JSON.parse(JSON.stringify(menuItemRectValue))
      value.top = menuItemRectValue.top + window.scrollY
      value.right = menuItemRectValue.right + window.scrollX
      menuItemRect.value = value
    }
  }
}
</script>

<template>
  <nav :class="['leftMenu', { collapsed: isCollapsed }]">
    <ul class="list-nav">
      <li
        class=""
        v-for="(navItem, index) in listNavbarItem"
        :key="index"
        @click="showPopup($event, navItem.id)"
      >
        <!-- Menu riêng cho Bán hàng online -->
        <div
          v-if="
            navItem && navItem.menuType === 1 && navItem.components && navItem.components.length
          "
          class=""
        >
          <div class="sale-online">
            <div class="sale-online-title">{{ navItem.title }}</div>
            <div class="" v-for="(item, i) in navItem.components" :key="i">
              <router-link :to="item.link" class="nav-item-saleOnline">
                <div class="nav__navItem-icon">
                  <Icon :icon="navItem.elementIcon" color="white" width="24" height="24" />
                </div>
                <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                  <div v-if="!isCollapsed" class="nav__navItem-title">{{ item.title }}</div>
                </transition>
              </router-link>
            </div>
          </div>
        </div>
        <!-- Các trường hợp khác -->
        <div v-else class="nav-item">
          <router-link :to="navItem.link" class="nav__navItem">
            <div class="nav__navItem-icon">
              <Icon :icon="navItem.elementIcon" color="white" width="24" height="24" />
            </div>
            <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
              <div v-if="!isCollapsed" class="nav__navItem-title">{{ navItem.title }}</div>
            </transition>
          </router-link>

          <MISAPopupMenuItem
            v-if="
              activePopup &&
              activePopup === navItem.id &&
              navItem.children &&
              navItem.children.length
            "
            :top="menuItemRect.top"
            :right="menuItemRect.right"
            class="popup-menu"
          >
            <div class="popup-menu-item" v-for="(item, index) in navItem.children" :key="index">
              <div class="menu-item-title">
                <div class="color-top"></div>
                <p class="title">{{ item.title }}</p>
              </div>
              <ul class="menu-item-child-list" v-for="(child, i) in item.components" :key="i">
                <li class="menu-item-child">{{ child.title }}</li>
              </ul>
            </div>
          </MISAPopupMenuItem>
        </div>
      </li>
    </ul>
    <!-- Nút thu gọn -->
    <div class="btnCollapse" @click="toggleMenu">
      <Icon v-if="isCollapsed" icon="bi:arrow-right-square" width="20" height="20" />
      <Icon v-else icon="ep:arrow-left-bold" />
      <div v-if="!isCollapsed" class="">Thu Gọn</div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  flex-shrink: 0;
  background-color: var(--color-primary);
  width: 230px;
  height: calc(100vh - 55px);
}

nav.collapsed {
  width: 46px !important;
}

// border-bottom: 1px solid #016087;
// border-top: 1px solid #038ac1;

.list-nav {
}
.collapsed li .nav__navItem-title {
  transition: padding 0.3s ease;
}

.nav-item {
}
.nav-item:hover {
  background-color: var(--color-navbar-hover-primary);
  transition: all 0.2s;
}

.nav-item-saleOnline:hover {
  background-color: var(--color-navbar-hover-primary);
  transition: all 0.2s;
}

.nav-item-saleOnline:hover .nav-item {
  background-color: transparent;
}

.nav__navItem {
  display: flex;
  column-gap: 10px;
  height: 38px;
  align-items: center;
  padding-left: 10px;
  text-decoration: none;
  color: var(--color-text-white);
  border-bottom: 1px solid #016087;
  border-top: 1px solid #038ac1;
}
.nav-item-saleOnline {
  display: flex;
  column-gap: 10px;
  height: 38px;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-white);
}

.sale-online {
  padding: 5px;
  border: 1px solid black;
  margin: 5px;
  border-radius: 8px;
  &-title {
    font-size: 16px;
  }
}

.nav__navItem-icon {
}

.nav__navItem-title {
}

.router-link-active {
  background-color: var(--background-active-menu);
}

.leftMenu {
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
}

.btnCollapse {
  display: flex;
  column-gap: 10px;
  color: white;
  padding: 10px 5px;
  border-top: 1px solid black;
  justify-content: center;
  align-items: center;
  // Đẩy btn xuất cuối thanh menu
  margin-top: auto;
}

.btnCollapse:hover {
  cursor: pointer;
  background-color: var(--background-active-menu);
}

.leftMenu li .nav__navItem-title {
  transition: opacity 1s ease;
  opacity: 1;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
}

.leftMenu.collapsed li .nav__navItem-title {
  opacity: 0;
}

.popup-menu {
  padding: 10px;
  max-height: 500px;
  max-width: 400px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  &-item {
    margin: 5px;
  }

  .menu-item-title {
    display: flex;
    width: 100%;

    .color-top {
      width: 5px;
      background-color: red;
    }

    .title {
      padding: 0 5px 0 5px;
      background-color: rgb(74, 74, 250);
      color: white;
      width: 100%;
    }
  }

  .menu-item-child-list {
    list-style: none;
    padding-left: 10px;
  }
  .menu-item-child {
    padding: 0 5px;
    height: 30px;
    display: flex;
    align-items: center;
    transition: all 0.2s ease-in;
    border-radius: 5px;
    min-width: 100px;
  }

  .menu-item-child:hover {
    cursor: pointer;
    background-color: rgb(74, 74, 250);
    color: white;
  }
}
</style>
