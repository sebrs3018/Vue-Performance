import { createApp } from "vue";
import CoreVitals from "../Views/CoreVitals/CoreVitals.vue";

/* Added a service worker to implement caching capabilities using workbox */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

createApp(CoreVitals).mount("#app");
