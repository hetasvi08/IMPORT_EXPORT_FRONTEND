import { useSelector } from 'react-redux';
import { selectCurrency, selectCurrencyInfo } from '../store/slices/currencySlice';
import { convertAndFormatPrice, convertPrice, convertToINR, getCurrencySymbol } from '../utils/currency';

/**
 * Custom hook for currency conversion and formatting
 * Usage:
 *   const { formatAmount, symbol, currency, toINR } = useCurrency();
 *   <span>{formatAmount(product.price)}</span>
 */
export const useCurrency = () => {
  const selectedCurrency = useSelector(selectCurrency);
  const currencyInfo = useSelector(selectCurrencyInfo);

  /**
   * Convert and format a price from INR to selected currency
   * @param {number} priceInINR - Price in Indian Rupees
   * @param {object} options - Formatting options
   * @returns {string} Formatted price string
   */
  const formatAmount = (priceInINR, options = {}) => {
    return convertAndFormatPrice(priceInINR, selectedCurrency, options);
  };

  /**
   * Just convert price without formatting
   * @param {number} priceInINR - Price in INR
   * @returns {number} Converted price
   */
  const convert = (priceInINR) => {
    return convertPrice(priceInINR, selectedCurrency);
  };

  /**
   * Convert price from selected currency back to INR
   * @param {number} priceInCurrency - Price in selected currency
   * @returns {number} Price in INR
   */
  const toINR = (priceInCurrency) => {
    return convertToINR(priceInCurrency, selectedCurrency);
  };

  /**
   * Get the current currency symbol
   * @returns {string} Currency symbol
   */
  const symbol = getCurrencySymbol(selectedCurrency);

  return {
    formatAmount,
    convert,
    toINR,
    symbol,
    currency: selectedCurrency,
    currencyInfo,
  };
};

export default useCurrency;
