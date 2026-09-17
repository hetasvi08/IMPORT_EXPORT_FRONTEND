import { ArrowLeft, Mail, MapPin, MessageSquare, Minus, Package, Phone, Plus, RotateCcw, Send, ShieldCheck, ShoppingCart, Sparkles, Trash2, Truck, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useCurrency from '../../hooks/useCurrency';
import { clearCart, getCart, raiseCartInquiry, removeFromCart, updateCartItem } from '../../services/operations/cartAPI';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formatAmount } = useCurrency();
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);
  const { items, totalItems, totalQuantity, totalAmount, loading } = useSelector((state) => state.cart);

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user) {
      setInquiryForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(getCart(token));
  }, [dispatch, token, isAuthenticated, navigate]);

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

  // eslint-disable-next-line no-unused-vars
  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleRaiseInquiry = async () => {
    if (items.length === 0) {
      return;
    }

    // Validate required fields
    if (!inquiryForm.name.trim()) {
      return;
    }
    if (!inquiryForm.email.trim()) {
      return;
    }
    if (!inquiryForm.phone.trim()) {
      return;
    }
    if (!inquiryForm.country.trim()) {
      return;
    }

    setSubmittingInquiry(true);
    try {
      const result = await dispatch(raiseCartInquiry(token, inquiryForm));
      if (result.success) {
        setInquiryForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', country: '', message: '' });
        setShowInquiryForm(false);
        // Navigate to quotes page to see the inquiry
        setTimeout(() => {
          navigate('/dashboard/quotes');
        }, 2000);
      }
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-900 pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Shopping Cart</h1>
              <p className="text-slate-400 text-sm">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative">
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Looks like you haven't added any products yet. Start exploring!</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-3 space-y-3 bg-gradient-to-br from-white/90 via-slate-50/80 to-emerald-50/55 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-900/10 p-4 sm:p-5">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-slate-800">Cart Items</h2>
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-600 font-medium text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Cart
                </button>
              </div>

              {items.map((item, index) => (
                <div
                  key={item.product._id}
                  className="bg-gradient-to-r from-white/95 via-slate-50/85 to-emerald-50/70 backdrop-blur-sm rounded-xl shadow-md shadow-slate-900/5 border border-slate-200/90 p-3 flex gap-3 hover:shadow-xl hover:shadow-emerald-100/70 hover:border-emerald-300/80 transition-all group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Product Image */}
                  <div
                    className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-slate-200/50 cursor-pointer"
                    onClick={() => navigate(`/products/${item.product._id}`)}
                  >
                    <img
                      src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100?text=No+Image'}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-slate-800 text-sm mb-0.5 truncate cursor-pointer hover:text-emerald-600 transition-colors"
                      onClick={() => navigate(`/products/${item.product._id}`)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-1.5">
                      {item.product.category?.name || 'Uncategorized'}
                    </p>
                    <p className="text-emerald-600 font-bold text-base">
                      {formatAmount(item.price)}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 bg-white/90 border border-slate-300/70 rounded-lg p-0.5 shadow-sm">
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1, item.product.moq)}
                          className="w-7 h-7 bg-white hover:bg-emerald-50 hover:text-emerald-700 rounded-md flex items-center justify-center transition-colors shadow-sm text-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm text-slate-700">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1, item.product.moq)}
                          className="w-7 h-7 bg-white hover:bg-emerald-50 hover:text-emerald-700 rounded-md flex items-center justify-center transition-colors shadow-sm text-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {item.product.moq > 1 && (
                        <span className="text-[10px] text-slate-400">Min: {item.product.moq}</span>
                      )}
                    </div>

                    <p className="text-slate-800 font-bold text-sm">
                      {formatAmount(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-white/95 via-slate-50/90 to-emerald-50/60 backdrop-blur-md rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-200/90 ring-1 ring-emerald-200/70 overflow-hidden sticky top-20">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Order Summary
                  </h2>
                </div>

                <div className="p-5">
                  {/* Price Breakdown */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal ({totalQuantity} items)</span>
                      <span className="font-semibold text-slate-700">{formatAmount(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Shipping</span>
                      <span className="text-emerald-600 font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tax (10%)</span>
                      <span className="font-semibold text-slate-700">{formatAmount(totalAmount * 0.1)}</span>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-3"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          {formatAmount(totalAmount * 1.1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Form */}
                  {showInquiryForm && (
                    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-3">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-500" />
                        Contact Information
                      </h4>

                      {/* Name */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Full Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={inquiryForm.name}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                            placeholder="Enter your full name"
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            value={inquiryForm.email}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="tel"
                            value={inquiryForm.phone}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                            placeholder="Enter your phone number"
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                          />
                        </div>
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Delivery Country *</label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={inquiryForm.country}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, country: e.target.value })}
                            placeholder="Enter delivery country"
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          <MessageSquare className="w-3 h-3 inline mr-1" />
                          Message (optional)
                        </label>
                        <textarea
                          value={inquiryForm.message}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                          placeholder="Tell us about your requirements, preferred delivery date, or any special requests..."
                          className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}

                  {/* Raise Inquiry Button */}
                  <button
                    onClick={() => {
                      if (showInquiryForm) {
                        handleRaiseInquiry();
                      } else {
                        setShowInquiryForm(true);
                      }
                    }}
                    disabled={submittingInquiry}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 mb-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingInquiry ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : showInquiryForm ? (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Inquiry
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        Raise Inquiry
                      </>
                    )}
                  </button>

                  {/* Checkout Button - Hidden for now */}
                  {/* <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 mb-2 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Proceed to Checkout
                  </button> */}

                  <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    Continue Shopping
                  </button>

                  {/* Info text */}
                  <p className="text-xs text-slate-500 text-center mt-3">
                    Submit an inquiry and our team will contact you with a detailed quote including shipping and payment options.
                  </p>
                </div>

                {/* Trust badges */}
                <div className="bg-gradient-to-r from-slate-50 to-emerald-50/30 px-5 py-4 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-1 border border-emerald-200/80">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Secure Payment</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1 border border-blue-200/80">
                        <Truck className="w-4 h-4 text-blue-700" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Fast Shipping</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-1 border border-amber-200/80">
                        <RotateCcw className="w-4 h-4 text-amber-700" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Easy Returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
