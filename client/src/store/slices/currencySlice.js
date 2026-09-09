import { createSlice, createSelector } from '@reduxjs/toolkit';

// Exchange rates relative to INR (base currency)
// These are approximate rates - in production, you'd fetch real-time rates from an API
const exchangeRates = {
  INR: 1,          // Indian Rupee (base)
  USD: 0.012,      // 1 INR = 0.012 USD (approx)
  AED: 0.044,      // 1 INR = 0.044 AED (approx)
  EUR: 0.011,      // 1 INR = 0.011 EUR (approx)
};

const currencySymbols = {
  INR: '₹',
  USD: '$',
  AED: 'د.إ',
  EUR: '€',
};

const currencyNames = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  AED: 'UAE Dirham',
  EUR: 'Euro',
};

// Get saved currency from localStorage or default to INR
const getSavedCurrency = () => {
  try {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved && exchangeRates[saved]) {
      return saved;
    }
  } catch (e) {}
  return 'INR';
};

const initialState = {
  selectedCurrency: getSavedCurrency(),
  exchangeRates,
  currencySymbols,
  currencyNames,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      const currency = action.payload;
      if (exchangeRates[currency]) {
        state.selectedCurrency = currency;
        // Save to localStorage
        try {
          localStorage.setItem('selectedCurrency', currency);
        } catch (e) {}
      }
    },
    updateExchangeRates: (state, action) => {
      // For future use - update rates from API
      state.exchangeRates = { ...state.exchangeRates, ...action.payload };
    },
  },
});

export const { setCurrency, updateExchangeRates } = currencySlice.actions;

// Selectors
export const selectCurrency = (state) => state.currency.selectedCurrency;
export const selectExchangeRates = (state) => state.currency.exchangeRates;
export const selectCurrencySymbols = (state) => state.currency.currencySymbols;
export const selectCurrencyNames = (state) => state.currency.currencyNames;
export const selectCurrencySymbol = (state) => state.currency.currencySymbols[state.currency.selectedCurrency];

// Memoized selector to prevent unnecessary re-renders
export const selectCurrencyInfo = createSelector(
  [selectCurrency, selectCurrencySymbols, selectCurrencyNames, selectExchangeRates],
  (code, symbols, names, rates) => ({
    code,
    symbol: symbols[code],
    name: names[code],
    rate: rates[code],
  })
);

export default currencySlice.reducer;
