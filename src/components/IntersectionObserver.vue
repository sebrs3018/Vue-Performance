<script lang="ts" setup>
import { reactive, onBeforeMount, onBeforeUnmount } from "vue";

// let notOverridableFunc: (s1: string) => void;

// let overridableFunc: {
//   (s: string): void;
//   //IMP: if we want to use this notation, we have to set the second param as default or optional value
//   (s: string, n: number): void;
// };
// overridableFunc = (s: string): void => {
//   console.log(s)
// }
// overridableFunc = (s: string, n: number = -1): void => {
//   console.log(`${s}${n}`);
// }

const emits = defineEmits<{
  (e: "intersection"): void;
}>();

//IMP: in order to mark a prop as optional, we have to use ts notation and then procede defining its default value
const props = withDefaults(
  defineProps<{ observeOnce?: boolean }>(),
  //The defaults values will expect the default value we declared before
  { observeOnce: true }
);

//IMP: we are using the reactive compiler macro function with object destructuring so we don't have to access to the value
//     prop of the reactive object!
let states = reactive<{
  observer: IntersectionObserver | null;
  root: HTMLElement | null;
}>({ observer: null, root: null });

// let root = ref<HTMLElement | null>(null);

const onElementObserved: IntersectionObserverCallback = (entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    // do something ...
    if (isIntersecting) {
      console.log("Yey, it is visible!");
      emits("intersection");
    }
    if (props.observeOnce && isIntersecting) unobserveTarget(target);
  });
};

function unobserveTarget(target: Element) {
  if (!states.observer) return;
  states.observer.unobserve(target);
}

function disconnectObserver() {
  if (!states.observer) return;
  states.observer.disconnect();
}

//IMP: there is no created hook in composition API... but there is a beforeMount which is similar!
onBeforeMount(() => {
  console.log({ root: states.root });

  states.observer = new IntersectionObserver(onElementObserved, {
    root: null, //if the root is null, then we will check if the target is visible in the doc root!
    threshold: 1.0,
  });
});

onBeforeUnmount(() => {
  disconnectObserver();
});
</script>
<template>
  <div ref="root">
    <slot name="observer" :observer="states.observer"></slot>
  </div>
</template>
