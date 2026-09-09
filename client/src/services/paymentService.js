import { apiConnector } from './apiconnector';
import { paymentEndpoints } from './apis';

const {
  CREATE_STRIPE_INTENT_API,
  CONFIRM_STRIPE_PAYMENT_API,
  GET_BANK_DETAILS_API,
  SUBMIT_BANK_TRANSFER_API,
  GET_ORDER_PAYMENT_DETAILS_API,
  GET_MY_PAYMENTS_API,
} = paymentEndpoints;

// ============================================
// STRIPE PAYMENT FUNCTIONS
// ============================================

/**
 * Create Stripe payment intent for an order
 * @param {string} orderId - Order ID
 * @param {string} paymentType - 'advance', 'remaining', or 'full'
 * @param {string} token - Auth token
 */
export const createStripePaymentIntent = async (orderId, paymentType, token) => {
  try {
    const response = await apiConnector('POST', CREATE_STRIPE_INTENT_API, 
      { orderId, paymentType },
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {throw error.response?.data || error;
  }
};

/**
 * Confirm Stripe payment after successful card payment
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @param {string} paymentId - Our database payment ID
 * @param {string} token - Auth token
 */
export const confirmStripePayment = async (paymentIntentId, paymentId, token) => {
  try {
    const response = await apiConnector('POST', CONFIRM_STRIPE_PAYMENT_API,
      { paymentIntentId, paymentId },
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {throw error.response?.data || error;
  }
};

// ============================================
// BANK TRANSFER FUNCTIONS
// ============================================

/**
 * Get bank details for manual transfer
 * @param {string} token - Auth token
 */
export const getBankDetails = async (token) => {
  try {
    const response = await apiConnector('GET', GET_BANK_DETAILS_API, null,
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {throw error.response?.data || error;
  }
};

/**
 * Submit bank transfer proof for verification
 * @param {Object} transferData - Transfer details
 * @param {string} token - Auth token
 */
export const submitBankTransferProof = async (transferData, token) => {
  try {
    const response = await apiConnector('POST', SUBMIT_BANK_TRANSFER_API,
      transferData,
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {throw error.response?.data || error;
  }
};

// ============================================
// ORDER PAYMENT FUNCTIONS
// ============================================

/**
 * Get payment details for an order (amounts, status, bank info)
 * @param {string} orderId - Order ID
 * @param {string} token - Auth token
 */
export const getOrderPaymentDetails = async (orderId, token) => {
  try {
    const response = await apiConnector('GET', GET_ORDER_PAYMENT_DETAILS_API(orderId), null,
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {throw error.response?.data || error;
  }
};

/**
 * Get user's payment history
 * @param {string} token - Auth token
 */
export const getMyPayments = async (token) => {
  try {
    const response = await apiConnector('GET', GET_MY_PAYMENTS_API, null,
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {throw error.response?.data || error;
  }
};
