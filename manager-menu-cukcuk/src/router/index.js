import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/menu',
      name: 'MenuListView',
      component: () => import('../views/menu/MenuListView.vue'),
      children: [
        {
          path: 'create',
          components: {
            MenuDialogFormRouterView: () => import('../views/menu/MenuDialogForm.vue')
          },
          name: 'MenuDialogFormCreate'
        }
      ],
      sensitive: true
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../layouts/NotFound.vue')
    }
  ]
})

export default router
