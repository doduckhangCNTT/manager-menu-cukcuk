import { defineStore } from 'pinia'

export const useMenuFoodStore = defineStore('menuFoods', {
  state: () => ({ menuFoods: {} }),
  getters: {
    getMenuFoods() {
      return this.menuFoods
    }
  },
  actions: {
    setDataFilter(value) {
      this.menuFoods = value
    },
    getDataStore() {
      return this.menuFoods
    }
  }
})
