<template>
  <div id="mock">
    <h1>Your profile!!!</h1>
    <!-- <IntersectionObserver @intersection="isVisible = true">
      <template #observer="observerProps"> -->
    <div id="the-observer" style="height: 2000px">
      <div style="height: 1000px"></div>
      <!-- <IntersectionObservable :observer="observerProps.observer"> -->
      <!-- <template #observable> -->
      <base-box />
      <!-- </template> -->
      <!-- </IntersectionObservable> -->
    </div>
    <!-- </template>
    </IntersectionObserver> -->
  </div>
</template>
<script>
//import IntersectionObserver from "../components/IntersectionObserver.vue";
//import IntersectionObservable from "../components/IntersectionObservable.vue";
import { defineAsyncComponent } from "vue";

export default {
  name: "Profile",
  components: {
    //    IntersectionObserver,
    //    IntersectionObservable,
    "base-box": defineAsyncComponent(() => import("../components/BaseBox.vue")),
  },
  data() {
    return {
      isVisible: false,
    };
  },
};
</script>
