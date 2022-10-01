import { reactive, watch, UnwrapNestedRefs } from "vue";
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

interface ReactiveValue<T, TKey extends keyof T> {
  value: T[TKey];
  validator: PredicateEntryExtended<T, TKey>;
}

type ToValidateEntry<T, K extends keyof T> = UnwrapNestedRefs<
  ReactiveValue<T, K>
>;
type ToValidate<T> = {
  [K in keyof T]: ToValidateEntry<T, K>;
};

type UsableValidator<T> = ToValidate<T> & {
  validate: () => boolean;
};

/* IN Predicates */
type PredicateValue<TValue> = {
  [predKey: string]: (val: TValue) => boolean;
};
type Predicates<T> = {
  [K in keyof T]: PredicateValue<T[K]>;
};
/* OUT Predicates */
type PredicateEntry<T, K extends keyof T> = Predicates<T>[K];
type PredicateEntryExtended<T, K extends keyof T> = PredicateEntry<T, K> & {
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
  for (const key in plainObjToValidate) {
    const value = plainObjToValidate[key];
    const entry = reactive({
      value,
      validator: {
        ...predicates[key],
        $error: false,
      } as PredicateEntryExtended<T, typeof key>,
    });

    //Setting an inner watcher to check the predicate...
    watch(
      () => entry.value,
      (cur, prev) => {
        //console.log("innerWatcher", { prev, cur });
        let res = callPredicates(key, cur as T[keyof T]);

        //console.log(`innerWatcher, ${key} has error? ${res}`);
        entry.validator.$error = !res;
      }
    );

    if (!_formGroup)
      _formGroup = {
        [key]: entry,
      };
    else _formGroup[key] = entry;
  }
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
      if (!predicate(v)) {
        return false;
      }
    }
    return true;
  };

  const validate = (): boolean => {
    for (const key in formGroup) {
      const { [key]: elemToValidate } = formGroup;
      const predRes = callPredicates(key, elemToValidate.value as T[keyof T]);

      //In case the result of the predicate is falsy, then the global state of the validation will be false
      if (!predRes) return false;

      elemToValidate.validator.$error = !predRes;
    }

    return true;
  };

  return { ...formGroup, validate };
}
