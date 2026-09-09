import { apiconnector } from "../apiconnector";
import { siteStatsEndpoints } from "../apis";

const {
  GET_SITE_STATS_API,
  UPDATE_SITE_STATS_API,
  RESET_SITE_STATS_API,
} = siteStatsEndpoints;

// ==================== PUBLIC ENDPOINTS ====================

// Get site statistics (public - no auth required)
export const getSiteStats = async () => {
  try {
    const response = await apiconnector("GET", GET_SITE_STATS_API);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// ==================== ADMIN ENDPOINTS ====================

// Update site statistics (admin only)
export const updateSiteStats = async (data, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_SITE_STATS_API, data, {
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

// Reset site statistics to defaults (admin only)
export const resetSiteStats = async (token) => {
  try {
    const response = await apiconnector("POST", RESET_SITE_STATS_API, null, {
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
