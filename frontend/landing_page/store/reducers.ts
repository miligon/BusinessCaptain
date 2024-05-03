import { combineReducers } from 'redux';
import posReducers from 'pos/store/reducers';

export const rootReducer = combineReducers({
  ...posReducers,
});
