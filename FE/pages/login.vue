<template>
  <div>
    <div v-if="step===1" class="fill-info">
      <div class="login login-mobile">
        <h5 class="title">{{ $t('account.login') }}</h5>
        <el-form
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          label-width="200px"
          autocomplete="off"
          label-position="left"
          @keyup.enter.native="login"
        >
          <el-form-item class="email-login" prop="email" :error="(error.key === 'email') ? error.value : ''">
            <label for="email">{{ $t('account.email') }}</label>
            <el-input
              id="email"
              ref="email"
              v-model.trim="accountForm.email"
              :placeholder="$t('account.email')"
              name="email"
              type="text"
              tabindex="2"
              maxlength="255"
              @focus="resetValidate('email')"
            />
          </el-form-item>
          <el-form-item class="email-login" prop="password" :error="(error.key === 'password') ? error.value : ''">
            <label for="password">{{ $t('account.password') }}</label>
            <el-input
              id="password"
              ref="password"
              v-model="accountForm.password"
              :placeholder="$t('account.password')"
              name="password"
              :type="showPass?'text':'password'"
              tabindex="3"
              maxlength="32"
              autocomplete="off"
              @focus="resetValidate('password')"
            >
              <i slot="suffix" class="cursor-pointer" @click="displayPass()">
                <img v-if="showPass" class="icon-show-pass" src="~/assets/icons/eye.svg" alt="showpass"/>
                <img v-else class="icon-show-pass" src="~/assets/icons/hide.svg" alt="hidepass"/>
              </i>
            </el-input>
          </el-form-item>

          <el-form-item :error="(error.key === 'g-recaptcha-response') ? error.value : ''" prop="captcha">
            <template>
              <recaptcha
                ref="captcha"
                @error="onError"
                @success="onSuccess"
                @expired="onExpired"
              />
            </template>
          </el-form-item>
          <el-form-item>
            <div :class="{'disabled' : disabledButton, 'login-button': 'login-button'}">
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                :loading="loading"
                :disabled="disabledButton"
                type="danger"
                @click.native="login"
              >
                {{ $t('account.login') }}
              </el-button>
            </div>
            <div class="d-flex align-items-center pd-t-20 cursor-pointer">
              <span
                class="content login-page__forgot-password align-items-center color-red" @click="step=3">
                {{ $t('account.forgot_password') }}
              </span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="step===2" class="otp">
      <otp-page :type="typeVerify" :token="token" :user_login="user"></otp-page>
    </div>
    <div v-if="step===3">
      <forgot-pass @reLogin="step=1"></forgot-pass>
    </div>
  </div>
</template>
<script>
import { AUTH_LOGIN, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
import { TYPE_LOGIN_OTP } from '@/constants/store'
import OtpPage from '@/components/auth/otp'
import ForgotPass from '@/components/auth/forgot-password'
import { validEmail } from '@/utils/validate'

export default {
  name: 'LoginPage',
  components: { ForgotPass, OtpPage },
  middleware: 'auth-guard',
  data() {
    const validdateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error(this.$t('validation.email_format')))
      } else {
        callback()
      }
    }

    const validateCaptcha = (rule, value, callback) => {
      if (this.captcha == null || !this.captcha) {
        callback(new Error(this.$t('validation.captcha_req')))
      } else {
        callback()
      }
    }
    return {
      step: 1,
      typeVerify: TYPE_LOGIN_OTP,
      token: '',
      captcha: '',
      isCaptchaExpireOrError: true,
      user: {},
      accountForm: {
        email: '',
        password: '',
        password_new_confirmation: '',
        remember: '',
        errors: {}
      },
      error: {
        key: null,
        value: ''
      },
      accountRules: {
        email: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.email') }),
            trigger: 'blur'
          },
          {
            validator: validdateEmail, trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.password') }),
            trigger: 'blur'
          }
        ],
        captcha: [
          {
            validator: validateCaptcha, trigger: 'blur'
          }
        ],
        remember: []
      },
      valid: false,
      capsToolPasswordTip: false,
      loading: false,
      fullscreenLoading: false,
      showPass: false,
      isValid: false
    }
  },
  computed: {
    disabledButton() {
      return this.accountForm.email === '' || this.accountForm.password === '' || this.captcha === ''
    }
  },
  methods: {
    resetValidate(ref) {
      if (ref === this.error.key) {
        this.error = { key: null, value: '' }
      }
      this.$refs.accountForm.fields.find((f) => f.prop === ref).clearValidate()
      this.accountForm.errors[ref] = ''
    },
    checkCapslock(e, attr) {
      const { key } = e
      this[attr] = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    async login() {
      this.error = { key: null, value: '' }
      this.validateForm()
      if (!this.isValid) {
        return
      }
      try {
        this.$store.commit(INDEX_SET_LOADING, true)
        const token = await this.$recaptcha.getResponse()
        if (this.captcha == null || this.captcha !== token.toString()) {
          this.captcha = token.toString()
        }
        const dto = {
          email: this.accountForm.email,
          password: this.accountForm.password,
          'g-recaptcha-response': this.captcha
        }
        const data = await this.$store.dispatch(AUTH_LOGIN, dto)
        switch (data.status_code) {
          case 200:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.$store.commit(SET_EMAIL, this.accountForm.email)
            this.token = data.data.token
            this.user = dto
            this.step = 2
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
            break
        }
      } catch (err) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
      }
      if (this.isCaptchaExpireOrError) {
        this.captcha = ''
      }
      await this.$recaptcha.reset()
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    validateForm() {
      this.$refs.accountForm.validate(valid => {
        this.isValid = valid
      })
    },
    displayPass() {
      this.showPass = !this.showPass
    },
    async onError() {
      this.isCaptchaExpireOrError = true
      this.captcha = ''
      await this.$recaptcha.reset()
    },
    onSuccess(token) {
      this.isCaptchaExpireOrError = false
      this.captcha = token
      this.resetValidate('captcha')
    },
    async onExpired() {
      this.isCaptchaExpireOrError = true
      this.captcha = ''
      await this.$recaptcha.reset()
    }
  }
}
</script>
<style scoped lang="scss">
.login {
  label {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
  }
}
</style>
