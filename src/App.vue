<template>
  <div id="app">
    <!-- <success-modal v-if="success === true" />
    <button @click="success = true">click me!</button> -->
    <BaseForm />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import BaseForm from "./Views/BaseForm.vue";
export default defineComponent({
  name: "App",
  components: {
    "success-modal": defineAsyncComponent(
      () => import("./components/SuccesModal.vue")
    ),
    BaseForm,
  },
  data() {
    return {
      success: null,
    } as { success: boolean | null };
  },
});
</script>

<style></style>
