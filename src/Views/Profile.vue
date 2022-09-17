<template>
  <div id="mock">
    <h1>Your profile!!!</h1>
    <IntersectionObserver @intersection="isVisible = true">
      <template #observer="observerProps">
        <div id="the-observer" style="height: 2000px">
          <div style="height: 1000px"></div>
          <IntersectionObservable :observer="observerProps.observer">
            <template #observable>
              <!-- <base-box v-if="isVisible" /> -->
              <img
                v-if="isVisible"
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              />
            </template>
          </IntersectionObservable>
        </div>
      </template>
    </IntersectionObserver>
  </div>
</template>
<script>
import IntersectionObserver from "../components/IntersectionObserver.vue";
import IntersectionObservable from "../components/IntersectionObservable.vue";
import { defineAsyncComponent, defineComponent } from "vue";

export default defineComponent({
  name: "Profile",
  components: {
    IntersectionObserver,
    IntersectionObservable,
    "base-box": defineAsyncComponent(() => import("../components/BaseBox.vue")),
  },
  data() {
    return {
      isVisible: false,
    };
  },
});
</script>
