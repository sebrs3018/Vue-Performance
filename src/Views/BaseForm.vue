<script lang="ts" setup>
//import { required, minLength } from "@vuelidate/validators";
import cinput from "@/components/BaseComponents/cinput.vue";
import useValidator from "@/Composables/useValidator";
import BaseCheckbox from "@/components/BaseComponents/BaseCheckbox.vue";
import { required, email, phone } from "@/Composables/ValidatorHelpers";
const { firstName, privacy, userEmail, userPhone, validate } = useValidator(
  {
    firstName: "",
    privacy: false,
    userEmail: "",
    userPhone: "",
  },
  {
    userPhone: {
      phone,
    },
    userEmail: {
      required,
      email,
    },
    firstName: {
      required,
    },
    privacy: {
      hasToBeTrue: (val: boolean) => val,
      required,
    },
  }
);

const submitValue = () => {
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
    <cinput
      type="email"
      name="email"
      :validator="userEmail.validator"
      v-model="userEmail.value"
      label="Email"
      placeholder="Insert Email"
      :on-keyup-enter-clear="false"
      :readonly="false"
    />
    <cinput
      type="phone"
      name="Phone"
      :validator="userPhone.validator"
      v-model="userPhone.value"
      label="Phone"
      placeholder="Insert Phone"
      :on-keyup-enter-clear="false"
      :readonly="false"
    />
    <BaseCheckbox v-model="privacy.value" :validator="privacy.validator">
      <template #label> Accetta trattamento dei dati personali </template>
    </BaseCheckbox>
    <button @click="submitValue">submit form</button>
  </div>
</template>
