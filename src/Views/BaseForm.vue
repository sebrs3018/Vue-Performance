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
        immWatcher: {
          predicate: (v: any, v1: any): boolean => {
            console.log("immWatcher called!", { v, v1 });
            if (v1.requestData.privacy.validator.$error === undefined) {
              const { privacy } = v1.requestData;
              for (let key in privacy.validator) {
                if (key === "$error") continue;
                console.log(
                  `dep: ${key} => hasError: ${!privacy.validator[key](
                    privacy.value
                  )}`
                );
                privacy.validator.$error = !privacy.validator[key](
                  privacy.value
                );
                if (privacy.validator.$error) break;
              }
            } else if (v1.requestData.privacy.validator.$error) return true;
            return required(v);
          },
          getters(vInstance: any) {
            console.log({ vInstance });
            return vInstance.requestData.privacy;
          },
          validatorHelper: requiredIf2((_validator) => ({
            reactiveFrom: _validator.requestData.userPhone,
            reactiveDep: _validator.requestData.privacy,
          })),
        },
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
