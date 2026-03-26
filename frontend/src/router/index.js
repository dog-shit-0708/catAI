import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/ai-chat',
    name: 'AiChat',
    component: () => import('../pages/AiChat.vue')
  },
  {
    path: '/feeding',
    name: 'Feeding',
    component: () => import('../pages/Feeding.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/Profile.vue')
  },
  {
    path: '/feeding-add',
    name: 'FeedingAdd',
    component: () => import('../pages/FeedingAdd.vue')
  },
  {
    path: '/cat-detail/:id',
    name: 'CatDetail',
    component: () => import('../pages/CatDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router