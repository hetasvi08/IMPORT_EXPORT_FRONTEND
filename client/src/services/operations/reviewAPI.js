import { apiConnector } from "../apiconnector";
import { reviewEndpoints } from "../apis";

const {
  GET_ALL_REVIEWS_API,
  GET_PRODUCT_REVIEWS_API,
  CREATE_REVIEW_API,
  UPDATE_REVIEW_API,
  DELETE_REVIEW_API,
} = reviewEndpoints;

// ======================= GET PRODUCT REVIEWS =======================

export const getProductReviews = async (productId) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_PRODUCT_REVIEWS_API(productId)
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
return { success: false, data: [], stats: { avgRating: 0, totalReviews: 0 } };
  }
};

// ======================= CREATE REVIEW =======================

export const createReview = async (reviewData, token) => {
  try {
    const response = await apiConnector(
      "POST",
      CREATE_REVIEW_API,
      reviewData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================= UPDATE REVIEW =======================

export const updateReview = async (reviewId, reviewData, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_REVIEW_API(reviewId),
      reviewData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================= DELETE REVIEW =======================

export const deleteReview = async (reviewId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_REVIEW_API(reviewId),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================= TOGGLE HELPFUL =======================

export const toggleReviewHelpful = async (reviewId, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      `${GET_ALL_REVIEWS_API}/${reviewId}/helpful`,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================= GET MY REVIEWS =======================

export const getMyReviews = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_ALL_REVIEWS_API}/my/reviews`,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
return { success: false, data: [] };
  }
};
