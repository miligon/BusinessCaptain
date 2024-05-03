import { configureStore } from '@reduxjs/toolkit';
//import { setupListeners } from '@reduxjs/toolkit/query/react';
import { rootReducer } from './reducers';

export const store = configureStore({
  reducer: rootReducer,
  devTools: true && import.meta.env.VITE_DEV_ENV,
});
//setupListeners(store.dispatch);

export default store;
