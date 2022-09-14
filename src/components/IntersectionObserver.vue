<template>
  <div>
    <slot name="observer" :observer="observer"></slot>
  </div>
</template>
<script>
export default {
  props: {
    observeOnce: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      observer: null,
    };
  },
  methods: {
    unobserveTarget(target) {
      if (!this.observer) return;
      this.observer.unobserve(target);
    },
    disconnectObserver() {
      if (!this.observer) return;
      this.observer.disconnect();
    },
    onElementObserved(entries) {
      entries.forEach(({ target, isIntersecting }) => {
        // do something ...
        if (isIntersecting) this.$emit("intersection");
        if (this.observeOnce && isIntersecting) this.unobserveTarget(target);
      });
    },
  },
  created() {
    this.observer = new IntersectionObserver(this.onElementObserved, {
      root: this.$el, //The wrapper element to wich the children will intercept
      threshold: 1.0,
    });
  },
  beforeDestroy() {
    this.disconnectObserver();
  },
};
</script>
