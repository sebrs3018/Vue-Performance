<template>
  <div id="app">
    HOME PAGE!
    <modal-regular v-if="status === true" />
    <success-modal v-else-if="status === false" />
  </div>
</template>

<script>
import LoadingComponent from "./components/LoadingComponent.vue";
import ErrorComponent from "./components/ErrorComponent.vue";
export default {
  name: "App",
  components: {
    "modal-regular": () => ({
      /* Lazy loading the component. I could be cool to use prefetching but, unfortunately, safari does not support it... */
      component: import("./components/ModalRegular.vue"),
      loading: LoadingComponent,
      error: ErrorComponent,
      /* By default the delay time before showing the loading component is 200ms */
      delay: 100,
      // Whenever the timeout is exceeded, the errorComponent will be shown!. The default timeout time is INFINITY
      // It is interesting to notice that, whenever the timeout is exceeded, the default component won't be shown and vue will throw a warning!
      timeout: 500,
    }),
    "success-modal": () => import("./components/SuccesModal.vue"),
  },
  data: () => ({
    status: null,
  }),
};
</script>

<style></style>
