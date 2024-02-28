import { configureStore } from '@reduxjs/toolkit';

import { catalogReducer } from './slices';

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
  },
});
