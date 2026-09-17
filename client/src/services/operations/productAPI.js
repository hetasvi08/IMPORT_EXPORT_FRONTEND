import { apiconnector } from "../apiconnector";
import { productEndpoints } from "../apis";

const {
  GET_ALL_PRODUCTS_API,
  GET_PRODUCT_BY_ID_API,
  GET_FEATURED_PRODUCTS_API,
  GET_PRODUCTS_BY_CATEGORY_API,
  GET_PRODUCTS_BY_SUPPLIER_API,
  CREATE_PRODUCT_API,
  UPDATE_PRODUCT_API,
  DELETE_PRODUCT_API,
  UPDATE_STOCK_API,
  TOGGLE_FEATURED_API,
} = productEndpoints;

// Get all products with filters
export const getAllProducts = async (params = {}) => {
  try {
    const response = await apiconnector("GET", GET_ALL_PRODUCTS_API, null, null, params);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch products");
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single product
export const getProductById = async (id) => {
  try {
    const response = await apiconnector("GET", GET_PRODUCT_BY_ID_API(id));

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch product");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    const response = await apiconnector("GET", GET_FEATURED_PRODUCTS_API);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch featured products");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get products by category
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await apiconnector("GET", GET_PRODUCTS_BY_CATEGORY_API(categoryId));

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch products by category");
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get products by supplier
export const getProductsBySupplier = async (supplierId) => {
  try {
    const response = await apiconnector("GET", GET_PRODUCTS_BY_SUPPLIER_API(supplierId));

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch products by supplier");
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create product (supplier/admin only)
export const createProduct = async (productData, token) => {
  try {
    const response = await apiconnector("POST", CREATE_PRODUCT_API, productData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create product");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update product (supplier/admin only)
export const updateProduct = async (id, productData, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_PRODUCT_API(id), productData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update product");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete product (supplier/admin only)
export const deleteProduct = async (id, token) => {
  try {
    const response = await apiconnector("DELETE", DELETE_PRODUCT_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete product");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update stock (supplier/admin only)
export const updateStock = async (id, stockData, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_STOCK_API(id), stockData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update stock");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Toggle featured (admin only)
export const toggleFeatured = async (id, token) => {
  try {
    const response = await apiconnector("PUT", TOGGLE_FEATURED_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to toggle featured status");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
