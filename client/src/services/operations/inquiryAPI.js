import { apiconnector } from '../apiconnector';
import { quoteEndpoints } from '../apis';

// Create product inquiry (uses quote system)
export const createInquiry = async (inquiryData, token) => {
  try {
    const response = await apiconnector(
      'POST',
      quoteEndpoints.CREATE_QUOTE_API,
      inquiryData,
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

// Get user's inquiries
export const getMyInquiries = async (token) => {
  try {
    const response = await apiconnector(
      'GET',
      quoteEndpoints.GET_MY_QUOTES_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      return response.data;
    }
    return null;
  } catch {
    return null;
  }
};

// Get single inquiry
export const getInquiryById = async (id, token) => {
  try {
    const response = await apiconnector(
      'GET',
      quoteEndpoints.GET_QUOTE_BY_ID_API(id),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      return response.data;
    }
    return null;
  } catch {
    return null;
  }
};

// Accept a quote/inquiry
export const acceptQuote = async (id, token) => {
  try {
    const response = await apiconnector(
      'PUT',
      quoteEndpoints.ACCEPT_QUOTE_API(id),
      {},
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

// Reject a quote/inquiry
export const rejectQuote = async (id, rejectionCategory, reason, token) => {
  try {
    const response = await apiconnector(
      'PUT',
      quoteEndpoints.REJECT_QUOTE_API(id),
      { rejectionCategory, reason },
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
