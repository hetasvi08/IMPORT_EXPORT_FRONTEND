import { apiConnector } from "../apiconnector";
import { supplierEndpoints } from "../apis";

const {
  GET_SUPPLIER_DASHBOARD_API,
  GET_MY_SUPPLIER_PROFILE_API,
  UPDATE_MY_SUPPLIER_PROFILE_API,
  GET_MY_PRODUCTS_API,
  GET_MY_PRODUCT_STATS_API,
  GET_MY_PRODUCT_BY_ID_API,
  CREATE_MY_PRODUCT_API,
  UPDATE_MY_PRODUCT_API,
  DELETE_MY_PRODUCT_API,
  UPLOAD_MY_PRODUCT_IMAGE_API,
  GET_MY_ORDERS_API,
  GET_MY_ORDER_BY_ID_API,
  UPDATE_MY_ORDER_STATUS_API,
  GET_MY_QUOTES_API,
  RESPOND_TO_QUOTE_API,
} = supplierEndpoints;

// ======================= DASHBOARD =======================

// Get supplier dashboard stats
export const getSupplierDashboard = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_SUPPLIER_DASHBOARD_API,
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

// ======================= PROFILE =======================

// Get supplier profile
export const getSupplierProfile = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_MY_SUPPLIER_PROFILE_API,
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

// Update supplier profile
export const updateSupplierProfile = async (profileData, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_MY_SUPPLIER_PROFILE_API,
      profileData,
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

// ======================= PRODUCTS =======================

// Get all supplier's products
export const getSupplierProducts = async (token, params = {}) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_MY_PRODUCTS_API,
      null,
      { Authorization: `Bearer ${token}` },
      params
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get supplier product stats
export const getSupplierProductStats = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_MY_PRODUCT_STATS_API,
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

// Get single product by ID
export const getSupplierProductById = async (id, token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_MY_PRODUCT_BY_ID_API(id),
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

// Create new product
export const createSupplierProduct = async (productData, token) => {
  try {
    const response = await apiConnector(
      "POST",
      CREATE_MY_PRODUCT_API,
      productData,
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

// Update product
export const updateSupplierProduct = async (id, productData, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_MY_PRODUCT_API(id),
      productData,
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

// Delete product
export const deleteSupplierProduct = async (id, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_MY_PRODUCT_API(id),
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

// Upload product image
export const uploadSupplierProductImage = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiConnector(
      "POST",
      UPLOAD_MY_PRODUCT_IMAGE_API,
      formData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// ======================= ORDERS =======================

// Get supplier's orders
export const getSupplierOrders = async (token, params = {}) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_MY_ORDERS_API,
      null,
      { Authorization: `Bearer ${token}` },
      params
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get order by ID
export const getSupplierOrderById = async (id, token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_MY_ORDER_BY_ID_API(id),
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

// Update order status
export const updateSupplierOrderStatus = async (id, status, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_MY_ORDER_STATUS_API(id),
      { status },
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

// ======================= QUOTES =======================

// Get supplier's quotes
export const getSupplierQuotes = async (token, params = {}) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_MY_QUOTES_API,
      null,
      { Authorization: `Bearer ${token}` },
      params
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Respond to quote
export const respondToSupplierQuote = async (id, responseData, token) => {
  try {
    const response = await apiConnector(
      "POST",
      RESPOND_TO_QUOTE_API(id),
      responseData,
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
