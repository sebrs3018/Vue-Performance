<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import IntersectionObserver from "@/components/IntersectionObserver.vue";
import IntersectionObservable from "@/components/IntersectionObservable.vue";

const CoreVitals = defineAsyncComponent(() => import("./CoreVitals.vue"));

const showCoreVitalsApp = ref(false);
const handleIntersection = () => {
  console.log("handleIntersection", showCoreVitalsApp.value);
  showCoreVitalsApp.value = true;
};
</script>
<template>
  <IntersectionObserver @intersection="handleIntersection">
    <template #observer="{ observer }">
      <IntersectionObservable :observer="observer">
        <template #observable>
          <!-- In order to correctly lazy load this component, we need to set 
            a visible element which can intersect with the viewport!
         -->
          <div style="height: 50px"></div>
          <CoreVitals v-if="showCoreVitalsApp" />
        </template>
      </IntersectionObservable>
    </template>
  </IntersectionObserver>
</template>
