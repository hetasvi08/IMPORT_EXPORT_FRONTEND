import { apiconnector } from "../apiconnector";
import { authEndpoints } from "../apis";

const {
  REGISTER_API,
  LOGIN_API,
  LOGOUT_API,
  GET_ME_API,
  UPDATE_PROFILE_API,
  UPDATE_PASSWORD_API,
  FORGOT_PASSWORD_API,
  RESET_PASSWORD_API,
  VERIFY_EMAIL_API,
} = authEndpoints;

// Register new user
export const register = async (userData) => {
  try {
    const response = await apiconnector("POST", REGISTER_API, userData);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await apiconnector("POST", LOGIN_API, credentials);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    await apiconnector("POST", LOGOUT_API);
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (token) => {
  try {
    const response = await apiconnector("GET", GET_ME_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // Update stored user data
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
throw error;
  }
};

// Update profile
export const updateProfile = async (userData, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_PROFILE_API, userData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    // Update stored user data
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update password
export const updatePassword = async (passwordData, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_PASSWORD_API, passwordData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    // Update token if new one is returned
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await apiconnector("POST", FORGOT_PASSWORD_API, { email });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await apiconnector("PUT", RESET_PASSWORD_API(token), { password });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await apiconnector("GET", VERIFY_EMAIL_API(token));

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Get stored user
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem("token");
};
