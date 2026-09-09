import { apiconnector } from '../apiconnector';
import { dashboardEndpoints } from '../apis';
import {
  setCartLoading,
  setCart,
  addToCartLocal,
  updateCartItemLocal,
  removeFromCartLocal,
  clearCartLocal,
  setCartError
} from '../../store/slices/cartSlice';

const {
  GET_CART_API,
  ADD_TO_CART_API,
  UPDATE_CART_ITEM_API,
  REMOVE_FROM_CART_API,
  CLEAR_CART_API,
  RAISE_CART_INQUIRY_API
} = dashboardEndpoints;

// Get user cart
export const getCart = (token) => async (dispatch) => {
  dispatch(setCartLoading(true));
  try {
    const response = await apiconnector('GET', GET_CART_API, null, {
      Authorization: `Bearer ${token}`
    });

    if (response.data.success) {
      dispatch(setCart({
        items: response.data.data,
        totalItems: response.data.totalItems,
        totalAmount: response.data.totalAmount
      }));
    }
    return response.data;
  } catch (error) {
dispatch(setCartError(error.message));
    return { success: false, error: error.message };
  }
};

// Add to cart
export const addToCart = (productId, quantity = 1, token, product) => async (dispatch) => {
  try {
    const response = await apiconnector(
      'POST',
      ADD_TO_CART_API(productId),
      { quantity },
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      // Update local state immediately for better UX
      if (product) {
        dispatch(addToCartLocal({ product, quantity }));
      }
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update cart item quantity
export const updateCartItem = (productId, quantity, token) => async (dispatch) => {
  try {
    const response = await apiconnector(
      'PUT',
      UPDATE_CART_ITEM_API(productId),
      { quantity },
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      dispatch(updateCartItemLocal({ productId, quantity }));
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remove from cart
export const removeFromCart = (productId, token) => async (dispatch) => {
  try {
    const response = await apiconnector(
      'DELETE',
      REMOVE_FROM_CART_API(productId),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      dispatch(removeFromCartLocal(productId));
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Clear cart
export const clearCart = (token, silent = false) => async (dispatch) => {
  try {
    const response = await apiconnector(
      'DELETE',
      CLEAR_CART_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      dispatch(clearCartLocal());
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Raise cart inquiry
export const raiseCartInquiry = (token, formData) => async (dispatch) => {
  try {
    const response = await apiconnector(
      'POST',
      RAISE_CART_INQUIRY_API,
      formData,
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      dispatch(clearCartLocal());
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
