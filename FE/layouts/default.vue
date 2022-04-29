<template>
  <div class="main-page">
    <client-only>
      <HeaderCommon v-show="!isOtpPage" class="navi-bar" style="z-index: 2"/>
      <div class="size-home" :class="{'content-home':$device.isMobile}">
        <div class="notify-common">
          <NotificationBlock class="notify-mobile"/>
        </div>
        <div :class="['home']">
          <nuxt/>
        </div>
        <div v-if="$route.path === '/'">
          <div class="home_background">
            <div class="home_service">
            </div>
          </div>
          <div class="home_service">
          </div>
        </div>
        <LoadingBar/>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingBar from '../components/LoadingBar'
import HeaderCommon from '../components/layout/HeaderCommon'
import NotificationBlock from '../components/block-ui/NotificationBlock'

export default {
  name: 'DefaultLayout',
  components: { LoadingBar, NotificationBlock, HeaderCommon },
  computed: {
    ...mapState(['isOtpPage'])
  }
}
</script>
