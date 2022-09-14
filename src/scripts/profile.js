import Vue from "vue";
import Profile from "../Views/Profile.vue";

Vue.config.productionTip = false;

/* Added a service worker to implement caching capabilities using workbox */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

new Vue({
  render: (h) => h(Profile),
}).$mount("#profile");
