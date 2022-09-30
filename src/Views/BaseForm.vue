<script lang="ts" setup>
import { reactive, computed, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import cinput from "@/components/BaseComponents/cinput.vue";
import useValidator from "@/Composables/useValidator";
import BaseCheckbox from "@/components/BaseComponents/BaseCheckbox.vue";

const { formGroup, validate } = useValidator(
  {
    firstName: "",
    privacy: false,
  },
  {
    firstName: {
      required: (val: string) => {
        console.log(`firstname required validator input: ${val}`);
        return val.trim().length === 0;
      },
    },
    privacy: {
      hasToBeTrue: (val: boolean) => !val,
      required: (val: boolean) => true,
    },
  }
);

const { privacy, firstName } = formGroup;
console.log({ privacy, firstName });

const submitValue = () => {
  // v$.value.$validate();
  const isFormValid = validate();
  !isFormValid && console.log("The submitted form is not valid");
};
</script>
<template>
  <div>
    <cinput
      name="name"
      :validator="firstName.validator"
      v-model="firstName.value"
      label="Firstname"
      type="text"
      placeholder="Insert a name please"
      :on-keyup-enter-clear="false"
      :readonly="false"
    />
    <BaseCheckbox v-model="privacy.value" :validator="privacy.validator">
      <template #label> Accetta trattamento dei dati personali </template>
    </BaseCheckbox>
    <button @click="submitValue">submit form</button>
  </div>
</template>
