<script lang="ts" setup>
//import useValidatorState from "../components/Mixins/ValidatorMixin";

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

function hasError() {
  const res = props.validator?.$error;
  res && console.log("BaseCheckbox registered an error (validator)");
  return res;
}
const required = () => !!props.validator?.required;

function handleChange(event: Event) {
  //console.log("handleChanging and sending...", { val: props.value });
  //Toggling!
  //checkboxValue.value = !checkboxValue.value;
  emits("input", !props.value);
}
</script>
<template>
  <div :class="customWrapperClasses" @click="handleChange">
    <input
      v-bind="$attrs"
      type="checkbox"
      :class="hasError() ? 'has-error' : ''"
      :checked="value"
    />
    <label
      :class="[
        required() ? 'label-required' : '',
        'f-12 f-sm-14',
        customLabelClasses,
      ]"
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
