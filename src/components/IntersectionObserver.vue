<script lang="ts" setup>
import { reactive, onBeforeMount, onBeforeUnmount, ref, onMounted } from "vue";

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
  isVisible: boolean;
}>({ observer: null, root: null, isVisible: false });

const onElementObserved: IntersectionObserverCallback = (entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      console.log("Yey, it is visible!");
      emits("intersection");
      states.isVisible = true;
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

const observer = ref<HTMLElement | null>(null);

onBeforeMount(() => {
  states.observer = new IntersectionObserver(onElementObserved, {
    root: null, //if the root is null, then we will check if the target is visible in the doc root!
    threshold: 1.0,
  });
});

onMounted(() => {
  console.log("IntersectionObserver onMounted", observer.value);
});

onBeforeUnmount(() => {
  disconnectObserver();
});
</script>
<template>
  <slot
    name="observer"
    :observer="states.observer"
    :is-visible="states.isVisible"
  ></slot>
</template>
