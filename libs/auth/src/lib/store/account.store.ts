import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import {
  AppState,
  type,
  buildReducer,
  FeatureReducer,
  FeatureAction,
  FeatureActions
} from '@devrec/common';

import { UserSummary, anonymousUser } from '../models/account.model';

// State definition and initial value
export interface UserState {
  user: UserSummary;
}

export interface UserAppState extends AppState {
  user: UserState;
}

export const initialUserState: UserState = {
  user: anonymousUser()
};

// Selectors - used by components
export const getUserState = createFeatureSelector<UserState>('user');
export const selectUser = createSelector(
  getUserState,
  (state: UserState) => state.user
);

// Reducer actions
@FeatureReducer('UserReducer')
export class UserReducer extends FeatureActions<UserState> {
  @FeatureAction<UserState>()
  userInitFromLocal(state: UserState, payload: UserSummary): UserState {
    if (state.user && state.user.jwtToken) {
      return state;
    } // don't overwrite an alread set user from local storage cache
    return {
      ...state,
      user: payload || null
    };
  }
  @FeatureAction<UserState>()
  userLoginComplete(state: UserState, payload: UserSummary): UserState {
    return {
      ...state,
      user: payload || null
    };
  }
  @FeatureAction<UserState>()
  userLogoutComplete(state: UserState, payload: any): UserState {
    return {
      ...state,
      user: anonymousUser()
    };
  }
}
export const userActions = new UserReducer();
const reducer = FeatureActions.createReducer(initialUserState, userActions);
export function userReducer(state: UserState, action: Action): UserState {
  return reducer(state, action);
}
