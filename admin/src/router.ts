import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('./views/Dashboard.vue') },
    { path: '/users', name: 'users', component: () => import('./views/Users.vue') },
    { path: '/users/:openid', name: 'user-detail', component: () => import('./views/UserDetail.vue'), props: true },
    { path: '/tasks', name: 'tasks', component: () => import('./views/Tasks.vue') },
    { path: '/backup', name: 'backup', component: () => import('./views/Backup.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
