import { apiconnector } from "../apiconnector";
import { categoryEndpoints } from "../apis";

const {
  GET_ALL_CATEGORIES_API,
  GET_CATEGORY_BY_ID_API,
  GET_CATEGORY_BY_SLUG_API,
  GET_CATEGORY_STATS_API,
  GET_FEATURED_CATEGORIES_API,
  GET_HOT_CATEGORIES_API,
  GET_TRENDING_CATEGORIES_API,
  GET_TOP_SELLING_CATEGORIES_API,
  GET_NEW_CATEGORIES_API,
  GET_ADMIN_CATEGORIES_API,
  CREATE_CATEGORY_API,
  UPDATE_CATEGORY_API,
  DELETE_CATEGORY_API,
  UPLOAD_CATEGORY_IMAGE_API,
  TOGGLE_CATEGORY_ACTIVE_API,
  TOGGLE_CATEGORY_FEATURED_API,
  TOGGLE_CATEGORY_HOT_API,
  TOGGLE_CATEGORY_TRENDING_API,
  TOGGLE_CATEGORY_NEW_API,
  TOGGLE_CATEGORY_TOP_SELLING_API,
  UPDATE_CATEGORY_ORDER_API,
  BULK_UPDATE_CATEGORY_ORDER_API,
  SYNC_PRODUCT_COUNTS_API,
} = categoryEndpoints;

// ==================== PUBLIC ENDPOINTS ====================

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await apiconnector("GET", GET_ALL_CATEGORIES_API);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Get single category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await apiconnector("GET", GET_CATEGORY_BY_ID_API(id));

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  try {
    const response = await apiconnector("GET", GET_CATEGORY_BY_SLUG_API(slug));

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Get featured categories
export const getFeaturedCategories = async (limit = 6) => {
  try {
    const response = await apiconnector("GET", GET_FEATURED_CATEGORIES_API, null, null, { limit });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Get hot categories
export const getHotCategories = async (limit = 4) => {
  try {
    const response = await apiconnector("GET", GET_HOT_CATEGORIES_API, null, null, { limit });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Get trending categories
export const getTrendingCategories = async (limit = 4) => {
  try {
    const response = await apiconnector("GET", GET_TRENDING_CATEGORIES_API, null, null, { limit });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Get top selling categories
export const getTopSellingCategories = async (limit = 4) => {
  try {
    const response = await apiconnector("GET", GET_TOP_SELLING_CATEGORIES_API, null, null, { limit });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Get new categories
export const getNewCategories = async (limit = 4) => {
  try {
    const response = await apiconnector("GET", GET_NEW_CATEGORIES_API, null, null, { limit });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Get category stats (public)
export const getCategoryStats = async () => {
  try {
    const response = await apiconnector("GET", GET_CATEGORY_STATS_API);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// ==================== ADMIN ENDPOINTS ====================

// Get all categories (admin with pagination)
export const getAdminCategories = async (token, params = {}) => {
  try {
    const response = await apiconnector("GET", GET_ADMIN_CATEGORIES_API, null, {
      Authorization: `Bearer ${token}`,
    }, params);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create category (admin only)
export const createCategory = async (formData, token) => {
  try {
    const response = await apiconnector("POST", CREATE_CATEGORY_API, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update category (admin only)
export const updateCategory = async (id, formData, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_CATEGORY_API(id), formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete category (admin only)
export const deleteCategory = async (id, token) => {
  try {
    const response = await apiconnector("DELETE", DELETE_CATEGORY_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload category image
export const uploadCategoryImage = async (imageFile, token) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await apiconnector("POST", UPLOAD_CATEGORY_IMAGE_API, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle category active status
export const toggleCategoryActive = async (id, token) => {
  try {
    const response = await apiconnector("PATCH", TOGGLE_CATEGORY_ACTIVE_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle category featured status
export const toggleCategoryFeatured = async (id, token) => {
  try {
    const response = await apiconnector("PATCH", TOGGLE_CATEGORY_FEATURED_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle category hot status
export const toggleCategoryHot = async (id, token) => {
  try {
    const response = await apiconnector("PATCH", TOGGLE_CATEGORY_HOT_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle category trending status
export const toggleCategoryTrending = async (id, token) => {
  try {
    const response = await apiconnector("PATCH", TOGGLE_CATEGORY_TRENDING_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle category new status
export const toggleCategoryNew = async (id, token) => {
  try {
    const response = await apiconnector("PATCH", TOGGLE_CATEGORY_NEW_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle category top selling status
export const toggleCategoryTopSelling = async (id, token) => {
  try {
    const response = await apiconnector("PATCH", TOGGLE_CATEGORY_TOP_SELLING_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update category order
export const updateCategoryOrder = async (id, order, token) => {
  try {
    const response = await apiconnector("PATCH", UPDATE_CATEGORY_ORDER_API(id), { order }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Bulk update category orders
export const bulkUpdateCategoryOrder = async (categories, token) => {
  try {
    const response = await apiconnector("PATCH", BULK_UPDATE_CATEGORY_ORDER_API, { categories }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Sync product counts
export const syncProductCounts = async (token) => {
  try {
    const response = await apiconnector("POST", SYNC_PRODUCT_COUNTS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
