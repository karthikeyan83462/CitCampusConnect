import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import clubSlice from './slices/clubSlice';
import hostelSlice from './slices/hostelSlice';
import canteenSlice from './slices/canteenSlice';
import marketplaceSlice from './slices/marketplaceSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    clubs: clubSlice,
    hostel: hostelSlice,
    canteen: canteenSlice,
    marketplace: marketplaceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;