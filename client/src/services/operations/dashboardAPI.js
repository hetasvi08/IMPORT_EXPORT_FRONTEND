import { apiconnector } from '../apiconnector';
import { dashboardEndpoints, authEndpoints, quoteEndpoints, shipmentEndpoints, notificationEndpoints } from '../apis';

// Get Dashboard Stats
export const getDashboardStats = async (token) => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_STATS_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Dashboard Overview
export const getDashboardOverview = async (token) => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_OVERVIEW_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Recent Activity
export const getRecentActivity = async (token) => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_ACTIVITY_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Profile
export const getUserProfile = async (token) => {
  try {
    const response = await apiconnector('GET', authEndpoints.GET_ME_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update User Profile
export const updateUserProfile = async (data, token) => {
  try {
    const response = await apiconnector('PUT', authEndpoints.UPDATE_PROFILE_API, data, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Orders
export const getUserOrders = async (params = {}, token) => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_ORDERS_API, null, token ? { Authorization: `Bearer ${token}` } : null, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Order Stats
export const getUserOrderStats = async (token) => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_ORDER_STATS_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Quotes
export const getUserQuotes = async (params = {}, token) => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_QUOTES_API, null, token ? { Authorization: `Bearer ${token}` } : null, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Quote Stats
export const getUserQuoteStats = async (token) => {
  try {
    const response = await apiconnector('GET', quoteEndpoints.GET_QUOTE_STATS_API || dashboardEndpoints.GET_STATS_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Shipments
export const getUserShipments = async (params = {}, token) => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_SHIPMENTS_API, null, token ? { Authorization: `Bearer ${token}` } : null, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Shipment Stats
export const getUserShipmentStats = async (token) => {
  try {
    const response = await apiconnector('GET', shipmentEndpoints.GET_SHIPMENT_STATS_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Favorites
export const getUserFavorites = async (token) => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_FAVORITES_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add to Favorites
export const addToFavorites = async (productId, token) => {
  try {
    const response = await apiconnector('POST', dashboardEndpoints.ADD_TO_FAVORITES_API(productId), null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Remove from Favorites
export const removeFromFavorites = async (favoriteId, token) => {
  try {
    const response = await apiconnector('DELETE', dashboardEndpoints.REMOVE_FROM_FAVORITES_API(favoriteId), null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Notifications
export const getUserNotifications = async (token) => {
  try {
    const response = await apiconnector('GET', notificationEndpoints.GET_ALL_NOTIFICATIONS_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark Notification as Read
export const markNotificationRead = async (notificationId, token) => {
  try {
    const response = await apiconnector('PUT', notificationEndpoints.MARK_AS_READ_API(notificationId), null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark All Notifications as Read
export const markAllNotificationsRead = async (token) => {
  try {
    const response = await apiconnector('PUT', notificationEndpoints.MARK_ALL_AS_READ_API, null, token ? { Authorization: `Bearer ${token}` } : null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ==================== CHART DATA APIs ====================

// Get Spending Trend Chart Data
export const getSpendingTrendChart = async (days = 7, token) => {
  try {
    const response = await apiconnector(
      'GET',
      `${dashboardEndpoints.GET_SPENDING_TREND_API || '/api/dashboard/charts/spending-trend'}?days=${days}`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Orders By Status Chart Data
export const getOrdersByStatusChart = async (token) => {
  try {
    const response = await apiconnector(
      'GET',
      dashboardEndpoints.GET_ORDERS_BY_STATUS_API || '/api/dashboard/charts/orders-by-status',
      null,
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Spending By Category Chart Data
export const getSpendingByCategoryChart = async (token) => {
  try {
    const response = await apiconnector(
      'GET',
      dashboardEndpoints.GET_SPENDING_BY_CATEGORY_API || '/api/dashboard/charts/spending-by-category',
      null,
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Monthly Orders Chart Data
export const getMonthlyOrdersChart = async (months = 6, token) => {
  try {
    const response = await apiconnector(
      'GET',
      `${dashboardEndpoints.GET_MONTHLY_ORDERS_API || '/api/dashboard/charts/monthly-orders'}?months=${months}`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
