import { login, logout, getInfo } from '@/api/user'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    name: '',
    userType: '', // 用户类型
    teacherId: null // 新增教师ID
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER_TYPE: (state, userType) => {
    state.userType = userType // 更新用户类型
  },
  SET_TEACHER_ID: (state, id) => {
    state.teacherId = id // 设置教师ID
  }
}

const actions = {
  // user login
// user login
// 在 login 动作中添加调试日志
  login({ commit }, userInfo) {
    const { id, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ id: id.trim(), password: password }).then(response => {
        const { data } = response
        console.log('Login response:', data) // 添加调试日志
        commit('SET_USER_TYPE', data.userType)
        localStorage.setItem('userType', data.userType)
        commit('SET_TEACHER_ID', data.teacherId)
        localStorage.setItem('teacherId', data.teacherId)
        resolve()
      }).catch(error => {
        console.error('Login error:', error) // 添加调试错误日志
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, avatar, userType } = data // 假设后端返回的数据中包含 userType
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USER_TYPE', userType) // 更新用户类型
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        console.log('Logout successful') // 添加调试日志
        localStorage.removeItem('userType') // 清除 localStorage 中的用户类型
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        console.error('Logout error:', error) // 添加调试错误日志
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

