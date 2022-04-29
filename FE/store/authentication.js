import { handleApi } from '@/utils/handleApi'

export const state = () => ({
  roles: [],
  permissions: [],
  openModalLoginState: true,
  resetCartState: true
})

export const mutations = {
  setRoles(state, roles) {
    state.roles = roles
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  }
}

export const actions = {
  register(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/auth/register', data), context)
    })
  },
  forgotPassword(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/forgot-password', data), context)
    })
  },
  sendOtp(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/send-otp', data), context)
    })
  },
  reSendOtp(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/resend-otp', data), context)
    })
  },
  verifyLoginOtp(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/auth/verify-login', data), context)
    })
  },
  verifyRegisterOtp(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/auth/verify-register', data), context)
    })
  },
  resetPassword(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/forgot-password/' + data[1], data[0]), context)
    })
  },
  login(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/auth/login', data), context)
    })
  },
  logout(context) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/auth/logout'), context)
    })
  },
  getUserInfo(context) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('/auth/me'), context)
    })
  },
  resendOtp(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/auth/resend-code', data), context)
    })
  }
}
