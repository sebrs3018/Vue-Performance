import { createApp } from "vue";
import Profile from "../Views/Profile.vue";

/* Added a service worker to implement caching capabilities using workbox */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

createApp(Profile).mount("#profile");
