import { handleApi } from '@/utils/handleApi'

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  updateProfile(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/users', data), context)
    })
  },
  uploadAvatar(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/users/update-avatar', data), context)
    })
  },
  changePass(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/reset-password', data), context)
    })
  },
  getProfile(context) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('/users'), context)
    })
  },
  getPrePhone(context) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('/master-data?resources[country_phone]={}'), context)
    })
  }
}
