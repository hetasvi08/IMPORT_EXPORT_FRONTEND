import { apiconnector } from '../apiconnector';
import { dashboardEndpoints } from '../apis';

// Get Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_DASHBOARD_STATS_API);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Dashboard Overview
export const getDashboardOverview = async () => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_DASHBOARD_OVERVIEW_API);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Recent Activity
export const getRecentActivity = async () => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_RECENT_ACTIVITY_API);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Profile
export const getUserProfile = async () => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_USER_PROFILE_API);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update User Profile
export const updateUserProfile = async (data) => {
  try {
    const response = await apiconnector('PUT', dashboardEndpoints.UPDATE_USER_PROFILE_API, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Orders
export const getUserOrders = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = dashboardEndpoints.GET_USER_ORDERS_API + (queryString ? `?${queryString}` : '');
    const response = await apiconnector('GET', url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Order Stats
export const getUserOrderStats = async () => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_USER_ORDER_STATS_API);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Quotes
export const getUserQuotes = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = dashboardEndpoints.GET_USER_QUOTES_API + (queryString ? `?${queryString}` : '');
    const response = await apiconnector('GET', url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Quote Stats
export const getUserQuoteStats = async () => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_USER_QUOTE_STATS_API);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Shipments
export const getUserShipments = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = dashboardEndpoints.GET_USER_SHIPMENTS_API + (queryString ? `?${queryString}` : '');
    const response = await apiconnector('GET', url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Shipment Stats
export const getUserShipmentStats = async () => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_USER_SHIPMENT_STATS_API);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Favorites
export const getUserFavorites = async () => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_USER_FAVORITES_API);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add to Favorites
export const addToFavorites = async (productId) => {
  try {
    const response = await apiconnector('POST', dashboardEndpoints.ADD_TO_FAVORITES_API, { productId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Remove from Favorites
export const removeFromFavorites = async (favoriteId) => {
  try {
    const response = await apiconnector('DELETE', dashboardEndpoints.REMOVE_FROM_FAVORITES_API(favoriteId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Notifications
export const getUserNotifications = async () => {
  try {
    const response = await apiconnector('GET', dashboardEndpoints.GET_USER_NOTIFICATIONS_API);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark Notification as Read
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await apiconnector('PUT', dashboardEndpoints.MARK_NOTIFICATION_READ_API(notificationId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark All Notifications as Read
export const markAllNotificationsRead = async () => {
  try {
    const response = await apiconnector('PUT', dashboardEndpoints.MARK_ALL_NOTIFICATIONS_READ_API);
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
