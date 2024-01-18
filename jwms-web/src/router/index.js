import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

const sysManageRoutes = [

]

const classManageRoutes = [

]

const chooseRoutes = [

]

// 异步路由
export const asyncRoutes = {
  '1': sysManageRoutes, // 教务老师
  '2': classManageRoutes, // 老师
  '3': chooseRoutes // 学生
}

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
    path: '/jwUse',
    component: Layout,
    name: 'jwManage',
    meta: { title: '教务管理', icon: 'el-icon-s-help' },
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
      },

      {
        path: '/classstudent',
        name: 'classstudent',
        component: () => import('@/views/class/index'),
        meta: { title: '班级学生管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/tUse',
    component: Layout,
    meta: { title: '教师管理班级', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/checkclass',
        name: 'checkclass',
        component: () => import('@/views/check/index'),
        meta: { title: '课程管理', icon: 'el-icon-s-help' }
      },
      { path: '/attendance',
        name: 'attendance',
        component: () => import('@/views/attendance/index'),
        meta: { title: '教学班管理', icon: 'tree' },
        hidden: true
      },
      { path: '/attendancerecord',
        name: 'attendancerecord',
        component: () => import('@/views/attendancerecord/index'),
        meta: { title: '考勤记录', icon: 'tree' },
        hidden: true
      },
      { path: '/studentrecord',
        name: 'studentrecord',
        component: () => import('@/views/studentrecord/index'),
        meta: { title: '学生考勤记录', icon: 'tree' },
        hidden: true
      }
    ]
  },

  {
    path: '/sUse',
    component: Layout,
    meta: { title: '学生使用', icon: 'el-icon-s-help' },
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

// 创建路由器
const createRouter = () => new Router({
  mode: 'hash', // 使用hash模式
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 根据用户类型生成路由的函数
export function generateRoutes() {
  const userType = localStorage.getItem('userType')
  const accessedRoutes = asyncRoutes[userType] || []

  router.options.routes = constantRoutes.slice() // 使用 slice 复制数组
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

