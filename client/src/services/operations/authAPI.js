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
  RESEND_CODE_API,
  GOOGLE_AUTH_API,
  GET_SETTINGS_API,
  UPDATE_SETTINGS_API,
} = authEndpoints;

// Register new user
export const register = async (userData) => {
  try {
    const response = await apiconnector("POST", REGISTER_API, userData);

    if (!response.data.success) {
      throw new Error(response.data.message || "Registration failed");
    }

    // Store token and user data
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await apiconnector("POST", LOGIN_API, credentials);

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    // Store token and user data
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout user
export const logout = async () => {
  try {
    await apiconnector("POST", LOGOUT_API);
  } finally {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

// Get current user
export const getCurrentUser = async (token) => {
  try {
    const response = await apiconnector("GET", GET_ME_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch user");
    }

    // Update stored user data
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update profile
export const updateProfile = async (userData, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_PROFILE_API, userData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update profile");
    }

    // Update stored user data
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update password
export const updatePassword = async (passwordData, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_PASSWORD_API, passwordData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update password");
    }

    // Update token if new one is returned
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await apiconnector("POST", FORGOT_PASSWORD_API, { email });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send reset email");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await apiconnector("PUT", RESET_PASSWORD_API(token), { password });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to reset password");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Verify email
export const verifyEmail = async (data) => {
  try {
    const response = await apiconnector("POST", VERIFY_EMAIL_API, data);

    if (!response.data.success) {
      throw new Error(response.data.message || "Email verification failed");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Resend verification code
export const resendVerificationCode = async (data) => {
  try {
    const response = await apiconnector("POST", RESEND_CODE_API, data);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to resend verification code");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Google Auth
export const googleAuth = async (token) => {
  try {
    const response = await apiconnector("POST", GOOGLE_AUTH_API, { token });

    if (!response.data.success) {
      throw new Error(response.data.message || "Google authentication failed");
    }

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get settings
export const getSettings = async (token) => {
  try {
    const response = await apiconnector("GET", GET_SETTINGS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch settings");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update settings
export const updateSettings = async (settingsData, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_SETTINGS_API, settingsData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update settings");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
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
