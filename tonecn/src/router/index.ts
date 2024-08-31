import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/resource',
      name: 'resource',
      component: () => import('../views/Resource.vue')
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('../views/Download.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/Blog.vue')
    },
    {
      path: '/blogContent/:uuid',
      name: 'blogContent',
      component: () => import('../views/BlogContent.vue'),
    },
    {
      path: '/console',
      name: 'console',
      component: () => import('../views/Console/Console.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/Console/Login.vue')
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/Console/Dashboard.vue')
        }
      ],
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('jwtToken');
  if (to.name === 'dashboard' && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' });
  }
  next()
})


export default router
