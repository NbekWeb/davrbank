import { createRouter, createWebHistory } from 'vue-router'
import AppView from '@/pages/app/AppView.vue'
import NotFound from '@/pages/_404.vue'
import ServerError from '@/pages/_500.vue'
import AppBankView from '@/pages/app/bank/AppBankView.vue'
import BankDashboardView from '@/pages/app/bank/dashboard/BankDashboardView.vue'
import AuthGatewayView from '@/pages/auth/AuthGatewayView.vue'
import AuthLoginView from '@/pages/auth/AuthLoginView.vue'
import AuthRegistrationView from '@/pages/auth/AuthRegistrationView.vue'

const AuthView = () => import('@/pages/auth/AuthView.vue')

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AuthView',
      component: AuthView,
      redirect: '/auth',
      children: [
        {
          path: 'auth',
          name: 'AuthGatewayView',
          component: AuthGatewayView
        },
        {
          path: 'login',
          name: 'AuthLoginView',
          component: AuthLoginView
        },
        {
          path: 'registration',
          name: 'AuthRegistrationView',
          component: AuthRegistrationView
        }
      ]
    },
    {
      path: '/app',
      name: 'DashboardView',
      component: AppView,
      redirect: '/app/bank',
      children: [
        {
          path: 'bank',
          name: 'DashboardBankView',
          component: AppBankView,
          redirect: '/app/bank/dashboard',
          children: [
            {
              path: 'dashboard',
              name: 'BankDashboardView',
              component: BankDashboardView
            },
            {
              path: 'operation',
              name: 'BankOperationView',
              component: BankDashboardView
            }
          ]
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound,
      name: 'DashboardNotFond'
    },
    {
      path: '/500',
      component: ServerError,
      name: 'ServerError'
    }
  ]
})

const routerFactory = (i18n) => {
  router.beforeEach((to, from, next) => {
    // document.title = i18n.t(to.name)
    return next()
    // const accessToken = localStorage.getItem('access_token')
    // if (accessToken) {
    //   if (to.path.includes('app')) {
    //     return next()
    //   } else if (to.name === 'ServerError') {
    //     return next()
    //   } else {
    //     return next({ name: 'DashboardView' })
    //   }
    // } else {
    //   if (!to.path.includes('app')) {
    //     return next()
    //   } else {
    //     return next({ name: 'AuthView' })
    //   }
    // }
  })
  return router
}

export default routerFactory
