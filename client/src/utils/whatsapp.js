// WhatsApp Utility Functions

const SUPPORT_NUMBER = import.meta.env.VITE_WHATSAPP_SUPPORT_NUMBER || '919909246267';
export const RAW_SUPPORT_NUMBER = String(SUPPORT_NUMBER).replace(/\D/g, '');
export const FORMATTED_SUPPORT_NUMBER = '+' + (RAW_SUPPORT_NUMBER.length === 10 ? '91 ' + RAW_SUPPORT_NUMBER : RAW_SUPPORT_NUMBER.slice(0, 2) + ' ' + RAW_SUPPORT_NUMBER.slice(2));
export const WHATSAPP_API_URL = 'https://api.whatsapp.com/send?phone=' + (RAW_SUPPORT_NUMBER.length === 10 ? '91' + RAW_SUPPORT_NUMBER : RAW_SUPPORT_NUMBER);
export const SUPPORT_CONTACT_NUMBERS = [
  FORMATTED_SUPPORT_NUMBER,
  '+91 8866897043',
  '+91 99040 48673'
];
export const SUPPORT_CONTACT_NUMBERS_TEXT = SUPPORT_CONTACT_NUMBERS.join(', ');
export const SUPPORT_CONTACT_TEL_NUMBERS = SUPPORT_CONTACT_NUMBERS.map((number) => number.replace(/\D/g, ''));

/**
 * Generate WhatsApp click-to-chat URL
 * @param {string} phoneNumber - Phone number with country code (no + sign)
 * @param {string} message - Pre-filled message (optional)
 * @returns {string} WhatsApp URL
 */
export const getWhatsAppUrl = (phoneNumber, message = '') => {
  // 1. Remove any spaces, pluses, or dashes
  let cleanPhone = String(phoneNumber).replace(/\D/g, '');
  
  // 2. If it's exactly 10 digits, assume it's an Indian mobile number and prepend '91'
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const encodedMessage = encodeURIComponent(message);
  
  // 3. Use api.whatsapp.com/send which offers the most reliable deep-linking on both OS
  return `https://api.whatsapp.com/send?phone=${cleanPhone}${message ? `&text=${encodedMessage}` : ''}`;
};

/**
 * Open WhatsApp chat with support
 * @param {string} message - Pre-filled message (optional)
 */
export const openSupportChat = (message = 'Hi, I need help with Nexarion Global Exports') => {
  const url = getWhatsAppUrl(SUPPORT_NUMBER, message);
  window.open(url, '_blank');
};

/**
 * Open WhatsApp chat with supplier
 * @param {string} supplierPhone - Supplier's phone number with country code
 * @param {object} product - Product details for pre-filled message
 */
export const contactSupplierViaWhatsApp = (supplierPhone, product = null) => {
  let message = 'Hi, I am interested in your products on Nexarion Global Exports.';
  
  if (product) {
    message = `Hi, I am interested in the following product:\n\n` +
      `*Product:* ${product.name}\n` +
      `*Price:* $${product.price}\n` +
      `*MOQ:* ${product.moq} units\n\n` +
      `Please provide more details.`;
  }
  
  const url = getWhatsAppUrl(supplierPhone, message);
  window.open(url, '_blank');
};

/**
 * Contact support about a product via WhatsApp
 * @param {object} product - Product details
 * @param {string} productUrl - Full URL to product page
 */
export const contactSupportAboutProduct = (product, productUrl) => {
  const message = `Hi, I'm interested in this product on Nexarion Global Exports:\n\n` +
    `*${product.name}*\n` +
    `Price: $${product.price}\n` +
    `MOQ: ${product.moq} units\n\n` +
    `Product Link: ${productUrl}\n\n` +
    `Please provide more information.`;
  
  const url = getWhatsAppUrl(SUPPORT_NUMBER, message);
  window.open(url, '_blank');
};

/**
 * Share product via WhatsApp (opens contact picker)
 * @param {object} product - Product details
 * @param {string} productUrl - Full URL to product page
 */
export const shareProductViaWhatsApp = (product, productUrl) => {
  const message = `Check out this product on Nexarion Global Exports!\n\n` +
    `*${product.name}*\n` +
    `Price: $${product.price}\n` +
    `MOQ: ${product.moq} units\n\n` +
    `${productUrl}`;
  
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

/**
 * Get support WhatsApp number
 * @returns {string} Support phone number
 */
export const getSupportNumber = () => SUPPORT_NUMBER;

export default {
  getWhatsAppUrl,
  openSupportChat,
  contactSupplierViaWhatsApp,
  contactSupportAboutProduct,
  shareProductViaWhatsApp,
  getSupportNumber
};
