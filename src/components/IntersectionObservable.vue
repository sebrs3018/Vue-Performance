<script lang="ts" setup>
import { onMounted, ref } from "vue";
const props = defineProps<{ observer: IntersectionObserver | null }>();

//IMP: when we try to get a reference to an element, the name of the variable must natch with the one we are refering to
const root = ref<HTMLElement | null>(null);

onMounted(() => {
  console.log({ observer: props.observer });
  //Now we are telling the observer to watch this component!
  props.observer?.observe(root.value as HTMLElement);
});
</script>
<template>
  <div ref="root">
    <slot name="observable" />
  </div>
</template>
