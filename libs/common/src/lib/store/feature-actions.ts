import {
  getActionMetadataEntries,
  getActionMetadataEntry
} from './feature-action-decorator';
import { TPAction } from './effects';
import { IAction } from './type-cache';

export class FeatureActions<TState> {
  static createReducer<TState>(
    initialState: TState,
    inst: FeatureActions<TState>
  ): (state: TState, action: IAction) => TState {
    const handlers: {
      [key: string]: (state: TState, action: IAction) => TState;
    } = {};

    const metadata = getActionMetadataEntries(inst);
    metadata.forEach(md => {
      handlers[md.actionName] = md.action;
    });

    return (state: TState = initialState, action: IAction) =>
      handlers[action.type]
        ? handlers[action.type](
            state,
            (<{ type: string; payload: any }>action).payload
          )
        : state;
  }

  public create<TP>(
    action: (state: TState, payload: TP) => TState,
    payload: TP
  ): TPAction<TP> {
    const actionMetadata = getActionMetadataEntry(action);
    return { type: actionMetadata.actionName, payload: payload };
  }
}
