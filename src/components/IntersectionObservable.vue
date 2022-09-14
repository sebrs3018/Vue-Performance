<template>
  <div>
    <slot name="observable" />
  </div>
</template>
<script>
export default {
  props: ["observer"],
  mounted() {
    //NOw we are telling the observer to watch this component!
    this.observer.observe(this.$el);
  },
};
</script>
