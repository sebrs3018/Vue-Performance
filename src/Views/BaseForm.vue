<script lang="ts" setup>
import { reactive, computed, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import BaseInput from "./BaseInput.vue";
import useValidator from "@/Composables/useValidator";
import BaseCheckbox from "@/components/BaseComponents/BaseCheckbox.vue";

const { formGroup, validate } = useValidator(
  {
    firstName: false,
  },
  {
    firstName: {
      hasToBeTrue: (val: boolean) => val,
      required: (val: boolean) => true,
    },
  }
);

const { firstName } = formGroup;

const submitValue = () => {
  // v$.value.$validate();
  const isFormValid = validate();
  console.log({ isFormValid });
};
</script>
<template>
  <div>
    <BaseCheckbox v-model="firstName.value" validator="">
      <template #label> Accetta trattamento dei dati personali </template>
    </BaseCheckbox>
    <button @click="submitValue">submit form</button>
  </div>
</template>
