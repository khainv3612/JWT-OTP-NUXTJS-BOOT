<template>
  <footer class="footer">
    <div class="home_service home_background">
      <div class="container-footer ">
        <div class="footer-left">
          <img src="/assets/images/page.svg" alt="">
          <div>
            <div v-for="(menu, index) in listMenuLeft" :key="index">
              <router-link :to="menu.link">
                <span class="menu_item_footer">{{ menu.title }}</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="footer-right">
          <div class="title_product_footer">
          <span>
            {{ $t('home.footer.list_product') }}
          </span>
          </div>
          <div class="list_product_footer">
            <div v-for="(product, index) in listMenu" :key="index" class="product_item_footer">
              <router-link :to="product.link">
                <span class="product_item">{{ product.name }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>{{ $t('home.footer.main') }}</span>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'FooterCommon',
  // eslint-disable-next-line vue/require-prop-types
  props: ['listMenu'],
  data() {
    return {
      listMenuLeft: [
        {
          key: 'introduction',
          title: this.$t('home.footer.introduction'),
          link: '/'
        },
        {
          key: 'contact_customer',
          title: this.$t('home.footer.contact_customer'),
          link: '/'
        },
        {
          key: 'privacy',
          title: this.$t('home.footer.privacy'),
          link: '/'
        },
        {
          key: 'refund',
          title: this.$t('home.footer.refund'),
          link: '/'
        },
        {
          key: 'store',
          title: this.$t('home.footer.store'),
          link: '/'
        },
        {
          key: 'insurance',
          title: this.$t('home.footer.insurance'),
          link: '/'
        }
      ]
    }
  }
}
</script>
