<template>
  <div>
    <div class="header" :class="[$auth.loggedIn?'bg-default box-shadow-header':'bg-anonymous']">
      <div class="container-header container-header-mobile">
        <template v-if="$auth.loggedIn">
          <template v-if="!$device.isMobile">
            <div class="image-favicon cursor-pointer" @click="$router.push('/overview')">
              <el-image
                src="favicon.png" alt="SBDragon"/>
            </div>
            <div :class="['tab-list', { active: ($route.path === '/overview') }]" @click="$router.push('/overview')">
              <span>{{ $t('header.overview') }}</span>
            </div>
            <div :class="['tab-list', { active: ($route.path === '/plans') }]" @click="$router.push('/plans')">
              <span>{{ $t('header.plans') }}</span>
            </div>
            <div :class="['tab-list', { active: ($route.path === '/node-network') }]"
                 @click="$router.push('/node-network')">
              <span>{{ $t('header.node_network') }}</span>
            </div>
            <div :class="['tab-list', { active: ($route.path === '/wallet') }]" @click="$router.push('/wallet')">
              <span>{{ $t('header.wallet') }}</span>
            </div>
          </template>
          <template>
            <div class="tab-list d-flex">
              <div class="withdrawable-balance" :class="{'font-size-mobile':$device.isMobile}">
                <span v-if="$device.isMobile">{{ user.name }}</span>
                <span v-else>{{ $t('header.withdrawable_balance') }}</span>
                <span class="coin">{{ user.balance_format + ' ~ ' + user.balance_usd_format }}</span>
              </div>
              <el-dropdown ref="test" class="cursor-pointer" trigger="click" :hide-on-click="isHideDrop">
                <div class="user-detail">
                  <div>
                    <img v-if="user.avatar_thumb!=null" class="avatar" :src="user.avatar_thumb" alt="">
                    <img v-else src="~/assets/images/avatar.svg" alt="" class="image-avatar">
                  </div>
                  <div v-if="!$device.isMobile">
                    <span class="username">{{ user.name }}</span>
                  </div>
                </div>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown-language">
                    <el-dropdown-item v-for="(plugin, index) in listPlugins" :key="index" :command="index">
                      <div v-if="plugin.id===3 && $device.isMobile" class="dropdown-language-inner"
                           style="height: 36px;">
                        <el-dropdown class="cursor-pointer" trigger="click" placement="bottom"
                        >
                          <div class="select-language d-flex" @click="isHideDrop=false">
                            <img :src="plugin.icon" alt="">
                            <div class="language-name pd-l-10">
                              <span>
                                {{ plugin.name }}
                              </span>
                            </div>
                            <img class="image-dropdown" src="~/assets/icons/arrow-down-bold.svg" alt="">
                          </div>
                          <template #dropdown>
                            <el-dropdown-menu class="margin-right-drop">
                              <el-dropdown-item v-for="(language,index) in listLanguage" :key="index" :command="index">
                                <div class="select-language d-flex" @click="changeLanguage(language)">
                                  <img :src="language.icon" alt="">
                                  <div class="language-name pd-l-10">{{ language.name }}</div>
                                </div>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </div>
                      <div v-else-if="plugin.id!==3" class="select-language d-flex" @click="redirectNavbar(plugin)">
                        <img :src="plugin.icon" alt="">
                        <div class="language-name pd-l-10">{{ plugin.name }}</div>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>

              </el-dropdown>
            </div>
          </template>
        </template>
        <div :hidden="$auth.loggedIn&&$device.isMobile" class="tab-list" :class="$auth.loggedIn?'':'change-language'">
          <el-dropdown class="cursor-pointer d-flex" trigger="click">
            <span class="el-dropdown-link">
              <img class="image-language" :src="languageActive.icon" alt="">
              <img class="image-dropdown" src="~/assets/icons/arrow-down-bold.svg" alt="">
            </span>
            <template #dropdown>
              <el-dropdown-menu class="dropdown-language">
                <el-dropdown-item v-for="(language, index) in listLanguage" :key="index" :command="index">
                  <div class="select-language d-flex" @click="changeLanguage(language)">
                    <img :src="language.icon" alt="">
                    <div class="language-name pd-l-10">{{ language.name }}</div>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HeaderCommon',
  data() {
    return {
      keyword: '',
      showModal: false,
      hideModal: false,
      cartCount: 0,
      user: this.$auth.loggedIn ? this.$auth.user : {
        cover_img_url: '',
        id: '',
        username: '',
        profile_detail: ''
      },
      logo: require('~/assets/images/Logo.svg'),
      modalLogin: false,
      modalState: 'login',
      titleRegister: this.$t('register_account'),
      titleForgot: this.$t('account.forgot_password'),
      languageActive: {
        id: 1,
        name: 'English',
        icon: require('~/assets/images/english.svg')
      },
      listLanguage: [
        {
          id: 1,
          name: 'English',
          lang: 'en',
          icon: require('~/assets/images/english.svg')
        },
        {
          id: 2,
          name: 'Tiếng Việt',
          lang: 'vi',
          icon: require('~/assets/images/vietnam.svg')
        }
      ],
      listPlugins: [
        {
          id: 1,
          name: this.$t('navbar.acc_setting'),
          link: '/user/profile?type=0',
          icon: require('~/assets/images/account.svg')
        },
        {
          id: 2,
          name: this.$t('navbar.change_pass'),
          link: '/user/profile?type=1',
          icon: require('~/assets/images/key.svg')
        },
        {
          id: 3,
          name: this.$t('navbar.language'),
          link: '',
          icon: require('~/assets/images/language.svg')
        },
        {
          id: 4,
          name: this.$t('navbar.FAQ'),
          link: '/faq',
          icon: require('~/assets/images/help.svg')
        },
        {
          id: 4,
          name: this.$t('navbar.logout'),
          link: '/logout',
          icon: require('~/assets/images/log-out.svg')
        }
      ],
      showProfile: false,
      dialogAddFund: false,
      drawer: false,
      priceSell: '',
      stepState: 1,
      chooseNavbar: true,
      isHideDrop: true
    }
  },
  watch: {
    '$auth.user': {
      handler() {
        this.user = this.$auth.loggedIn ? this.$auth.user : {
          cover_img_url: '',
          id: '',
          username: '',
          profile_detail: ''
        }
      },
      deep: true
    },
    '$route.query.search'(val) {
      this.keyword = val
    }
  },
  created() {
    const dataLanguage = this.$cookies.get('lang') || 'en'
    this.keyword = this.$route.query.search
    this.languageActive = this.listLanguage.find(item => item.lang === dataLanguage)
    if (!this.languageActive) {
      this.languageActive = this.listLanguage.find(item => item.lang === 'en')
    }
  },
  methods: {
    searchKeyword() {
      const data = this.keyword
      this.keyword = ''
      this.$router.push({ path: '/search', query: { search: data }})
    },
    async changeToLink(link) {
      await this.$router.push(link)
    },
    redirectHome() {
      if (this.$route.path !== '/') {
        this.$router.push('/')
      } else {
        window.location.reload()
      }
    },
    changeLanguage(language) {
      if (this.$i18n.locale !== language.lang) {
        this.$i18n.locale = language.lang
        this.languageActive = language
        this.$cookies.set('lang', language.lang)
        window.location.reload()
      }
    },
    redirectNavbar(plugin) {
      this.isHideDrop = true
      this.$router.push(plugin.link)
    },
    setUsername() {
      this.$router.push('/profile')
    },
    copyAddress() {
      this.$notify.success({
        title: this.$t('common.copy_success'),
        customClass: 'el-notification-success',
        onClick: () => {
          this.showChat = true
        }
      })
    },
    addFund() {
      this.dialogAddFund = true
    },
    changePrice(value) {
      this.priceSell = value.price
      this.stepState = value.step
    },
    handleClose() {
      if ((this.priceSell !== '')) {
        this.$confirm((this.stepState === 1) ? this.$t('nft.confirm_close_sell') : this.$t('nft.confirm_close_credit'),
          this.$t('header.add_fund'),
          {
            cancelButtonText: this.$t('button.cancel'),
            dangerouslyUseHTMLString: true
          })
          .then(_ => {
            this.dialogAddFund = false
          })
          .catch(_ => {
          })
      } else {
        this.dialogAddFund = false
      }
    },
    createItem() {
      if (this.$auth.loggedIn) {
        this.$router.push('/nft/register')
      } else {
        this.$router.push('/connect_wallet')
      }
    }
  }
}
</script>
