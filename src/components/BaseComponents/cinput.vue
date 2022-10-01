<template>
  <div>
    <label
      v-if="label"
      :class="[
        {
          'label-required': getRequired() && showRequired,
          'text-red': hasError(),
        },
        labelClass,
      ]"
      v-html="label"
    />
    <div
      class="position-relative"
      :class="className"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <input
        :type="inputType"
        ref="input"
        :inputMode="inputMode"
        autocomplete="off"
        :value="getDisplayValue()"
        @keyup.enter="enterKey($event)"
        :title="name"
        :name="name"
        class="form-control rounded-5"
        :class="[
          { 'has-value': hasValue(), 'has-error': hasError() },
          inputClass,
        ]"
        :placeholder="placeholder"
        :readonly="readonly"
        @click="
          () => {
            if (preselect) $refs.input.select();
          }
        "
        v-on:input="updateField($event)"
        :style="styleName"
        v-on:focus="emitFocus"
        v-on:blur="emitBlur"
        v-on:clear="clear()"
        :disabled="disabled"
        :id="dinamiCinput"
      />
      <span
        v-if="
          clearButton &&
          hover &&
          hasValue() &&
          xIcon == enumPosition.POSITION_ABSOLUTE
        "
        @click.stop="clear()"
        class="input-clear position-absolute"
        style="top: 50%; transform: translate(0, -50%); right: 15%"
        ><img
          :src="`${cdn}/_ui/img/Icons/Close-gs.svg`"
          height="12"
          width="12"
          alt="x-icon"
      /></span>
      <span
        v-else-if="
          clearButton &&
          hover &&
          hasValue() &&
          xIcon == enumPosition.FLEX_CENTERED
        "
        @click.stop="clear()"
        class="input-clear d-flex flex-column justify-content-center align-items-center"
        ><img
          :src="`${cdn}/_ui/img/Icons/Close-gs.svg`"
          height="12"
          width="12"
          alt="x-icon"
      /></span>
    </div>
  </div>
</template>

<script lang="ts">
// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// import type {Validation} from "vuelidate";

enum ICON_POSITION {
  POSITION_ABSOLUTE = 1,
  FLEX_CENTERED,
}

//TODO: quando l'intero progetto userà vue 2.7.* oppure 3.*, wrappare questo componente tramite la funzione defineComponent
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    prefix: {
      type: String,
    },
    className: {
      type: String,
      default: "",
    },
    inputClass: {
      type: String,
      default: "",
    },
    labelClass: {
      type: String,
      default: "",
    },
    styleName: {
      type: String,
    },
    preselect: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
    type: {
      type: String,
      default: "String",
    },
    inputType: {
      type: String,
      default: "text",
    },
    max: {
      type: [String, Number],
    },
    value: {
      type: [String, Number],
      default() {
        return "";
      },
    },
    clearButton: {
      type: Boolean,
      default: false,
    },
    showRequired: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rangeError: {
      type: Boolean,
      default: false,
    },
    forceError: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    xIcon: {
      type: Number as () => ICON_POSITION,
      default: 0,
    },
    dinamiCinput: {
      type: String,
    },
    inputMode: {
      type: String,
      default: "text",
    },
    validator: {
      type: Object,
    },
    onKeyupEnterClear: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      hover: false,
      /** The inner height will be used to detect the closing of the mobile virtual keyboard */
      innerHeight: window.innerHeight,
      /** The callback listener for the event onResiwe of the window object */
      onResize: undefined as (() => void) | undefined,
    };
  },
  computed: {
    cdn(): string {
      return window["_cdn"];
    },
    enumPosition(): any {
      return ICON_POSITION;
    },
  },
  methods: {
    getRequired(): boolean {
      if (this.validator?.$params)
        return this.validator?.$params?.required ?? false;

      console.log(
        `is the field ${this.label} required? ${!!this.validator?.required}`
      );
      //New Vuelidate API
      return !!this.validator?.required;
    },
    getDisplayValue(): string {
      switch (this.type) {
        case "Number":
          return this.value == null
            ? this.value
            : formatInteger(this.value as number);
        case "Phone":
          return this.value == null ||
            this.value == "" ||
            isNaN(Number(this.value))
            ? ""
            : Number(this.value).toString();
        case "Password":
          return new Array((this.value as string).length + 1).join("*");
        default:
          const res = this.value || "";
          return `${res}`;
      }
    },
    getRawValue(): string | number | null {
      if (!this.$refs.input) return;

      let value: string | null | number =
        (this.$refs.input as HTMLInputElement).value || "";

      switch (this.type) {
        case "Number":
          if (value != null) value = parseInt(value?.replace(/\./g, ""));
          if (isNaN(value)) value = null;
          break;
        case "Password":
          value = this.value;
          break;
        default:
          break;
      }

      return value;
    },
    hasValue(): boolean {
      if (!this.$refs.input) return;

      return !!(this.$refs.input as HTMLInputElement).value;
    },
    hasError(): boolean {
      const res = this.validator?.$error || this.rangeError || this.forceError;
      res &&
        console.log("hasError", { name: this.name, validator: this.validator });
      return res;
    },
    updateField($event: Event): void {
      this.$emit("input", this.getRawValue());
    },
    clear(): void {
      if (!this.$refs.input) return;

      (this.$refs.input as HTMLInputElement).value = "";
      this.$emit("input", this.getRawValue());
    },
    resetValidator(): void {
      this.validator?.$reset();
    },
    enterKey($event: Event): void {
      //In this scenario we do not want to propagate the event nor to clear the cinput value
      if (!this.onKeyupEnterClear) {
        return;
      }
      let value = this.getRawValue();
      this.$emit("enter", value);
      this.clear();
    },
    emitFocus(): void {
      //Adding once an event listener for the current component
      if (!this.onResize) {
        this.onResize = () => {
          if (this.innerHeight === window.innerHeight) {
            this.blur();
          }
        };
        window.addEventListener("resize", this.onResize);
      }
      this.$emit("focus", this.getRawValue());
    },
    emitBlur(): void {
      this.$emit("blur", this.getRawValue());
    },
    focus(): void {
      if (!this.$refs.input) return;

      const input = this.$refs.input as HTMLInputElement;
      input.focus();
    },
    blur(): void {
      if (!this.$refs.input) return;

      const input = this.$refs.input as HTMLInputElement;
      //Cleaning up the event listener!
      if (this.onResize) {
        window.removeEventListener("resize", this.onResize);
        this.onResize = undefined;
      }
      input.blur();
    },
  },
};
</script>
