import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import currencyReducer from './slices/currencySlice';
import favoritesReducer from './slices/favoritesSlice';
import notificationReducer from './slices/notificationSlice';
import siteStatsReducer from './slices/siteStatsSlice';
import supplierReducer from './slices/supplierSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    supplier: supplierReducer,
    categories: categoryReducer,
    currency: currencyReducer,
    siteStats: siteStatsReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
