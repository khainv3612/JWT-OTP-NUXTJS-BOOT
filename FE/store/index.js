import _ from 'lodash'
import { handleApi } from '~/utils/handleApi'

export const state = () => ({
  notifySuccess: { show: false, text: '' },
  notifyError: { show: false, text: '' },
  notifyWarning: { show: false, text: '' },
  setEmail: { show: false, text: '' },
  loading: false,
  email: '',
  homeClass: '',
  isOtpPage: false
})

export const getters = {}

export const mutations = {
  setNotifySuccess(state, notify) {
    state.notifySuccess = _.cloneDeep(notify)
  },
  setNotifyError(state, notify) {
    state.notifyError = _.cloneDeep(notify)
  },
  setNotifyWarning(state, notify) {
    state.notifyWarning = _.cloneDeep(notify)
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setEmail(state, email) {
    state.email = email
  },
  setHomeClass(state, homeClass) {
    state.homeClass = homeClass
  },
  setIsOtpPage(state, isOtpPage) {
    state.isOtpPage = isOtpPage
  }
}

export const actions = {
  getMasterData(context, resource) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`/master-data?${resource}`), context)
    })
  },
  uploadFile(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/upload', data), context)
    })
  }
}
