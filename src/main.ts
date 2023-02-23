import { createApp } from "vue";
import App from "./MainApp.vue";
import "./assets/tailwind.css";

/* Added a service worker to implement caching capabilities using workbox */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

createApp(App).mount("#app");
