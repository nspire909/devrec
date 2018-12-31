import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ApplicationEvent } from '../models/error.model';

import {
  AppState,
  FeatureReducer,
  FeatureAction,
  FeatureActions
} from '@devrec/common';

// State definition and initial value
export interface ErrorState extends EntityState<ApplicationEvent> {}
export interface ErrorAppState extends AppState {
  errors: ErrorState;
}
export const errorAdapter: EntityAdapter<
  ApplicationEvent
> = createEntityAdapter<ApplicationEvent>({
  selectId: (item: ApplicationEvent) => item.eventId,
  sortComparer: (item: ApplicationEvent) => item.eventId
});
export const initialErrorState: ErrorState = errorAdapter.getInitialState({});

// Selectors - used by components
const { selectAll: errorsSelectResults } = errorAdapter.getSelectors();
export const getErrorsState = createFeatureSelector<ErrorState>('errors');
export const selectAllErrors = createSelector(
  getErrorsState,
  errorsSelectResults
);

// Reducer actions
@FeatureReducer('ErrorReducer')
export class ErrorReducer extends FeatureActions<ErrorState> {
  @FeatureAction<ErrorState>()
  logEvent(state: ErrorState, payload: ApplicationEvent): ErrorState {
    return errorAdapter.addOne(payload, state);
  }
  @FeatureAction<ErrorState>()
  clear(state: ErrorState, payload: any): ErrorState {
    return errorAdapter.removeAll(state);
  }
}
export const errorActions = new ErrorReducer();
const reducer = FeatureActions.createReducer(initialErrorState, errorActions);
export function errorReducer(state: ErrorState, action: Action): ErrorState {
  return reducer(state, action);
}
