import { Action, ThunkAction } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import store from './store';

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, AppDispatch, Action<string>>;

export default store;
