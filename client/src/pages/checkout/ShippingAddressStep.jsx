import { useState } from 'react';
import { MapPin, User, Mail, Phone, Building, Globe, FileText, ChevronDown } from 'lucide-react';

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
  'France', 'India', 'China', 'Japan', 'Brazil', 'Mexico', 'Spain',
  'Italy', 'Netherlands', 'Singapore', 'South Korea', 'UAE', 'Other'
];

const ShippingAddressStep = ({ 
  shippingAddress, 
  setShippingAddress, 
  billingAddress, 
  setBillingAddress,
  orderNotes,
  setOrderNotes 
}) => {
  const [showBilling, setShowBilling] = useState(!billingAddress.sameAsShipping);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSameAsShipping = (checked) => {
    setBillingAddress(prev => ({ ...prev, sameAsShipping: checked }));
    setShowBilling(!checked);
  };

  return (
    <div className="space-y-6">
      {/* Shipping Address */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Address
          </h3>
          <p className="text-emerald-100 text-sm">Where should we deliver your order?</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleShippingChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleShippingChange}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleShippingChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Company (Optional) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Company Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Building className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="company"
                  value={shippingAddress.company}
                  onChange={handleShippingChange}
                  placeholder="Your Company Ltd."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Street Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Street Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <textarea
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleShippingChange}
                  placeholder="123 Main Street, Suite 100"
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  required
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleShippingChange}
                placeholder="New York"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                State / Province
              </label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleShippingChange}
                placeholder="NY"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleShippingChange}
                placeholder="10001"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none bg-white"
                  required
                >
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Billing Address
          </h3>
          <p className="text-blue-100 text-sm">Address for your invoice</p>
        </div>

        <div className="p-6">
          {/* Same as shipping checkbox */}
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={billingAddress.sameAsShipping}
              onChange={(e) => handleSameAsShipping(e.target.checked)}
              className="w-5 h-5 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span className="text-slate-700 font-medium">Same as shipping address</span>
          </label>

          {/* Billing address form */}
          {showBilling && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={billingAddress.fullName}
                  onChange={handleBillingChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={billingAddress.email}
                  onChange={handleBillingChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={billingAddress.phone}
                  onChange={handleBillingChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Street */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address</label>
                <textarea
                  name="street"
                  value={billingAddress.street}
                  onChange={handleBillingChange}
                  placeholder="123 Main Street"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={billingAddress.city}
                  onChange={handleBillingChange}
                  placeholder="New York"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <input
                  type="text"
                  name="state"
                  value={billingAddress.state}
                  onChange={handleBillingChange}
                  placeholder="NY"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Zip */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={billingAddress.zipCode}
                  onChange={handleBillingChange}
                  placeholder="10001"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                <select
                  name="country"
                  value={billingAddress.country}
                  onChange={handleBillingChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white"
                >
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Notes */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Order Notes
          </h3>
          <p className="text-amber-100 text-sm">Any special instructions for your order</p>
        </div>

        <div className="p-6">
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Add any special instructions, delivery preferences, or notes for your order..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressStep;
