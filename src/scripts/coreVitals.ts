import { createApp } from "vue";
import CoreVitalsApp from "../Views/CoreVitals/CoreVitalsApp.vue";

/* Added a service worker to implement caching capabilities using workbox */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

createApp(CoreVitalsApp).mount("#app");
