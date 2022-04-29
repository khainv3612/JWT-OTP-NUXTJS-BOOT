<template>
  <transition name="modal-fade">
    <div :id="id" class="modal-default">
      <div
        :class="['modal-content', classModal]"
        :style="{ width: width + 'px', padding: padding }"
      >
        <template v-if="showHeader">
          <header class="modal-header">
            <slot name="header"></slot>
            <img
              v-if="noClose !== true"
              src="/assets/images/icons/close.svg"
              class="btn-close"
              alt=""
              @click="close"
            />
          </header>
        </template>
        <main>
          <slot name="content"></slot>
        </main>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalElement',
  // eslint-disable-next-line vue/require-prop-types
  props: ['width', 'padding', 'classModal', 'height', 'noClose', 'id', 'showHeader', 'showModalState'],
  methods: {
    close() {
      this.$emit('close')
    },
    closeModal() {
      if (this.showModalState) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
