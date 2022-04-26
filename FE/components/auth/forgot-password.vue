<template>
  <pass-reset v-if="resentLink"/>
  <div v-else class="login forgot-password login-mobile">
    <h5 class="title">{{ $t('account.forgot_password') }}</h5>
    <h5 class="sub-title">{{ $t('forgot_password.sub_title') }}</h5>
    <el-form
      ref="accountForm"
      style="padding-top: 10px"
      :model="accountForm"
      :rules="accountRules"
      label-width="200px"
      autocomplete="off"
      label-position="left" @submit.native.prevent="submit"
    >
      <el-form-item
        class="email-login" prop="email"
        :error="(error.key === 'email') ? error.value : ''">
        <label for="email">{{ $t('account.email') }}</label>
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
      <el-form-item>
        <div :class="{'disabled' : disabledButton, 'login-button': 'login-button'}">
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            :loading="loading"
            :disabled="disabledButton"
            type="danger"
            @click.native.prevent="submit"
          >
            {{ $t('account.reset_pass') }}
          </el-button>
        </div>
        <div class="d-flex align-items-center pd-t-20 cursor-pointer">
          <span class="content align-items-center color-red" @click="backToSignin">
            {{ $t('register.back_signin') }}
          </span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AUTH_FORGOT_PASSWORD, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS } from '@/store/store.const'
import { validEmail } from '@/utils/validate'

export default {
  name: 'ForgotPass',
  data() {
    const validdateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error(this.$t('validation.email_format')))
      } else {
        callback()
      }
    }
    return {
      accountForm: {
        email: '',
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
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      resentLink: false
    }
  },
  computed: {
    disabledButton() {
      return this.accountForm.email === ''
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
    submit() {
      this.error = { key: null, value: '' }
      this.$refs.accountForm.validate(async valid => {
        if (valid) {
          try {
            await this.$store.commit(INDEX_SET_LOADING, true)
            const data = await this.$store.dispatch(AUTH_FORGOT_PASSWORD, {
              email: this.accountForm.email
            })
            switch (data.status_code) {
              case 200:
                await this.$store.commit(INDEX_SET_SUCCESS, {
                  show: true,
                  text: data.message
                })
                this.resentLink = true
                break
              case 422:
                for (const [key] of Object.entries(data.data)) {
                  this.error = { key, value: data.data[key][0] }
                }
                break
              default:
                await this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
                break
            }
          } catch (err) {
            await this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
          }
          await this.$store.commit(INDEX_SET_LOADING, false)
        }
      })
    },
    async changeModal(state) {
      await this.$emit('change', state)
    },
    backToSignin() {
      this.$emit('reLogin')
    }
  }
}
</script>
<style scoped lang="scss">
.forgot-password {
  .content {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
  }
}

</style>
