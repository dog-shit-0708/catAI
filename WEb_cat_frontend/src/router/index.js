import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Archives from '../views/Archives.vue'
import Chat from '../views/Chat.vue'
import About from '../views/About.vue'
import CatProfile from '../views/CatProfile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/archives',
    name: 'Archives',
    component: Archives
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/cat/:id',
    name: 'CatProfile',
    component: CatProfile
  }
]

const router = createRouter({
  history: createWebHistory('/catAI/'),
  routes
})

export default router
