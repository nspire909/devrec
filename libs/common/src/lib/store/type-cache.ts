// Define our own action interface here so we don't have to take
//  a hard dependency on @ngrx/store
export interface IAction {
  type: string;
}

/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our reducers.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels
 * are unique.
 */
const typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
  if (typeCache[<string>label]) {
    throw new Error(`Action type "${label}" is not unique"`);
  }

  typeCache[<string>label] = true;

  return <T>label;
}

export interface ActionReducingHandler<T, ActionType extends IAction> {
  (state: T | undefined, action: ActionType): T;
  handlesType(action: IAction): action is ActionType;
}

export type ActionReducingHandlerCreator<
  T,
  A extends IAction
> = ActionReducingHandler<T, A> & {
  add<A2 extends A>(actionClass: {
    type: A2['type'];
    reduce: (state: T, action: A2) => T;
  }): ActionReducingHandlerCreator<T, A>;
};

export function reducerBuilder<T, A extends IAction>(
  initialState: T
): ActionReducingHandlerCreator<T, A> {
  function mkReducer(
    reducerMap: { [type: string]: Function },
    actionClass?: { type: string; reduce: Function }
  ): ActionReducingHandlerCreator<T, A> {
    if (actionClass) {
      reducerMap = {
        ...reducerMap,
        [actionClass.type]: actionClass.reduce
      };
    }
    const reducer = (state: T = initialState, action: IAction) =>
      reducerMap[action.type] ? reducerMap[action.type](state, action) : state;

    (<any>reducer).handlesType = (action: IAction) => !!reducerMap[action.type];
    (<any>reducer).add = mkReducer.bind(null, reducerMap);

    return <any>reducer;
  }

  return mkReducer({});
}

export function forceCastReducer<T, A extends IAction>(
  reducer: (state: T | undefined, action: A) => T
): (state: T | undefined, action: IAction) => T;
export function forceCastReducer<T, A extends IAction>(
  reducer: (state: T, action: A) => T
): (state: T | undefined, action: IAction) => T {
  return <any>reducer;
}

/**
 * This function builds a state reducer to replace the typical switch/case pattern,
 * given an initial state and a list of classes with static type and reduce function.
 * @param initial The initial state for this reducer, called by store to initialize the state
 * @param actionClasses a list of classes (type names) implementing the required static reducer interface.
 *
 * @deprecated User combineReducers instead
 */
export function buildReducer<T>( // TODO 2.3 could handle this as a default generic
  initial: T,
  ...actionClasses: { type: string; reduce: Function }[]
): ActionReducingHandler<T, IAction> {
  // tslint:disable-next-line:deprecation
  return buildActionsReducer<T, IAction>(initial, ...actionClasses);
}

/**
 * This function builds a state reducer to replace the typical switch/case pattern,
 * given an initial state and a list of classes with static type and reduce function.
 * @param initial The initial state for this reducer, called by store to initialize the state
 * @param actionClasses a list of classes (type names) implementing the required static reducer interface.
 *
 * @deprecated Use reducerBuilder or FeatureActions.createReducer instead
 */
export function buildActionsReducer<T, ActionType extends IAction>(
  initial: T,
  ...actionClasses: { type: string; reduce: Function }[]
): ActionReducingHandler<T, ActionType> {
  const handlers: {
    [key: string]: (state: T, action: ActionType) => T;
  } = {};
  actionClasses.forEach(ac => {
    handlers[ac.type] = <any>ac.reduce;
  });

  // TODO is there a type safe way to do this?
  const reducer = (state: T = initial, action: ActionType) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;
  (reducer as any).handlesType = (action: ActionType) =>
    !!handlers[action.type];
  return reducer as ActionReducingHandler<T, ActionType>;
}
