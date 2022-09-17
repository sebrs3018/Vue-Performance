<template>
  <div id="app">
    <success-modal v-if="success === true" />
    <button @click="success = true">click me!</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
export default defineComponent({
  name: "App",
  components: {
    "success-modal": defineAsyncComponent(() =>
      import("./components/SuccesModal.vue")
    ),
  },
  data() {
    return {
      success: null,
    } as { success: boolean | null };
  },
});
</script>

<style></style>
