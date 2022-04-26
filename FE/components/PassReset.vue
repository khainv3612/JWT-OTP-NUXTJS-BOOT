<template>
  <div class="login forgot-password login-mobile">
    <h5 class="title">{{ $t('forgot_password.sent_notify') }}</h5>
    <h5 class="sub-title">{{ $t('forgot_password.check_mail') }}</h5>
    <div class="d-flex align-items-center pd-t-20 cursor-pointer" @click="backToSignin">
      <span class="content align-items-center color-red">
        {{ $t('register.back_signin') }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PassReset',
  methods: {
    backToSignin() {
      window.location.reload()
    }
  }
}
</script>
