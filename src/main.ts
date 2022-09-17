import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

/* Added a service worker to implement caching capabilities using workbox */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

new Vue({
  render: (h) => h(App),
}).$mount("#app");
