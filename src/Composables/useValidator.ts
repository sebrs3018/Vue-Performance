import { ref, Ref, reactive, watch, UnwrapNestedRefs, TrackOpTypes } from "vue";
// type Pick<T, K extends keyof T> = {
//   [P in K]: T[P];
// };
// type PickEntry<T, K extends keyof T> = {
//   [P in K]: Ref<Entry<T[P]>>;
// };

// interface ExtendedRef<T> {
//   refVal: Ref<T>;
//   hasError: boolean;
// }
interface Person {
  name: string;
}
interface ExtendedPerson extends Person {
  city: {
    zipCode: number;
    country: string;
  };
}

interface ReactiveValue<T, TKey extends keyof T> {
  value: T[TKey];
  validator: Predicates<T>[TKey];
}

// type ToValidateEntry<T, K extends keyof T> = UnwrapNestedRefs<
//   ReactiveValue<T, K>
// >;

type ToValidateEntry<T, K extends keyof T> = ToValidate<T[K]> extends object
  ? ToValidate<T[K]>
  : UnwrapNestedRefs<ReactiveValue<T, K>>;

type ToValidate<T> = {
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
};

/* IN Predicates */
// type PredicateValue<T, TKey extends keyof T> = {
//   [predKey: string]: T[TKey] extends object
//     ? Predicates<T[TKey]>
//     : (value: T[TKey]) => boolean;
// };

type PredicateValue<T, TKey extends keyof T> = T[TKey] extends object
  ? Predicates<T[TKey]>
  : {
      [predKey: string]: (value: T[TKey]) => boolean;
    } & { $error?: boolean };

type Predicates<T> = {
  [K in keyof T]: PredicateValue<T, K>;
};

const p: PredicateValue<
  { name: string; city: { place: string; zip: string } },
  "name"
> = {
  l1: (val) => true,
};
const p1: PredicateValue<
  { name: string; city: { place: string; zip: string } },
  "city"
> = {
  place: {
    ll: (val: string) => true,
  },
  zip: {
    ll: (val: string) => true,
  },
};
const p0: Predicates<{ name: string; city: { place: string; zip: string } }> = {
  name: {
    l1: (val) => true,
  },
  city: {
    place: {
      l1: (val) => true,
    },
    zip: {
      l1: (val) => true,
    },
  },
};

/* OUT Predicates */
type PredicateEntry<T, K extends keyof T> = Predicates<T>[K];
const pEntry: PredicateEntry<
  { name: string; city: { place: string; zip: string } },
  "city"
> = {
  place: {
    l1: (val) => true,
  },
  zip: {
    l1: (val) => true,
  },
};

// type PredicateEntryExtended<T, K extends keyof T> = PredicateEntry<T, K> & {
//   /** This value is null in only during the initialization period! */
//   $error: boolean;
// };
type PredicateEntryExtended<T, K extends keyof T> = PredicateValue<T, K> & {
  /** This value is null in only during the initialization period! */
  $error: boolean;
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
  predicates: Predicates<T>
): UsableValidator<T> {
  if (!plainObjToValidate || !predicates)
    return {
      validate: (): boolean => false,
      ...({} as ToValidate<T>),
    };

  let _formGroup: any;
  //Initializing an array of reactive objects to validate
  // for (const key in plainObjToValidate) {
  //   const value = plainObjToValidate[key];

  let finalRes: any = {};
  for (const key in plainObjToValidate) {
    finalRes[key] = initValidationTree(
      plainObjToValidate[key],
      predicates[key]
    );
  }
  console.log(finalRes);
  _formGroup = finalRes;

  // const entry = reactive({
  //   value,
  //   validator: {
  //     ...predicates[key],
  //     $error: false,
  //   } as PredicateEntryExtended<T, typeof key>,
  // });

  //Setting an inner watcher to check the predicate...
  // watch(
  //   () => entry.value,
  //   (cur, prev) => {
  //     //console.log("innerWatcher", { prev, cur });
  //     let res = callPredicates(key, cur as T[keyof T]);

  //     //console.log(`innerWatcher, ${key} has error? ${res}`);
  //     entry.validator.$error = !res;
  //   }
  // );

  // if (!_formGroup)
  //   _formGroup = {
  //     [key]: entry,
  //   };
  // else _formGroup[key] = entry;
  // }
  const formGroup: ToValidate<T> = _formGroup;

  /**
   * Calls all the predicates of a given entry
   */
  const callPredicates = (k: keyof T, v: T[keyof T]) => {
    //Retrieving the predicate object which contains all the predicates to
    //mark as valid the entry
    const n_predicate = predicates[k];
    for (const keyPredicate in n_predicate) {
      const predicate = n_predicate[keyPredicate];
      //console.log("calling predicates with the following values", predicate);
      // if (!predicate(v)) {
      //   return false;
      // }
    }
    return true;
  };

  const validate = (): boolean | null => {
    // for (const key in formGroup) {
    //   const { [key]: elemToValidate } = formGroup;
    //   const predRes = callPredicates(key, elemToValidate.value as T[keyof T]);

    //   //In case the result of the predicate is falsy, then the global state of the validation will be false
    //   if (!predRes) return false;

    //   elemToValidate.validator.$error = !predRes;
    // }

    // return true;
    return validateAux(formGroup);
  };

  return { ...formGroup, validate };
}

const isLeaf = (leaf: any) =>
  typeof leaf === "number" ||
  typeof leaf === "string" ||
  typeof leaf === "boolean";

const initValidationTree = (obj: any, predicates: any): any => {
  if (isLeaf(obj)) {
    let res = reactive({
      value: obj,
      validator: {
        $error: false,
        ...predicates,
      },
    });

    watch(
      () => res.value,
      (curVal) => {
        let predResult = true;
        for (let key in predicates) {
          if (!predicates[key](curVal)) {
            predResult = false;
            break;
          }
        }
        res.validator.$error = !predResult;
      }
    );

    return res;
  }

  let result: any = {};
  for (const key in obj) {
    const leaf = initValidationTree(obj[key], predicates[key]);
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

const visitTree = (objToVisit: any, predicates: any) => {
  let finalRes: any = {};
  for (const key in objToVisit) {
    finalRes[key] = initValidationTree(objToVisit[key], predicates[key]);
  }
  return finalRes;
};
