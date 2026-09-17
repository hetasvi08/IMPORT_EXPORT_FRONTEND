import { apiconnector } from "../apiconnector";
import { catalogEndpoints } from "../apis";

const {
  GET_ALL_CATALOGS_API,
  GET_CATALOG_BY_ID_API,
  GET_FEATURED_CATALOGS_API,
  GET_CATALOGS_BY_CATEGORY_API,
  GET_CATEGORIES_WITH_COUNTS_API,
  DOWNLOAD_CATALOG_API,
  TRACK_CATALOG_VIEW_API,
  GET_ALL_CATALOGS_ADMIN_API,
  GET_CATALOG_STATS_API,
  CREATE_CATALOG_API,
  UPDATE_CATALOG_API,
  DELETE_CATALOG_API,
  UPLOAD_CATALOG_PDF_API,
  UPLOAD_CATALOG_COVER_API,
  TOGGLE_CATALOG_ACTIVE_API,
  TOGGLE_CATALOG_FEATURED_API,
} = catalogEndpoints;

// ==================== PUBLIC ENDPOINTS ====================

// Get all catalogs (public)
export const getAllCatalogs = async (params = {}) => {
  try {
    const response = await apiconnector("GET", GET_ALL_CATALOGS_API, null, null, params);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch catalogs");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single catalog by ID
export const getCatalogById = async (id) => {
  try {
    const response = await apiconnector("GET", GET_CATALOG_BY_ID_API(id));

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch catalog");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get featured catalogs
export const getFeaturedCatalogs = async (limit = 6) => {
  try {
    const response = await apiconnector("GET", GET_FEATURED_CATALOGS_API, null, null, { limit });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch featured catalogs");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get catalogs by category
export const getCatalogsByCategory = async (categoryId) => {
  try {
    const response = await apiconnector("GET", GET_CATALOGS_BY_CATEGORY_API(categoryId));

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch category catalogs");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get categories with catalog counts
export const getCategoriesWithCatalogCounts = async () => {
  try {
    const response = await apiconnector("GET", GET_CATEGORIES_WITH_COUNTS_API);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch categories with counts");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Download catalog (with optional email)
export const downloadCatalog = async (id, data = {}) => {
  try {
    const response = await apiconnector("POST", DOWNLOAD_CATALOG_API(id), data);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to download catalog");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Track catalog view
export const trackCatalogView = async (id) => {
  try {
    const response = await apiconnector("POST", TRACK_CATALOG_VIEW_API(id));
    return response.data;
  } catch {
    // Don't throw - view tracking shouldn't break user experience
    return null;
  }
};

// ==================== ADMIN ENDPOINTS ====================

// Get all catalogs (admin)
export const getAllCatalogsAdmin = async (token, params = {}) => {
  try {
    const response = await apiconnector(
      "GET",
      GET_ALL_CATALOGS_ADMIN_API,
      null,
      { Authorization: `Bearer ${token}` },
      params
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch admin catalogs");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get catalog statistics
export const getCatalogStats = async (token) => {
  try {
    const response = await apiconnector("GET", GET_CATALOG_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch catalog stats");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create catalog
export const createCatalog = async (token, data) => {
  try {
    const response = await apiconnector("POST", CREATE_CATALOG_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create catalog");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update catalog
export const updateCatalog = async (token, id, data) => {
  try {
    const response = await apiconnector("PUT", UPDATE_CATALOG_API(id), data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update catalog");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete catalog
export const deleteCatalog = async (token, id) => {
  try {
    const response = await apiconnector("DELETE", DELETE_CATALOG_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete catalog");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Upload catalog PDF
export const uploadCatalogPdf = async (token, file) => {
  try {
    const formData = new FormData();
    formData.append("pdf", file);

    const response = await apiconnector("POST", UPLOAD_CATALOG_PDF_API, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to upload catalog PDF");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Upload catalog cover image
export const uploadCatalogCover = async (token, file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiconnector("POST", UPLOAD_CATALOG_COVER_API, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to upload catalog cover");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Toggle catalog active status
export const toggleCatalogActive = async (token, id) => {
  try {
    const response = await apiconnector("PATCH", TOGGLE_CATALOG_ACTIVE_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to toggle catalog active status");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Toggle catalog featured status
export const toggleCatalogFeatured = async (token, id) => {
  try {
    const response = await apiconnector("PATCH", TOGGLE_CATALOG_FEATURED_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to toggle catalog featured status");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
