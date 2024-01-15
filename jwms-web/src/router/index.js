import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'Histogram', affix: 'true' }
    }]
  },

  {
    path: '/sys',
    component: Layout,
    name: 'sysManage',
    meta: { title: '系统管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/jwteacher',
        name: 'jwteacher',
        component: () => import('@/views/jwteacher/index'),
        meta: { title: '教务老师管理', icon: 'tree' }
      },

      {
        path: '/teacher',
        name: 'teacher',
        component: () => import('@/views/teacher/index'),
        meta: { title: '老师管理', icon: 'tree' }
      },

      {
        path: '/student',
        name: 'student',
        component: () => import('@/views/student/index'),
        meta: { title: '学生管理', icon: 'tree' }
      },

      {
        path: '/course',
        name: 'course',
        component: () => import('@/views/course/index'),
        meta: { title: '课程管理', icon: 'tree' }
      },

      {
        path: '/tclass',
        name: 'tclass',
        component: () => import('@/views/tclass/index'),
        meta: { title: '教学班管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/class',
    component: Layout,
    meta: { title: '班级管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/attendance',
        name: 'attendance',
        component: () => import('@/views/attendance/index'),
        meta: { title: '考勤', icon: 'tree' }
      },
      {
        path: '/check',
        name: 'check',
        component: () => import('@/views/check/index'),
        meta: { title: '查看班级信息', icon: 'tree' }
      }
    ]
  },

  {
    path: '/choose',
    component: Layout,
    meta: { title: '选课', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/choose',
        name: 'choose',
        component: () => import('@/views/choose/index'),
        meta: { title: '选课', icon: 'tree' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const sysManageRoutes = [
  {
    path: '/student',
    name: 'student',
    component: () => import('@/views/student/index'),
    meta: { title: '学生管理', icon: 'tree' }
  }
]

const classManageRoutes = [
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import('@/views/attendance/index'),
    meta: { title: '考勤', icon: 'tree' }
  }
]

const chooseRoutes = [
  {
    path: '/choose',
    name: 'choose',
    component: () => import('@/views/choose/index'),
    meta: { title: '选课', icon: 'tree' }
  }
]

// 异步路由
export const asyncRoutes = {
  '1': [sysManageRoutes], // 教务老师
  '2': [classManageRoutes], // 老师
  '3': [chooseRoutes] // 学生
}

// 创建路由器
const createRouter = () => new Router({
  mode: 'hash', // 使用hash模式
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 根据用户类型生成路由的函数
export function generateRoutes(userType) {
  const accessedRoutes = asyncRoutes[userType] || []
  router.options.routes = constantRoutes // 重置为初始路由
  accessedRoutes.forEach(newRoute => {
    if (!router.options.routes.some(existingRoute => existingRoute.name === newRoute.name)) {
      router.addRoutes([newRoute]) // 添加新的路由
    }
  })
  console.log('新添加的路由：', accessedRoutes)
  console.log('当前路由器状态：', router.options.routes)
}

// 重置路由的方法
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

export default router

