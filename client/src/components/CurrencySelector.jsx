import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrency, setCurrency } from '../store/slices/currencySlice';
import { currencyOptions } from '../utils/currency';

const CurrencySelector = ({ className = '', compact = false }) => {
  const dispatch = useDispatch();
  const selectedCurrency = useSelector(selectCurrency);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentCurrency = currencyOptions.find(c => c.code === selectedCurrency) || currencyOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (currencyCode) => {
    dispatch(setCurrency(currencyCode));
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-emerald-400/50 rounded-lg transition-all duration-300"
          title="Select Currency"
        >
          <span className="text-sm font-bold text-emerald-400">{currentCurrency.symbol}</span>
          <span className="text-white text-xs font-semibold">{currentCurrency.code}</span>
          <ChevronDown
            className={`w-3 h-3 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 animate-fadeIn z-50">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 border-b border-slate-600">
              <p className="text-white text-xs font-semibold">Select Currency</p>
            </div>
            <div className="p-1.5">
              {currencyOptions.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleSelect(currency.code)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                    selectedCurrency === currency.code
                      ? 'bg-emerald-500/20 border border-emerald-500/30'
                      : 'hover:bg-slate-700/50 border border-transparent'
                  }`}
                >
                  <span className={`text-lg font-bold min-w-[24px] ${selectedCurrency === currency.code ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {currency.symbol}
                  </span>
                  <div className="flex-1 text-left">
                    <span className={`text-sm font-semibold ${selectedCurrency === currency.code ? 'text-emerald-400' : 'text-white'}`}>
                      {currency.code}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5">{currency.name}</span>
                  </div>
                  {selectedCurrency === currency.code && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-emerald-400/50 rounded-xl transition-all duration-300"
        title="Select Currency"
      >
        <span className="text-lg font-bold text-emerald-400">{currentCurrency.symbol}</span>
        <div className="text-left">
          <span className="text-white text-sm font-semibold">{currentCurrency.code}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 animate-fadeIn z-50">
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-3 py-2 border-b border-slate-700">
            <p className="text-white text-xs font-semibold">Select Currency</p>
            <p className="text-slate-400 text-[10px]">Prices will be converted</p>
          </div>
          <div className="p-1.5 max-h-60 overflow-y-auto">
            {currencyOptions.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleSelect(currency.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  selectedCurrency === currency.code
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'hover:bg-slate-700/50 text-white border border-transparent'
                }`}
              >
                <span className={`text-xl font-bold min-w-[28px] ${selectedCurrency === currency.code ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {currency.symbol}
                </span>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-semibold ${selectedCurrency === currency.code ? 'text-emerald-400' : 'text-white'}`}>
                    {currency.code}
                  </p>
                  <p className="text-[10px] text-slate-400">{currency.name}</p>
                </div>
                {selectedCurrency === currency.code && (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
