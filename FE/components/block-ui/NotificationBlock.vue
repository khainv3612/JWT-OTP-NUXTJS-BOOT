<template>
  <transition name="fade">
    <NotificationElement
      v-show="notification.show"
      :text='notification.text'
      :type="notification.type"
      :class-notify="notification.classNotify"
      :b-icon="notification.bIcon"
      :close="true"
      @close="close">
    </NotificationElement>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import NotificationElement from '../element-ui/NotificationElement'
import { INDEX_SET_ERROR, INDEX_SET_SUCCESS, INDEX_SET_WARNING } from '../../store/store.const'

export default {
  name: 'NotificationBlock',
  components: { NotificationElement },
  data() {
    return {
      notification: {},
      icons: [],
      timeout: null,
      timeHide: 4000
    }
  },

  computed: {
    ...mapState(['notifySuccess', 'notifyError', 'notifyWarning'])
  },

  watch: {
    notifySuccess() {
      if (this.notifySuccess.text) {
        this.close()
        this.notification = {
          ...this.notifySuccess,
          type: 'success',
          bIcon: `
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.3682 2.6396C10.1925 2.45347 9.90756 2.45347 9.7318 2.6396L4.34052 8.34951L2.26821 6.15474C2.09248 5.96861 1.80757 5.96863 1.63181 6.15474C1.45606 6.34085 1.45606 6.64259 1.63181 6.82872L4.02233 9.36047C4.198 9.54658 4.48312 9.54645 4.65872 9.36047L10.3682 3.3136C10.5439 3.12749 10.5439 2.82573 10.3682 2.6396Z" fill="white"/>
</svg>
`,
          classNotify: 'notify-success'
        }
        this.$store.commit(INDEX_SET_SUCCESS, { show: false, text: '' })
        // eslint-disable-next-line no-return-assign
        this.timeout = setTimeout(() => this.notification.show = false, this.timeHide)
      }
    },
    notifyError() {
      if (this.notifyError.text) {
        this.close()
        clearTimeout(this.timeout)
        this.notification = {
          ...this.notifyError,
          type: 'danger',
          bIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="8" r="8" fill="#FF4D4F"/>
<path d="M4.66652 12C4.53469 12 4.40583 11.9608 4.29622 11.8876C4.18661 11.8143 4.10119 11.7102 4.05074 11.5884C4.00029 11.4666 3.98709 11.3326 4.0128 11.2033C4.03851 11.074 4.10199 10.9552 4.19519 10.862L10.8619 4.19532C10.9872 4.07218 11.1562 4.00354 11.3319 4.00434C11.5077 4.00514 11.676 4.0753 11.8003 4.19957C11.9245 4.32384 11.9947 4.49216 11.9955 4.66791C11.9963 4.84365 11.9277 5.0126 11.8045 5.13799L5.13786 11.8047C5.07604 11.8667 5.00257 11.9158 4.92169 11.9494C4.8408 11.9829 4.75408 12.0001 4.66652 12Z" fill="white"/>
<path d="M11.3329 12C11.2453 12.0001 11.1586 11.9829 11.0777 11.9494C10.9968 11.9158 10.9234 11.8667 10.8616 11.8047L4.1949 5.13799C4.07176 5.0126 4.00312 4.84365 4.00391 4.66791C4.00471 4.49216 4.07488 4.32384 4.19915 4.19957C4.32342 4.0753 4.49174 4.00514 4.66748 4.00434C4.84322 4.00354 5.01217 4.07218 5.13756 4.19532L11.8042 10.862C11.8974 10.9552 11.9609 11.074 11.9866 11.2033C12.0123 11.3326 11.9991 11.4666 11.9487 11.5884C11.8982 11.7102 11.8128 11.8143 11.7032 11.8876C11.5936 11.9608 11.4647 12 11.3329 12Z" fill="white"/>
</svg>`,
          classNotify: 'notify-danger'
        }
        this.$store.commit(INDEX_SET_ERROR, { show: false, text: '' })
        // eslint-disable-next-line no-return-assign
        this.timeout = setTimeout(() => this.notification.show = false, this.timeHide)
      }
    },
    notifyWarning() {
      if (this.notifyWarning.text) {
        this.close()
        clearTimeout(this.timeout)
        this.notification = {
          ...this.notifyWarning,
          type: 'warning',
          bIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.16699 11.6667C8.16699 11.9428 7.94314 12.1667 7.66699 12.1667C7.39085 12.1667 7.16699 11.9428 7.16699 11.6667C7.16699 11.3905 7.39085 11.1667 7.66699 11.1667C7.94314 11.1667 8.16699 11.3905 8.16699 11.6667Z" fill="white" stroke="white"/>
<rect x="6.66699" y="2.66666" width="2" height="6.66667" rx="1" fill="white"/>
</svg>
`,
          classNotify: 'notify-warning'
        }
        this.$store.commit(INDEX_SET_WARNING, { show: false, text: '' })
        // eslint-disable-next-line no-return-assign
        this.timeout = setTimeout(() => this.notification.show = false, this.timeHide)
      }
    }
  },

  beforeDestroy() {
    clearTimeout(this.timeout)
  },

  methods: {
    close() {
      clearTimeout(this.timeout)
      this.notification.show = false
    }
  }
}
</script>
