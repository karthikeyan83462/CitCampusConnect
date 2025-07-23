import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice';
import clubSlice from './slices/clubSlice';
import hostelSlice from './slices/hostelSlice';
import canteenSlice from './slices/canteenSlice';
import marketplaceSlice from './slices/marketplaceSlice';
import settingsSlice from './slices/settingsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only auth will be persisted
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    clubs: clubSlice,
    hostel: hostelSlice,
    canteen: canteenSlice,
    marketplace: marketplaceSlice,
    settings: settingsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;