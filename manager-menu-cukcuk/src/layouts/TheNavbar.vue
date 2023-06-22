<script>
import { Icon } from '@iconify/vue'
export default {
  name: 'TheNavbar',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Icon
  },

  data() {
    return {
      /**
       * - Danh sách các mục của navbar
       * - Author: DDKhang (20/6/2023)
       */
      listNavbarItem: [
        {
          title: this.$ResourceNavbar.NavbarHome.Overview.title,
          tooltip: this.$ResourceNavbar.NavbarHome.Overview.tooltip,
          link: '/overview',
          elementIcon: 'material-symbols:overview-outline-rounded'
        },
        {
          title: this.$ResourceNavbar.NavbarHome.Menu.title,
          tooltip: this.$ResourceNavbar.NavbarHome.Menu.tooltip,
          link: '/menu',
          elementIcon: 'fluent:tasks-app-28-regular'
        },
        {
          title: this.$ResourceNavbar.NavbarHome.Report.title,
          tooltip: this.$ResourceNavbar.NavbarHome.Report.tooltip,
          link: '/menu',
          elementIcon: 'mdi:report-donut'
        },
        {
          title: this.$ResourceNavbar.NavbarHome.Purchase.title,
          tooltip: this.$ResourceNavbar.NavbarHome.Purchase.tooltip,
          link: '/purchase',
          elementIcon: 'bytesize:cart'
        },
        {
          title: this.$ResourceNavbar.NavbarHome.Store.title,
          tooltip: this.$ResourceNavbar.NavbarHome.Store.tooltip,
          link: '/store',
          elementIcon: 'map:store'
        },
        {
          title: this.$ResourceNavbar.NavbarHome.App.title,
          tooltip: this.$ResourceNavbar.NavbarHome.App.tooltip,
          link: '/app',
          elementIcon: 'tabler:apps'
        },
        {
          title: this.$ResourceNavbar.NavbarHome.Expense.title,
          tooltip: this.$ResourceNavbar.NavbarHome.Expense.tooltip,
          link: '/expense',
          elementIcon: 'mdi:user-multiple'
        },
        {
          title: this.$ResourceNavbar.NavbarHome.ServiceSoftware.title,
          tooltip: this.$ResourceNavbar.NavbarHome.ServiceSoftware.tooltip,
          link: '/serviceSoftware',
          elementIcon: 'mdi:user-multiple'
        }
      ]
    }
  }
}
</script>

<template>
  <nav>
    <ul class="list-nav">
      <li class="nav-item" v-for="(navItem, index) in listNavbarItem" :key="index">
        <router-link to="/" class="nav__navItem">
          <div class="nav__navItem-icon">
            <Icon :icon="navItem.elementIcon" color="white" width="24" height="24" />
          </div>
          <div class="nav__navItem-title">{{ navItem.title }}</div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  flex-shrink: 0;
  background-color: var(--color-primary);
  width: 230px;
  height: calc(100vh - 55px);
}

// border-bottom: 1px solid #016087;
// border-top: 1px solid #038ac1;

.list-nav {
}

.nav-item {
}
.nav-item:hover {
  background-color: var(--color-navbar-hover-primary);
  transition: all 0.2s;
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

.nav__navItem-icon {
}

.nav__navItem-title {
}
</style>
