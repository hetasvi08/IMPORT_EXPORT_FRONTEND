import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Loader2, 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  MessageSquare,
  User,
  Mail,
  Phone,
  Globe,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

import { getCart, updateCartItem, removeFromCart, clearCart, raiseCartInquiry } from '../../services/operations/cartAPI';
import useCurrency from '../../hooks/useCurrency';

const DashboardCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { items, totalItems, totalQuantity, totalAmount, loading } = useSelector((state) => state.cart);
  const { formatAmount } = useCurrency();

  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Auto-fill form with user data
  useEffect(() => {
    if (user) {
      setInquiryForm(prev => ({
        ...prev,
        name: user.name || user.firstName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      dispatch(getCart(token));
    }
  }, [dispatch, token]);

  const handleUpdateQuantity = (productId, currentQuantity, change, moq = 1) => {
    const newQuantity = currentQuantity + change;
    const minQuantity = moq || 1;
    
    if (newQuantity < minQuantity) {
      // If trying to go below MOQ, remove item
      handleRemoveItem(productId);
      return;
    }
    dispatch(updateCartItem(productId, newQuantity, token));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId, token));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart(token));
    }
  };

  // Keep checkout logic for future use when Stripe is verified
  // const handleCheckout = () => {
  //   if (items.length === 0) {
  //     toast.error('Your cart is empty');
  //     return;
  //   }
  //   navigate('/checkout');
  // };

  const handleInquiryChange = (e) => {
    setInquiryForm({ ...inquiryForm, [e.target.name]: e.target.value });
  };

  const handleRaiseInquiry = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      return;
    }
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone || !inquiryForm.country) {
      return;
    }
    setSubmittingInquiry(true);
    try {
      const result = await dispatch(raiseCartInquiry(token, inquiryForm));
      if (result?.success) {
        setInquiryForm({ name: '', email: '', phone: '', country: '', message: '' });
      }
    } catch (error) {} finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2 sm:gap-3">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            Shopping Cart
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-600 font-semibold text-sm flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Package className="w-14 h-14 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">Add some products to get started</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg text-sm sm:text-base"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => (
              <div 
                key={item.product._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 flex gap-3 sm:gap-4 hover:shadow-md transition-all"
              >
                {/* Product Image */}
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/products/${item.product._id}`)}
                >
                  <img
                    src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100?text=No+Image'}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-bold text-gray-900 mb-1 truncate cursor-pointer hover:text-teal-600 text-sm sm:text-base"
                    onClick={() => navigate(`/products/${item.product._id}`)}
                  >
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {item.product.category?.name || 'Uncategorized'}
                  </p>
                  <p className="text-teal-600 font-bold text-base sm:text-lg">
                    {formatAmount(item.price)} <span className="text-xs text-gray-400 font-normal">per unit</span>
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="text-red-400 hover:text-red-500 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1, item.product.moq)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1, item.product.moq)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {item.product.moq > 1 && (
                      <span className="text-xs text-gray-400">Min: {item.product.moq}</span>
                    )}
                  </div>

                  <p className="text-gray-900 font-bold text-sm sm:text-base">
                    {formatAmount(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-semibold">{formatAmount(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">{formatAmount(totalAmount * 0.1)}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-teal-600">{formatAmount(totalAmount * 1.1)}</span>
                </div>
              </div>

              {/* Contact Information Form */}
              <form onSubmit={handleRaiseInquiry} className="space-y-3">
                <div className="border border-orange-200 rounded-xl p-3 sm:p-4 bg-orange-50/50">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={inquiryForm.name}
                          onChange={handleInquiryChange}
                          placeholder="Your full name"
                          className="w-full pl-9 pr-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={inquiryForm.email}
                          onChange={handleInquiryChange}
                          placeholder="your@email.com"
                          className="w-full pl-9 pr-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={inquiryForm.phone}
                          onChange={handleInquiryChange}
                          placeholder="Enter your phone number"
                          className="w-full pl-9 pr-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Delivery Country *</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="country"
                          required
                          value={inquiryForm.country}
                          onChange={handleInquiryChange}
                          placeholder="Enter delivery country"
                          className="w-full pl-9 pr-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Message (optional)
                      </label>
                      <textarea
                        name="message"
                        rows={3}
                        value={inquiryForm.message}
                        onChange={handleInquiryChange}
                        placeholder="Tell us about your requirements, preferred delivery date, or any special requests..."
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm resize-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingInquiry || items.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 disabled:from-orange-300 disabled:to-amber-300 disabled:cursor-not-allowed transition-all shadow-lg mb-2 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {submittingInquiry ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      Raise Inquiry
                    </>
                  )}
                </button>
              </form>
              
              <button
                onClick={() => navigate('/products')}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all mt-2"
              >
                Continue Shopping
              </button>

              <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
                Submit an inquiry and our team will contact you with a detailed quote including shipping and payment options.
              </p>

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-5 h-5 text-teal-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-5 h-5 text-teal-500" />
                    <span>Fast Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-5 h-5 text-teal-500" />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCart;
