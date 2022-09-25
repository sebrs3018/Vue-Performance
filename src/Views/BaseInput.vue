<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
const emits = defineEmits<{ (e: "input", payload: boolean): void }>();
const props = withDefaults(
  defineProps<{
    value: boolean;
    validator: any;
  }>(),
  { value: false }
);

const curVal = ref(false);
onBeforeMount(() => {
  curVal.value = props.value;
});
function handleInput() {
  curVal.value = !curVal.value;
  emits("input", curVal.value);
}
</script>
<template>
  <div>
    <input type="checkbox" :checked="value" @input="handleInput" />
    <div
      class="input-errors"
      v-for="error of validator.$errors"
      :key="error.$uid"
    >
      <div class="error-msg">{{ error.$message || "error" }}</div>
    </div>
  </div>
</template>
