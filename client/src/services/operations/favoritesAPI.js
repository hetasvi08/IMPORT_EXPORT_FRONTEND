import {
  addToFavoritesLocal,
  removeFromFavoritesLocal,
  setFavorites,
  setFavoritesError,
  setFavoritesLoading
} from '../../store/slices/favoritesSlice';
import { apiconnector } from '../apiconnector';
import { dashboardEndpoints } from '../apis';

const {
  GET_FAVORITES_API,
  ADD_TO_FAVORITES_API,
  REMOVE_FROM_FAVORITES_API
} = dashboardEndpoints;

// Get user favorites
export const getFavorites = (token) => async (dispatch) => {
  dispatch(setFavoritesLoading(true));
  try {
    const response = await apiconnector('GET', GET_FAVORITES_API, null, {
      Authorization: `Bearer ${token}`
    });

    if (response.data.success) {
      dispatch(setFavorites(response.data.data));
    }
    return response.data;
  } catch (error) {
dispatch(setFavoritesError(error.message));
    return { success: false, error: error.message };
  }
};

// Add to favorites
export const addToFavorites = (productId, token, product) => async (dispatch) => {
  try {
    const response = await apiconnector(
      'POST',
      ADD_TO_FAVORITES_API(productId),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      // Update local state immediately for better UX
      if (product) {
        dispatch(addToFavoritesLocal(product));
      }
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remove from favorites
export const removeFromFavorites = (productId, token) => async (dispatch) => {
  try {
    const response = await apiconnector(
      'DELETE',
      REMOVE_FROM_FAVORITES_API(productId),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      dispatch(removeFromFavoritesLocal(productId));
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Toggle favorite (add if not exists, remove if exists)
export const toggleFavorite = (productId, token, product, isFavorite) => async (dispatch) => {
  if (isFavorite) {
    return dispatch(removeFromFavorites(productId, token));
  } else {
    return dispatch(addToFavorites(productId, token, product));
  }
};
