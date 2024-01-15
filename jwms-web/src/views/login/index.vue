<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">教务管理系统</h3>
      </div>

      <el-select v-model="value" placeholder="请选择你的身份">
        <el-option
          v-for="item in options"
          ref="identity"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.id"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import axios from 'axios'
import { generateRoutes } from '@/router'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不得少于6位'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        id: '3',
        password: '123456'
      },
      loginRules: {
        id: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      options: [
        { value: '1', label: '教务老师' },
        { value: '2', label: '老师' },
        { value: '3', label: '学生' }
      ],
      value: '1'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLoginSuccess(response) {
      this.loading = false
      console.log('登录成功', response)
      this.$nextTick(() => {
        let redirectPath
        switch (this.value) {
          case '1': // 教务老师
            redirectPath = '/sys'
            break
          case '2': // 老师
            redirectPath = '/class'
            break
          case '3': // 学生
            redirectPath = '/studentuse'
            break
        }
        this.$router.push(redirectPath)
      })
    },

    handleLoginError(error) {
    // 处理登录失败逻辑，可以显示错误信息等操作
      this.loading = false
      console.error('登录失败', error)
    },
    handleLogin() {
    // 构建请求参数
      const userPayload = {
        id: this.loginForm.id,
        password: this.loginForm.password
      }
      // 发送登录请求
      this.loading = true
      // 根据用户选择的身份类型调用不同的登录接口
      switch (this.value) {
        case '1':
          axios.post('http://localhost:8088/jwteacher/login', userPayload)
            .then(response => {
              this.handleLoginSuccess(response)
            })
            .catch(error => {
              this.handleLoginError(error)
            })
          break
        case '2':
          axios.post('http://localhost:8088/teacher/login', userPayload)
            .then(response => {
              this.handleLoginSuccess(response)
            })
            .catch(error => {
              this.handleLoginError(error)
            })
          break
        case '3':
          axios.post('http://localhost:8088/student/login', userPayload)
            .then(response => {
              this.handleLoginSuccess(response)
            })
            .catch(error => {
              this.handleLoginError(error)
            })
          break
        default:
          this.loading = false
          console.error('未知的用户身份类型')
          break
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
