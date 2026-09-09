import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import supplierReducer from './slices/supplierSlice';
import categoryReducer from './slices/categorySlice';
import currencyReducer from './slices/currencySlice';
import siteStatsReducer from './slices/siteStatsSlice';
import notificationReducer from './slices/notificationSlice';

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
