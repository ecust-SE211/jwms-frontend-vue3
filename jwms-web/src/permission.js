import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })
const whiteList = ['/login']

function getCurrentUserTypeFromLocalStorage() {
  return localStorage.getItem('userType')
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  const userType = getCurrentUserTypeFromLocalStorage()
  const routeType = to.meta.value || []

  if (whiteList.includes(to.path) || routeType.length === 0 || routeType.includes(userType)) {
    next()
  } else {
    next('/login')
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
