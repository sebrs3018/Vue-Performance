import { watch, UnwrapNestedRefs } from "vue";
import {
  runValidators,
  ToValidate,
  ToValidateEntry,
  ToValidateValue,
} from "./useValidator";
// eslint-disable-next-line
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im;
const PHONE_REGEX =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=\S+$).{8,}$/im;
// eslint-disable-next-line max-len
export const WEBSITE_REGEX =
  /^(https?:\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/im;
export const LINKEDIN_REGEX = /^(http(s?):\/\/)(www\.)?linkedin\.com\/?.*/im;
export const FACEBOOK_REGEX =
  /^(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w-]*)?/im;
export const INSTAGRAM_REGEX =
  /^(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9-_.]+)/im;
export const DATE_REGEX =
  /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}/g;

/* This function checks if the current value has at least one character regardless of the type of the input value 
   So, the most importatnt features of this function are:
       - If the input value is null or undefined, it will return false
       - If the input value in not null or undefined it will be trimmed and if the length of the resultant output is less than one, it will return false
*/
export const required = (value: any) => {
  if (value === undefined || value === null) return false;

  return `${value}`.trim().length > 0;
};
//export const requiredIf = (value: any, validator: any) => (getterFunc: () => any): boolean => {
// const res = getterFunc();
// console.log("getterFunc res", res);

// if (!res.validator.$error) return required(res.value);
// else return false;
//};

export function requiredIf<T>(getter: (validator: any) => any): any {
  let unwatchFunc: any = null;
  let _reactiveFrom: any, _reactiveDep: any;

  const decoratedGetter = (theValidator: any): any => {
    //console.log("decoratedGetter", theValidator);
    const { reactiveFrom, reactiveDep } = getter(theValidator);
    _reactiveFrom = reactiveFrom;
    _reactiveDep = reactiveDep;

    //console.log({ reactiveFrom, reactiveDep });
    //Called deferred
    unwatchFunc = watch(
      () => reactiveDep.validator.$error,
      (newVal, oldVal) => {
        //console.log("requiredIf watcher!!", { newVal, oldVal });
        if (newVal) {
          reactiveFrom.validator.$error = false;
        } else {
          console.log({ val: reactiveFrom.value });
          reactiveFrom.validator.$error = !required(reactiveFrom.value);
        }
      }
    );
    return getter;
  };
  return (v: any, v1: any) => {
    unwatchFunc && unwatchFunc();
    //Observing the dependency
    decoratedGetter(v1);
    if (_reactiveDep.validator.$error) return true;
    return required(v);
  };
}

//type t = { t: number, t2: number, t3: { t4: number, t5: { t6: number } } }
//type getterFunc<T, T1> = (val: ToValidate<T>) => ToValidateEntry<T1, keyof T1>;
//let t43: getterFunc<t, { t3: { t4: number, t5: { t6: number } } } > = (v) => v.t3 ;

//IMP: up to now there is no elegant way to recursevely pick a nested prop... (but there is a lib out there!)
export function requiredIf2<T>(getter: (validator: ToValidate<T>) => any): any {
  return {
    predicate: (v: any, v1?: any): boolean => {
      console.log("predicate called!", { v, v1 });
      if (!v1) return true;
      const reactiveDep = getter(v1) as any;
      const validator = reactiveDep.validator;
      //Running all validators
      runValidators(reactiveDep, true);
      if (validator.$error) return true;
      return required(v);
    },
    validatorDep: (reactiveFrom: any): any => {
      let unwatchFunc: any = null;
      const decoratedGetter = (theValidator: ToValidate<T>): any => {
        const reactiveDep = getter(theValidator) as any;
        //Called deferred
        unwatchFunc = watch(
          () => reactiveDep.validator.$error,
          (newVal, oldVal) => {
            console.log("requiredDep has error?", { newVal, oldVal });
            if (newVal) {
              reactiveFrom.validator.$error = false;
            } else {
              reactiveFrom.validator.$error = !required(reactiveFrom.value);
            }
          }
        );
        return getter;
      };

      return (vInstance: ToValidate<T>): any => {
        console.log("requiredIf2 called!", { vInstance });
        unwatchFunc && unwatchFunc();
        //Observing the dependency
        decoratedGetter(vInstance);
      };
    },
  };
}

/** Email validation via regex. In case the provided value is empty, it will be evauluated as valid */
export const email = (value: string) => {
  if (value.length === 0) return true;

  return !!value.match(EMAIL_REGEX);
};
/** Phone validation via regex. In case the provided value is empty, it will be evauluated as valid */
export const phone = (value: string) => {
  if (value.length === 0) return true;

  return !!value.match(PHONE_REGEX);
};
export const password = (value: string) => !!value.match(PASSWORD_REGEX);
