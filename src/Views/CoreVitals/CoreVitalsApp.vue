<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";

import IntersectionObserver from "@/components/IntersectionObserver.vue";
import IntersectionObservable from "@/components/IntersectionObservable.vue";

const CoreVitals = defineAsyncComponent(() => import("./CoreVitals.vue"));
</script>
<template>
  <IntersectionObserver>
    <template #observer="{ observer, isVisible }">
      <IntersectionObservable :observer="observer" :isVisible="isVisible">
        <template #observable>
          <!-- In order to correctly lazy load this component, we need to set 
            a visible element which can intersect with the viewport!
         -->
          <div v-if="!isVisible" ref="mock" style="height: 50px"></div>
          <CoreVitals v-if="isVisible" />
        </template>
      </IntersectionObservable>
    </template>
  </IntersectionObserver>
</template>
