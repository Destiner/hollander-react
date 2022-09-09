import { configureStore } from '@reduxjs/toolkit';

import asset from './asset';
import wallet from './wallet';

const store = configureStore({
  reducer: {
    asset,
    wallet,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export type { AppDispatch, RootState };
export default store;
