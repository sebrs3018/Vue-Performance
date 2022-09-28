<script lang="ts" setup>
//import useValidatorState from "../components/Mixins/ValidatorMixin";
import {
  defineComponent,
  ref,
  onBeforeMount,
  watch,
  computed,
  nextTick,
} from "vue";

interface BaseCheckboxProps {
  validator?: any;
  hasError?: boolean;
  customWrapperClasses?: string;
  customLabelClasses?: string;
  value?: boolean;
}

const props = withDefaults(defineProps<BaseCheckboxProps>(), {
  customWrapperClasses: "form-group mb-0",
  customLabelClasses: "",
  value: false,
  hasError: false,
});

const emits = defineEmits<{
  (e: "input", payload: boolean): void;
}>();

//const checkboxValue = ref(false);

onBeforeMount(() => {
  console.log(props.validator);
  //Syncing the prop starter value with the inner component value
  //checkboxValue.value = props.value;
});

function hasError() {
  console.log("BasCheckbox registere a validation erro1x");
  return props.validator?.$error;
}
const required = () => !!props.validator?.required;

function handleChange(event: Event) {
  console.log("handleChanging and sending...", { val: props.value });
  //Toggling!
  //checkboxValue.value = !checkboxValue.value;
  emits("input", !props.value);
}
</script>
<template>
  <div :class="customWrapperClasses" @click="handleChange">
    <input
      :id="$attrs.id"
      type="checkbox"
      :name="$attrs.name"
      :class="hasError() ? 'has-error' : ''"
      :checked="value"
    />
    <label
      :class="[
        required() ? 'label-required' : '',
        'f-12 f-sm-14',
        customLabelClasses,
      ]"
      :for="$attrs.id"
    >
      <slot name="label"></slot>
    </label>
  </div>
</template>
<style scoped>
.has-error {
  color: red;
}
</style>
