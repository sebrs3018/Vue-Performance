import { reactive, watch, UnwrapNestedRefs, computed } from "vue";

// interface Entry<TValue> {
//   refVal: TValue;
//   hasError: boolean;
// }
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
  //hasError: boolean;

  //TODO: tipare questo validatore per bene (bisogna estendere predicateEntry)
  validator: PredicateEntryExtended<T, TKey>;
}

type ToValidateEntry<T, K extends keyof T> = UnwrapNestedRefs<
  ReactiveValue<T, K>
>;
type ToValidate<T> = {
  //[K in keyof T]: ExtendedRef<T[K]>;
  [K in keyof T]: ToValidateEntry<T, K>;
};

interface UsableValidator<T> {
  formGroup: ToValidate<T>;
  validate: () => boolean;
}

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

export default function <T extends Record<string, unknown>>(
  plainObjToValidate: T,
  predicates: Predicates<T>
): UsableValidator<T> {
  if (!plainObjToValidate || !predicates)
    return {
      validate: (): boolean => false,
      formGroup: {} as ToValidate<T>,
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
        entry.validator.$error = res;
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
      const elemToValidate = formGroup[key];
      const predRes = !callPredicates(key, elemToValidate.value as T[keyof T]);

      //In case the result of the predicate is falsy, then the global state of the validation will be false
      if (!predRes) return false;

      //elemToValidate.hasError = predRes;
      elemToValidate.validator.$error = predRes;
    }

    return true;
  };

  return { formGroup, validate };
}
