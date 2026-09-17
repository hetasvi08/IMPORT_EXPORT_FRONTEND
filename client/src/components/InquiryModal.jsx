import {
  AlertCircle,
  Building2,
  CheckCircle,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Send,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInquiry } from '../services/operations/inquiryAPI';

import useCurrency from '../hooks/useCurrency';

const InquiryModal = ({ isOpen, onClose, product }) => {
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);
  const { formatAmount } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    quantity: product?.moq || 1,
    description: '',
    targetPrice: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryCountry: '',
    urgency: 'Medium',
    specifications: ''
  });

  if (!isOpen) return null;

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return createPortal(
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">
              Please login to raise an inquiry for this product.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Success state
  if (success) {
    return createPortal(
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Your inquiry has been sent to the supplier. They will respond to you via email shortly.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      return;
    }

    if (!formData.deliveryCity.trim()) {
      return;
    }

    if (!formData.deliveryCountry.trim()) {
      return;
    }

    setLoading(true);

    const inquiryData = {
      product: product._id,
      productName: product.name,
      category: product.category?.name || 'General',
      quantity: parseInt(formData.quantity),
      description: formData.description,
      targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : undefined,
      productPrice: product.price || 0, // Store original product price
      deliveryLocation: {
        city: formData.deliveryCity,
        state: formData.deliveryState,
        country: formData.deliveryCountry
      },
      urgency: formData.urgency,
      specifications: formData.specifications
    };

    const result = await createInquiry(inquiryData, token);
    setLoading(false);

    if (result) {
      setSuccess(true);
      setFormData({
        quantity: product?.moq || 1,
        description: '',
        targetPrice: '',
        deliveryCity: '',
        deliveryState: '',
        deliveryCountry: '',
        urgency: 'Medium',
        specifications: ''
      });
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fadeIn">
        {/* Header - Sticky */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Raise Inquiry</h2>
            <p className="text-emerald-100 text-sm">Get a quote for this product</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Product Info - Sticky */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={product?.images?.[0]?.url || 'https://via.placeholder.com/80'}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{product?.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {product?.category?.name || 'Uncategorized'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-emerald-600 font-bold">
                  {formatAmount(product?.price || 0)} / unit
                </span>
                <span className="text-gray-500">
                  MOQ: {product?.moq} pcs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form - Scrollable with hidden scrollbar */}
        <form onSubmit={handleSubmit} className="inquiry-modal-scroll p-6 overflow-y-auto flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.inquiry-modal-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Package className="w-4 h-4 inline mr-1" />
                Quantity Required *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min={product?.moq || 1}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Min: {product?.moq || 1} pcs</p>
            </div>

            {/* Target Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Price (USD)
              </label>
              <input
                type="number"
                name="targetPrice"
                value={formData.targetPrice}
                onChange={handleChange}
                placeholder="Optional"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Delivery City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Delivery City *
              </label>
              <input
                type="text"
                name="deliveryCity"
                value={formData.deliveryCity}
                onChange={handleChange}
                placeholder="e.g., New York"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* Delivery State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                name="deliveryState"
                value={formData.deliveryState}
                onChange={handleChange}
                placeholder="e.g., NY"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Delivery Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                name="deliveryCountry"
                value={formData.deliveryCountry}
                onChange={handleChange}
                placeholder="e.g., United States"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="Low">Low - No rush</option>
                <option value="Medium">Medium - Standard</option>
                <option value="High">High - Need soon</option>
                <option value="Urgent">Urgent - ASAP</option>
              </select>
            </div>

            {/* Requirements Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Requirements Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your requirements, customization needs, or any questions..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Specifications */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Specifications
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                rows={2}
                placeholder="Size, color, material preferences, packaging requirements, etc."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Contact Info Preview */}
          {user && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Your Contact Information:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{user.company}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default InquiryModal;
