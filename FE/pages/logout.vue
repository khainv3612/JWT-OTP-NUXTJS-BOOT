<template>
  <div class="logout">
  </div>
</template>

<script>

export default {
  name: 'LogOut',
  async created() {
    await this.$auth.logout()
    await this.$auth.fetchUser()
    await this.$router.push('/')
  }
}
</script>

