<script lang="ts" setup>
import cinput from "@/components/BaseComponents/cinput.vue";
import useValidator from "@/Composables/useValidator";
import BaseCheckbox from "@/components/BaseComponents/BaseCheckbox.vue";
import { required, email, phone } from "@/Composables/ValidatorHelpers";

const { requestData, validate } = useValidator(
  {
    requestData: {
      firstName: "",
      privacy: false,
      userEmail: "",
      userPhone: "",
    },
  },
  {
    requestData: {
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
    },
  }
);

console.log(requestData);
const submitValue = () => {
  const isFormValid = validate();
  console.log({ isFormValid });

  !isFormValid && console.log("The submitted form is not valid");
};
</script>
<template>
  <div>
    <cinput
      name="name"
      :validator="requestData.firstName.validator"
      v-model="requestData.firstName.value"
      label="Firstname"
      type="text"
      placeholder="Insert a name please"
      :on-keyup-enter-clear="false"
      :readonly="false"
    />
    <cinput
      type="email"
      name="email"
      :validator="requestData.userEmail.validator"
      v-model="requestData.userEmail.value"
      label="Email"
      placeholder="Insert Email"
      :on-keyup-enter-clear="false"
      :readonly="false"
    />
    <cinput
      type="phone"
      name="Phone"
      :validator="requestData.userPhone.validator"
      v-model="requestData.userPhone.value"
      label="Phone"
      placeholder="Insert Phone"
      :on-keyup-enter-clear="false"
      :readonly="false"
    />
    <BaseCheckbox
      v-model="requestData.privacy.value"
      :validator="requestData.privacy.validator"
    >
      <template #label> Accetta trattamento dei dati personali </template>
    </BaseCheckbox>
    <button @click="submitValue">submit form</button>
  </div>
</template>
