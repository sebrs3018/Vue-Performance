<script lang="ts" setup>
import cinput from "@/components/BaseComponents/cinput.vue";
import useValidator from "@/Composables/useValidator";
import BaseCheckbox from "@/components/BaseComponents/BaseCheckbox.vue";
import {
  required,
  requiredIf,
  requiredIf2,
  email,
  phone,
} from "@/Composables/ValidatorHelpers";

interface RequestData {
  requestData: {
    firstName: string;
    privacy: boolean;
    userEmail: string;
    userPhone: string;
    birthPlace: {
      city: {
        zip: number;
        country: string;
      };
    };
  };
}

const { requestData, validate, getUpdatedObjToValidate } = useValidator(
  {
    requestData: {
      firstName: "",
      privacy: false,
      userEmail: "",
      userPhone: "",
      birthPlace: {
        city: {
          zip: 0,
          country: "",
        },
      },
    },
  },
  {
    requestData: {
      userPhone: {
        immWatcher: requiredIf2<RequestData>(
          (_validator) => _validator.requestData.privacy
        ),
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
      birthPlace: {
        city: {
          zip: {
            greaterThanZero: (val) => val > 0,
          },
          country: {
            required,
          },
        },
      },
    },
  }
);

console.log({ requestData, ObjToValidate: getUpdatedObjToValidate() });

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
    <cinput
      type="text"
      name="country"
      :validator="requestData.birthPlace.city.country.validator"
      v-model="requestData.birthPlace.city.country.value"
      label="Country"
      placeholder="Insert Country"
      :on-keyup-enter-clear="false"
      :readonly="false"
    />

    <cinput
      type="text"
      name="zip"
      :validator="requestData.birthPlace.city.zip.validator"
      v-model="requestData.birthPlace.city.zip.value"
      label="Zip"
      placeholder="Insert Zip"
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
