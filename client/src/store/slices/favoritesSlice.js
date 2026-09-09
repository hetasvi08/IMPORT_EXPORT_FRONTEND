import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoritesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFavorites: (state, action) => {
      state.items = action.payload || [];
      state.totalItems = action.payload?.length || 0;
      state.loading = false;
      state.error = null;
    },
    addToFavoritesLocal: (state, action) => {
      const product = action.payload;
      if (!state.items.find(item => item._id === product._id)) {
        state.items.push(product);
        state.totalItems = state.items.length;
      }
    },
    removeFromFavoritesLocal: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item._id !== productId);
      state.totalItems = state.items.length;
    },
    clearFavoritesLocal: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
    setFavoritesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  setFavoritesLoading,
  setFavorites,
  addToFavoritesLocal,
  removeFromFavoritesLocal,
  clearFavoritesLocal,
  setFavoritesError
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
