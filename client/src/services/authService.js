import { apiconnector } from './apiconnector';
import { authEndpoints } from './apis';

const {
  REGISTER_API,
  LOGIN_API,
  LOGOUT_API,
  GET_ME_API,
  UPDATE_PROFILE_API,
  UPDATE_PASSWORD_API,
  FORGOT_PASSWORD_API,
  RESET_PASSWORD_API,
} = authEndpoints;

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await apiconnector('POST', REGISTER_API, userData);
    
    // Check if registration failed (400 errors don't throw due to validateStatus config)
    if (response.data?.success === false) {
      throw new Error(response.data?.message || 'Registration failed');
    }
    
    const token = response.data?.data?.token || response.data?.token;
    const user = response.data?.data?.user || response.data?.user;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data?.data || response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiconnector('POST', LOGIN_API, credentials);
    const token = response.data?.data?.token || response.data?.token;
    const user = response.data?.data?.user || response.data?.user;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data?.data || response.data;
  },

  // Logout user
  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      await apiconnector('POST', LOGOUT_API, null, {
        Authorization: `Bearer ${token}`,
      });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getMe: async () => {
    const token = localStorage.getItem('token');
    const response = await apiconnector('GET', GET_ME_API, null, {
      Authorization: `Bearer ${token}`,
    });
    const user = response.data?.data?.user || response.data?.user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data?.data || response.data;
  },

  // Update user details
  updateDetails: async (data) => {
    const token = localStorage.getItem('token');
    const response = await apiconnector('PUT', UPDATE_PROFILE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Update password
  updatePassword: async (data) => {
    const token = localStorage.getItem('token');
    const response = await apiconnector('PUT', UPDATE_PASSWORD_API, data, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiconnector('POST', FORGOT_PASSWORD_API, { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetToken, password) => {
    const response = await apiconnector('PUT', RESET_PASSWORD_API(resetToken), { password });
    return response.data;
  },
};

export default authService;
