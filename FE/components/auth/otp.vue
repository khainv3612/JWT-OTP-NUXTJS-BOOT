<template>
  <div class="login otp login-mobile">
    <h5 class="title">{{ $t('account.security_verification') }}</h5>
    <h5 class="sub-title sub-title-mobile">{{ $t('account.secure_your_account') }}</h5>
    <el-form
      ref="otpForm"
      style="padding-top: 10px"
      :model="otpForm"
      :rules="otpRules"
      label-width="200px"
      autocomplete="off"
      label-position="left"
      @keyup.enter.native="submit"
    >
      <el-form-item class="" :label="$t('otp.code')" prop="">
        <br/>
        <div class="" style="text-align: center;">
          <el-input
            v-for="index in lengthCode" :ref="'code-'+index" :key="index" v-model="otpForm.verifyCode[index-1]"
            name="code" type="text" oninput="this.value=this.value.replace(/[^0-9]/g,'');"
            :class="{'mg-3':(index!=1&&index!=lengthCode), 'mg-r-3':index==1,'mg-l-3':index==lengthCode}"
            class='input-code input-code-mobile' maxlength="1" @paste.native="handlePaste($event,index)"
            @keyup.native="handleCode(index, $event)"/>
          <div style="text-align: left" class="code-sent-email">
            <span class="notify-sent">{{ $t('otp.notifySent', { email: hideEmail }) }}</span>
          </div>
        </div>
        <span class="resend">
          <span>{{ $t('otp.notReceived') }}</span> <span v-if="!isExpire">{{ $t('otp.reqCode', { time: countTime }) }}</span>
          <span v-else class="color-red cursor-pointer" @click="resendOtp">{{ $t('otp.resendCode') }}</span>
        </span>
      </el-form-item>

      <el-form-item>
        <div :class="{'disabled' : disabledButton, 'login-button': 'login-button'}">
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            :disabled="disabledButton"
            :loading="loading"
            type="danger"
            @click.native.prevent="submit"
          >
            {{ $t('otp.submit') }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import {
  AUTH_RESEND_OTP,
  AUTH_VERIFY_REGISTER_OTP,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  LENGTH_CODE_OTP,
  OTP_EXPIRE, SET_IS_OPT_PAGE
} from '@/store/store.const'
import { TYPE_LOGIN_OTP } from '@/constants/store'

export default {
  name: 'OtpPage',
  // eslint-disable-next-line vue/require-prop-types,vue/prop-name-casing
  props: ['type', 'token', 'user_register', 'user_login'],
  data() {
    return {
      otpForm: {
        verifyCode: [],
        errors: {}
      },
      lengthCode: LENGTH_CODE_OTP,
      error: {
        key: null,
        value: ''
      },
      otpRules: {
        verifyCode: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('otp.error') }),
            trigger: 'blur'
          }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      countTime: OTP_EXPIRE,
      isExpire: false,
      tokenLocal: ''
    }
  },
  computed: {
    ...mapState(['email']),
    disabledButton() {
      if (this.otpForm.verifyCode.length < LENGTH_CODE_OTP) {
        return true
      }
      for (let i = 0; i < this.otpForm.verifyCode.length; i++) {
        if (this.otpForm.verifyCode[i] == null || !this.otpForm.verifyCode[i].toString().trim()) {
          return true
        }
      }
      return false
    },
    hideEmail() {
      let email = this.email
      if (this.email == null) {
        email = 'abcd@gmail.com'
      }
      let count = 0
      return email.replace(/(.{2})(.*)(?=@)/,
        function(gp1, gp2, gp3) {
          for (let i = 0; i < gp3.length; i++) {
            if (count < 10) {
              count++
              gp2 += '*'
            } else {
              return gp2
            }
          }
          return gp2
        })
    }
  },
  created() {
    this.tokenLocal = this.token
    this.$store.commit(SET_IS_OPT_PAGE, true)
    this.checkExpire()
  },
  methods: {
    resetValidate(ref) {
      if (ref === this.error.key) {
        this.error = { key: null, value: '' }
      }
      this.$refs.otpForm.fields.find((f) => f.prop === ref).clearValidate()
      this.otpForm.errors[ref] = ''
    },
    submit() {
      this.error = { key: null, value: '' }
      if (this.disabledButton) {
        return
      }
      this.$refs.otpForm.validate(async valid => {
        if (valid) {
          try {
            await this.$store.commit(INDEX_SET_LOADING, true)
            let { result } = {}
            if (this.type === TYPE_LOGIN_OTP) {
              result = await this.$auth.loginWith('local', {
                data: {
                  email: this.email,
                  token: this.tokenLocal,
                  code: this.getOtp()
                }
              })
            } else {
              result = await this.$store.dispatch(AUTH_VERIFY_REGISTER_OTP, {
                ...this.user_register,
                code: this.getOtp(),
                token: this.tokenLocal
              })
            }
            let data = {}
            if (this.type === TYPE_LOGIN_OTP) {
              data = result.data
            } else {
              data = result
            }
            if (data.status_code === 200) {
              await this.$store.commit(SET_IS_OPT_PAGE, false)
              await this.$store.commit(INDEX_SET_SUCCESS, {
                show: true,
                text: data.message
              })
              await this.$router.push('/')
            } else {
              await this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
            }
          } catch (err) {
            await this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
          }
          await this.$store.commit(INDEX_SET_LOADING, false)
        }
      })
    },
    handleCode(index, e) {
      if (e.keyCode === 8 || e.keyCode === 46) {
        if (index > 1 && e.target.value === '') {
          this.$refs['code-' + (Number(index) - 1).toString()][0].focus()
        }
      } else {
        if (!e.target.value.trim()) {
          this.$refs['code-' + (Number(index)).toString()][0].$el.getElementsByTagName('input')[0].value = ''
          return
        }
        const codeBox = this.$refs['code-' + (Number(index)).toString()][0].$el.getElementsByTagName('input')[0]
        if (codeBox.value != null && codeBox.value && !isNaN(e.key)) {
          this.otpForm.verifyCode[index - 1] = Number(e.key)
          codeBox.value = Number(e.key)
        }
        const [first, ...rest] = e.target.value

        this.$refs['code-' + (Number(index)).toString()][0].$el.getElementsByTagName('input')[0].value = e.target.value
        e.target.value = first ?? ''
        const lastInputBox = index === LENGTH_CODE_OTP
        const insertedContent = first !== undefined
        if (insertedContent && !lastInputBox) {
          const nextCode = this.$refs['code-' + (Number(index) + 1).toString()][0]
          nextCode.focus()
          nextCode.$el.value = rest.join('')
        }
      }
    },
    handlePaste(e, index) {
      const data = e.clipboardData.getData('text')
      let count = 0
      for (let i = index, j = 0; i <= this.lengthCode && j < data.length; i++, j++) {
        if (isNaN(data.charAt(j))) {
          --i
          continue
        }
        this.$refs['code-' + (Number(i)).toString()][0].$el.getElementsByTagName('input')[0].value = data.charAt(j)
        this.otpForm.verifyCode[i - 1] = data.charAt(j)
        count = i - 1
        if (count < this.lengthCode) {
          const nextCode = this.$refs['code-' + (Number(count) + 1).toString()][0]
          nextCode.focus()
        }
      }
    },
    async changeModal(state) {
      await this.$emit('change', state)
    },
    checkExpire() {
      this.countTime = Number(OTP_EXPIRE)
      const interval = setInterval(() => {
        this.countTime--
        if (this.countTime < 0) {
          this.isExpire = true
          clearInterval(interval)
        }
      }, 1000)
    },
    async resendOtp() {
      this.error = { key: null, value: '' }
      try {
        this.$store.commit(INDEX_SET_LOADING, true)
        const data = await this.$store.dispatch(AUTH_RESEND_OTP, {
          token: this.tokenLocal
        })
        switch (data.status_code) {
          case 200:
            this.tokenLocal = data.data.token
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            setTimeout(() => {
              this.isExpire = false
              this.checkExpire()
            }, 1000)
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
            break
        }
      } catch (err) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    getOtp() {
      return this.otpForm.verifyCode.join('').toString()
    },
    onlyNumber($event, index) {
      const keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      if ((keyCode < 48 || keyCode > 57)) {
        $event.preventDefault()
      } else {
        this.$refs.optCode[index < 5 ? index + 1 : 5].focus()
      }
    }
  }
}
</script>
