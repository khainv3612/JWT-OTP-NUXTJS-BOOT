<template>
  <div>
    <div v-if="step===1" class="fill-info">
      <div class="login register login-mobile">
        <h5 class="title">{{ $t('account.register') }}</h5>
        <el-form
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          label-width="200px"
          autocomplete="off"
          label-position="left"
          @keyup.enter.native="register"
        >
          <el-form-item
            class="email-login"
            :label="$t('account.email')"
            prop="email"
            :error="getErrResponse('email')">
            <el-input
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
          <el-form-item
            class="email-login"
            :label="$t('account.phoneNumber')"
            prop="phoneNumber"
            :error="getErrResponse('phone')">
            <el-input
              ref="phoneNumber"
              v-model.trim="accountForm.phoneNumber"
              class="clear-arrow-number"
              :placeholder="$t('account.phoneNumber')"
              name="phoneNumber"
              type="text" maxlength="15" oninput="this.value=this.value.replace(/[^0-9]/g,'');"
              tabindex="3"
              @focus="resetValidate('phoneNumber')">
              <el-autocomplete
                slot="prepend" ref="pre_phone"
                v-model.trim="accountForm.preCodePhone"
                class="inline-input dropdown-phone code-phone"
                :highlight-first-item="true"
                :fetch-suggestions="querySearch"
                placeholder="Code" oninput="this.value=this.value.replace(/[^+0-9]/g,'');"
                aria-expanded="true" @focus="handelClickPhone()"
                @blur="isEditing=false">
                <template slot="prefix">
                  <img class="img-arrow" src="~/assets/icons/Vector.svg"/>
                </template>
              </el-autocomplete>
            </el-input>
          </el-form-item>
          <el-form-item
            class="email-login" :label="$t('account.fullName')" prop="fullName"
            :error="getErrResponse('fullName')">
            <el-input
              ref="fullName"
              v-model="accountForm.fullName"
              :placeholder="$t('account.fullName')"
              name="fullName"
              type="text"
              tabindex="3"
              maxlength="50"
              autocomplete="off"
              @focus="resetValidate('fullName')"
            />
          </el-form-item>
          <el-form-item
            class="email-login" :label="$t('account.password')" prop="password"
            :error="getErrResponse('password')">
            <el-input
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
              <i slot="suffix" class="cursor-pointer" @click="displayPass('pass')">
                <img v-if="showPass" class="icon-show-pass" src="~/assets/icons/eye.svg" alt="showpass"/>
                <img v-else class="icon-show-pass" src="~/assets/icons/hide.svg" alt="hidepass"/>
              </i>
            </el-input>
          </el-form-item>
          <el-form-item
            class="email-login" :label="$t('account.password_confirmation')" prop="password_confirmation"
            :error="getErrResponse('password_confirmation')">
            <el-input
              ref="password_confirmation"
              v-model="accountForm.password_confirmation"
              :placeholder="$t('account.password_confirmation')"
              name="password_confirmation"
              :type="showPassConfirm?'text':'password'"
              tabindex="3"
              maxlength="32"
              autocomplete="off"
              @focus="resetValidate('password_confirmation')"
            >
              <i slot="suffix" class="cursor-pointer" @click="displayPass('passConfirm')">
                <img v-if="showPassConfirm" class="icon-show-pass" src="~/assets/icons/eye.svg" alt="showpass"/>
                <img v-else class="icon-show-pass" src="~/assets/icons/hide.svg" alt="hidepass"/>
              </i>
            </el-input>
          </el-form-item>
          <el-form-item
            class="email-login" :label="$t('account.referral_code')" prop="referral_code"
            :error="getErrResponse('referral_code')">
            <el-input
              ref="referral_code"
              v-model="accountForm.referral_code"
              :placeholder="$t('account.referral_code')"
              name="referral_code"
              type="text"
              tabindex="3"
              maxlength="32"
              autocomplete="off"
              @focus="resetValidate('referral_code')"
            />
          </el-form-item>
          <el-form-item prop="agree">
            <div class="content">
              <el-row :gutter="21">
                <el-col :span="1">
                  <el-checkbox
                    ref="agree"
                    v-model="accountForm.agree"
                    @change="$refs.accountForm.validateField('agree')"></el-checkbox>
                </el-col>
                <el-col :span="21">
                  <span>{{ $t('register.preAgree') }}</span>
                  <span class="color-red cursor-pointer">{{ $t('register.term') }}</span>
                  <span class="">{{ $t('register.and') }}</span>
                  <span class="color-red cursor-pointer">{{ $t('register.policy') }}</span>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item class="captcha" :error="getErrResponse('g-recaptcha-response')" prop="captcha">
            <template>
              <recaptcha
                ref="captcha"
                @error="onError"
                @success="onSuccess"
                @expired="onExpired"
              />
            </template>
          </el-form-item>
          <el-form-item class="pd-t-20">
            <div :class="{'disabled' : disabledButton, 'login-button': 'login-button'}">
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                :loading="loading"
                :disabled="disabledButton"
                type="danger"
                @click.native.prevent="register"
              >
                {{ $t('account.register') }}
              </el-button>
            </div>
            <div class="d-flex align-items-center pd-t-20">
              <router-link to="/login" class="content login-page__forgot-password align-items-center color-red">
                {{ $t('register.back_signin') }}
              </router-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="step===2" class="otp">
      <otp-page :type="typeVerify" :token="token" :user_register="user"></otp-page>
    </div>
  </div>
</template>
<script>
import {
  AUTH_REGISTER,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  SET_EMAIL, USER_GET_PREPHONE
} from '@/store/store.const'
import { TYPE_REGISTER_OTP } from '@/constants/store'
import OtpPage from '@/components/auth/otp'
import { validEmail, validPassword } from '@/utils/validate'

export default {
  name: 'RegisterPage',
  components: { OtpPage },
  middleware: 'auth-guard',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (this.isEditing) {
        setTimeout(() => {
          validateFullPhone(rule, value, callback)
        }, 200)
      } else {
        validateFullPhone(rule, value, callback)
      }
    }
    const validateFullPhone = (rule, value, callback) => {
      if (this.accountForm.preCodePhone === '') {
        callback(new Error(this.$t('validation.required', { _field_: this.$t('account.pre_phone') }).toString()))
      } else if (!/^[\\+]{1}[0-9]{2,}/g.test(this.accountForm.preCodePhone)) {
        this.accountForm.preCodePhone = ''
        callback(new Error(this.$t('validation.code_phone_format')))
      }
      if (value === '') {
        callback(new Error(this.$t('validation.required', { _field_: this.$t('account.phoneNumber') }).toString()))
      } else if (this.accountForm.phoneNumber.length < 9 || this.accountForm.phoneNumber.length > 15) {
        callback(new Error(this.$t('validation.length_phone')))
      }
      callback()
    }
    const validdateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error(this.$t('validation.email_format')))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validation.required', { _field_: this.$t('account.password') }).toString()))
      } else {
        if (!validPassword(value)) {
          callback(new Error(this.$t('validation.pass_format')))
        }
        if (this.accountForm.password_confirmation !== '') {
          this.$refs.accountForm.validateField('password_confirmation')
        }
        callback()
      }
    }
    const validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validation.required', { _field_: this.$t('account.password') }).toString()))
      } else if (value !== this.accountForm.password) {
        callback(new Error(this.$t('validation.passNotMatch').toString()))
      } else {
        callback()
      }
    }
    const validateAgree = (rule, value, callback) => {
      if (this.accountForm.agree == null || !this.accountForm.agree) {
        callback(new Error(this.$t('validation.agree')))
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
      typeVerify: TYPE_REGISTER_OTP,
      token: '',
      captcha: '',
      isCaptchaExpireOrError: false,
      user: {},
      step: 1,
      accountForm: {
        email: '',
        phoneNumber: '',
        fullName: '',
        preCodePhone: '+84',
        password: '',
        password_confirmation: '',
        referral_code: '',
        agree: false,
        errors: {}
      },
      errorResponse: [],
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
        phoneNumber: [
          { validator: validatePhone, trigger: 'blur' },
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.phoneNumber') }),
            trigger: 'blur'
          }
        ],
        fullName: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.fullName') }),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.password') }),
            trigger: 'blur'
          },
          { validator: validatePass, trigger: 'blur' }
        ],
        password_confirmation: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.password_confirmation') }),
            trigger: 'blur'
          },
          {
            validator: validateConfirmPass,
            message: this.$t('validation.passNotMatch'),
            trigger: 'blur'
          }
        ],
        referral_code: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.referral_code') }),
            trigger: 'blur'
          }
        ],
        agree: [
          {
            validator: validateAgree, trigger: 'blur'
          }
        ],
        captcha: [
          {
            validator: validateCaptcha, trigger: 'blur'
          }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      preCodePhone: '',
      codePhones: [],
      isValid: false,
      isMounted: false,
      showPass: false,
      showPassConfirm: false,
      isEditing: true,
      isCLickPhone: false
    }
  },
  computed: {
    disabledButton() {
      if (!this.isMounted) {
        return
      }
      return this.accountForm.email === '' || this.accountForm.password === '' ||
        this.accountForm.fullName === '' || this.accountForm.password_confirmation === '' ||
        this.accountForm.phoneNumber === '' || this.accountForm.preCodePhone === '' ||
        this.accountForm.referral_code === '' ||
        !this.accountForm.agree || this.captcha === ''
    }
  },
  created() {
    if (this.$route.query.code) {
      this.accountForm.referral_code = this.$route.query.code
    }
  },
  mounted() {
    this.isMounted = true
    this.getPrePhone()
  },
  methods: {
    resetValidate(ref) {
      if (ref === this.error.key) {
        this.error = { key: null, value: '' }
      }
      this.$refs.accountForm.fields.find((f) => f.prop === ref).clearValidate()
      this.accountForm.errors[ref] = ''
    },
    async register() {
      this.errorResponse = []
      this.isEditing = false
      this.error = { key: null, value: '' }
      await this.validateForm()
      if (!this.isValid) {
        return
      }
      try {
        await this.$store.commit(INDEX_SET_LOADING, true)
        if (this.captcha == null || !this.captcha) {
          const token = await this.$recaptcha.getResponse()
          this.captcha = token.toString()
        }
        const dto = {
          email: this.accountForm.email,
          name: this.accountForm.fullName,
          phone: parseInt(this.accountForm.phoneNumber.toString()).toString(),
          password: this.accountForm.password,
          password_confirmation: this.accountForm.password_confirmation,
          referral_code: this.accountForm.referral_code,
          country_phone: this.accountForm.preCodePhone
        }
        const data = await this.$store.dispatch(AUTH_REGISTER, {
          ...dto,
          'g-recaptcha-response': this.captcha
        })
        switch (data.status_code) {
          case 200:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.$store.commit(SET_EMAIL, this.accountForm.email)
            this.token = data.data.token
            this.user = { ...dto, 'g-recaptcha-response': this.captcha }
            this.step = 2
            break
          case 422:
            for (const [k] of Object.entries(data.data)) {
              this.error = { key: k, value: data.data[k][0] }
              this.errorResponse.push({ key: k, value: data.data[k][0] })
            }
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
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async validateForm() {
      await this.$refs.accountForm.validate(async valid => {
        this.isValid = (await valid && this.accountForm.agree)
      })
    },
    displayPass(type) {
      if (type === 'pass') {
        this.showPass = !this.showPass
      } else {
        this.showPassConfirm = !this.showPassConfirm
      }
    },
    async getPrePhone() {
      try {
        const data = await this.$store.dispatch(USER_GET_PREPHONE)
        switch (data.status_code) {
          case 200:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.convertCodePhone(data.data.country_phone)
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
            break
        }
      } catch (err) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
      }
    },
    convertCodePhone(data) {
      for (const codePhone in data) {
        this.codePhones.push({
          code: codePhone,
          value: data[codePhone]
        })
      }
    },
    querySearch(queryString, cb) {
      if (this.isCLickPhone) {
        queryString = ''
        this.isCLickPhone = false
      }
      const results = queryString ? this.codePhones.filter(this.createFilter(queryString)) : this.codePhones
      cb(results)
    },
    createFilter(queryString) {
      return (code) => {
        return (code.value.toLowerCase().includes(queryString.toLowerCase()))
      }
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
    },
    handelClickPhone() {
      this.resetValidate('phoneNumber')
      this.isCLickPhone = true
      this.isEditing = true
    },
    getErrResponse(key) {
      let result = ''
      if (this.errorResponse == null || this.errorResponse.length === 0) {
        return
      }
      this.errorResponse.forEach(err => {
        if (err.key === key) {
          result = err.value
          return false
        }
      })
      return result
    }
  }
}
</script>
