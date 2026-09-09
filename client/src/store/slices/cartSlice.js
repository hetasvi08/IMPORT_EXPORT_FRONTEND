import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalQuantity: 0,
  totalAmount: 0,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.totalItems = (action.payload.items || []).length;
      state.totalQuantity = action.payload.totalItems || 0;
      state.totalAmount = action.payload.totalAmount || 0;
      state.loading = false;
      state.error = null;
    },
    addToCartLocal: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.price * existingItem.quantity;
      } else {
        const price = product.price || 0;
        state.items.push({
          product,
          quantity,
          price,
          subtotal: price * quantity,
          addedAt: new Date().toISOString()
        });
      }
      
      // Recalculate totals
      state.totalItems = state.items.length;
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
    },
    updateCartItemLocal: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product._id === productId);
      
      if (item) {
        item.quantity = quantity;
        item.subtotal = item.price * quantity;
        
        // Recalculate totals
        state.totalItems = state.items.length;
        state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
      }
    },
    removeFromCartLocal: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product._id !== productId);
      
      // Recalculate totals
      state.totalItems = state.items.length;
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
    },
    clearCartLocal: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    setCartError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  setCartLoading,
  setCart,
  addToCartLocal,
  updateCartItemLocal,
  removeFromCartLocal,
  clearCartLocal,
  setCartError
} = cartSlice.actions;

export default cartSlice.reducer;
