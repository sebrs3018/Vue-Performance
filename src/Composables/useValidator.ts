import { ref, Ref, reactive, watch, UnwrapNestedRefs, shallowRef } from "vue";
interface Person {
  name: string;
}
interface ExtendedPerson extends Person {
  city: {
    zipCode: number;
    country: string;
  };
}

export interface ReactiveValue<T, TKey extends keyof T> {
  value: T[TKey];
  validator: PredicateValueEntryExt<T, T, TKey>;
}

// type ToValidateEntry<T, K extends keyof T> = UnwrapNestedRefs<
//   ReactiveValue<T, K>
// >;
export type ToValidateValue<T, K extends keyof T> = UnwrapNestedRefs<
  ReactiveValue<T, K>
>;

export type ToValidateEntry<T, K extends keyof T> = ToValidate<
  T[K]
> extends object
  ? ToValidate<T[K]>
  : ToValidateValue<T, K>;

export type ToValidate<T> = {
  [K in keyof T]: ToValidateEntry<T, K>;
};

const pp: ToValidate<{
  requestData: {
    firstName: string;
    privacy: false;
    userEmail: string;
    userPhone: string;
  };
}> = {
  requestData: {
    firstName: reactive({
      value: "hey",
      validator: {},
    }),
    privacy: reactive({
      value: false,
      validator: {},
    }),
    userEmail: reactive({
      value: "hey",
      validator: {},
    }),
    userPhone: reactive({
      value: "hey",
      validator: {},
    }),
  },
};

type UsableValidator<T> = ToValidate<T> & {
  validate: () => boolean | null;
  getUpdatedObjToValidate: () => T;
};

export type PickKeyLevelType<T, TKey> = TKey extends keyof T
  ? T
  : PickKeyLevelType<T[keyof T], TKey>;

export type PickValueType<T, TKey> = TKey extends keyof T
  ? T[TKey]
  : PickValueType<T[keyof T], TKey>;

let t1: PickValueType<
  { a: { b: { c: { d: number } } }; a1: number; a2: string },
  "a"
>;

export type PredicateFunc<TRoot, T, TKey extends keyof T> = (
  value: T[TKey],
  validatorState?: ToValidate<TRoot>
) => boolean;

export type PredicateDep<TRoot, T, TKey extends keyof T> = {
  predicate: PredicateFunc<TRoot, T, TKey>;
  validatorDep: (
    v: ToValidateValue<T, TKey>
  ) => (vInstance: ToValidate<T>) => void;
};

type PredicateValueEntry<TRoot, T, TKey extends keyof T> = {
  [predKey: string]:
    | PredicateFunc<TRoot, T, TKey>
    | PredicateDep<TRoot, T, TKey>
    | boolean
    | undefined;
};
export interface PredicateValueEntryExt<TRoot, T, TKey extends keyof T>
  extends PredicateValueEntry<TRoot, T, TKey> {
  $error?: boolean;
}

type PredicateValue<TRoot, T, TKey extends keyof T> = T[TKey] extends object
  ? Predicates<TRoot, T[TKey]>
  : PredicateValueEntryExt<TRoot, T, TKey>;

type Predicates<TRoot, T> = {
  [K in keyof T]: PredicateValue<TRoot, T, K>;
};

/**
 * A Validator composable which will validate a given object with the predicates given by the user.
 * It's important to keep in mind that, due to some inner watchers, the validation function will be fired whenever the value of the plainObjToValidate changes
 * @param plainObjToValidate A plain object to validate, if it's null then it will be returned an empty object
 * e.g. { firstName: "" }
 * @param predicates An object whose keys match the ones of the plain objectToValidate.
 * As entry you can put an object including any number of validator functions in the following format:
 * [nameOfTheValidatorFunction]: <validatorFunction>
 * e.g. { firstName: {  required: (value) => true } }
 * The only constrain the validator function has is that it must return a boolean value. If it returns true, than the current value analyzed will be considered valid.
 * @returns An object composed by:
 * 1)  The same keys of the plain object
 * 2)  Per each entry, a reactive object containing:
 * 2.1) The value of the object
 * 2.2) A validator object having the state of the validation and the predicates
 * 2.3) A validate function to programatically validate the input object
 */
export default function <T extends Record<string, unknown>>(
  plainObjToValidate: T,
  predicates: Predicates<T, T>
): UsableValidator<T> {
  if (!plainObjToValidate || !predicates)
    return {
      validate: (): boolean => false,
      getUpdatedObjToValidate: () => ({} as T),
      ...({} as ToValidate<T>),
    };

  let formGroup = shallowRef<ToValidate<T> | null>(null);
  let finalRes: any = {};
  for (const key in plainObjToValidate) {
    finalRes[key] = initValidationTree(
      plainObjToValidate[key],
      predicates[key],
      formGroup
    );
  }

  formGroup.value = finalRes;

  const validate = (): boolean | null => {
    return validateAux(formGroup.value);
  };

  const getUpdatedObjToValidate = (): T =>
    getUpdatedObjToValidateAux(formGroup.value) as T;

  return {
    ...(formGroup.value as ToValidate<T>),
    validate,
    getUpdatedObjToValidate,
  };
}

const isLeaf = (leaf: any) =>
  typeof leaf === "number" ||
  typeof leaf === "string" ||
  typeof leaf === "boolean";

const initValidationTree = (
  obj: any,
  predicates: any,
  validatorState: any
): any => {
  if (isLeaf(obj)) {
    let wrappedPredicates: any = {};

    //Initializing the reactive object
    let reactiveLeaf = reactive<{ value: any; validator: any }>({
      value: null,
      validator: null,
    });

    for (let predKey in predicates) {
      if (typeof predicates[predKey] === "function") {
        wrappedPredicates[predKey] = (leafValue: any) =>
          predicates[predKey](leafValue, validatorState.value);
      } else {
        const { validatorDep, predicate } = predicates[predKey];

        console.log("not a function", {
          validatorDep,
          predicate,
          validatorState,
        });
        wrappedPredicates[predKey] = (leafValue: any) =>
          predicate(leafValue, validatorState.value);

        watch(validatorState, (cur, prev) => {
          console.log({ cur, prev });
          //Injecting the validator instance
          validatorDep(reactiveLeaf)(validatorState.value);
        });
      }
    }

    //Inserting the initialized version of the current reactive leaf
    reactiveLeaf.value = obj;
    reactiveLeaf.validator = {
      $error: undefined,
      ...wrappedPredicates,
    };

    watch(
      () => reactiveLeaf.value,
      (curVal) => {
        let predResult = true;
        for (let key in wrappedPredicates) {
          if (!wrappedPredicates[key](curVal)) {
            predResult = false;
            break;
          }
        }
        reactiveLeaf.validator.$error = !predResult;
      }
    );

    return reactiveLeaf;
  }

  let result: any = {};
  for (const key in obj) {
    const leaf = initValidationTree(obj[key], predicates[key], validatorState);
    result[key] = leaf;
  }

  return result;
};

function validateAux(node: any, initResult = { result: true }): boolean | null {
  if (isLeaf(node)) return null;

  for (let key in node) {
    validateAux(node[key], initResult);
    for (let predKey in node.validator) {
      if (predKey === "$error") continue;

      const predResult = node.validator[predKey](node.value);
      if (initResult.result && !predResult) {
        initResult.result = false;
      }
      node.validator.$error = !predResult;
    }
  }

  return initResult.result;
}

const getUpdatedObjToValidateAux = (node: any) => {
  if (node.value !== undefined) {
    return node.value;
  }

  let plainSubTree: any = {};
  for (let key in node) {
    const val = getUpdatedObjToValidateAux(node[key]);
    plainSubTree[key] = val;
  }

  return plainSubTree;
};

export const runValidators = (toValidate: any, once = false) => {
  for (let predKey in toValidate.validator) {
    if (predKey === "$error") continue;
    if (once && toValidate.validator.$error !== undefined) {
      continue;
    }
    const predResult = toValidate.validator[predKey](toValidate.value);
    if (!predResult) {
      toValidate.validator.$error = !predResult;
      return;
    }
    toValidate.validator.$error = predResult;
  }
};

// const visitTree = (objToVisit: any, predicates: any) => {
//   let finalRes: any = {};
//   for (const key in objToVisit) {
//     finalRes[key] = initValidationTree(objToVisit[key], predicates[key]);
//   }
//   return finalRes;
// };
