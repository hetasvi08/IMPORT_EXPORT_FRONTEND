import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  MapPin, 
  CreditCard, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
  Lock
} from 'lucide-react';

// Import checkout step components
import ShippingAddressStep from './ShippingAddressStep';
import OrderSummaryStep from './OrderSummaryStep';
import PaymentStep from './PaymentStep';
import CheckoutSuccess from './CheckoutSuccess';

// Import Redux actions
import { clearCartLocal } from '../../store/slices/cartSlice';

const STEPS = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Summary', icon: Package },
  { id: 3, name: 'Payment', icon: CreditCard },
];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  // Checkout state
  const [currentStep, setCurrentStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Form data
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    fullName: '',
    email: '',
    phone: '',
    company: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [orderNotes, setOrderNotes] = useState('');

  // Calculate totals
  const subtotal = totalAmount;
  const taxRate = 0.10; // 10% tax
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal >= 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + taxAmount + shippingCost;

  // Check authentication and cart
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (items.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [isAuthenticated, items, navigate, orderComplete]);



  // Handle step navigation
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate shipping address
      if (!validateShippingAddress()) {
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Validate shipping address
  const validateShippingAddress = () => {
    const required = ['fullName', 'email', 'phone', 'street', 'city', 'country'];
    for (const field of required) {
      if (!shippingAddress[field]?.trim()) {
        return false;
      }
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      return false;
    }
    return true;
  };

  // Handle order completion
  const handleOrderComplete = (orderData) => {
    setCreatedOrder(orderData);
    setOrderComplete(true);
    dispatch(clearCartLocal());
  };

  // Show success page
  if (orderComplete && createdOrder) {
    return <CheckoutSuccess order={createdOrder} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-900 py-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <button 
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Cart</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Secure Checkout</h1>
                <p className="text-slate-400 text-sm">Complete your order in 3 simple steps</p>
              </div>
            </div>
            
            {/* Security Badge */}
            <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-white">256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id 
                        ? 'bg-emerald-500 text-white' 
                        : currentStep === step.id 
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' 
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-sm font-semibold ${
                      currentStep >= step.id ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Step {step.id} of 3
                    </p>
                  </div>
                </div>
                
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ShippingAddressStep
                shippingAddress={shippingAddress}
                setShippingAddress={setShippingAddress}
                billingAddress={billingAddress}
                setBillingAddress={setBillingAddress}
                orderNotes={orderNotes}
                setOrderNotes={setOrderNotes}
              />
            )}
            
            {currentStep === 2 && (
              <OrderSummaryStep
                items={items}
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                subtotal={subtotal}
                taxAmount={taxAmount}
                shippingCost={shippingCost}
                total={total}
                orderNotes={orderNotes}
              />
            )}
            
            {currentStep === 3 && (
              <PaymentStep
                items={items}
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                subtotal={subtotal}
                taxAmount={taxAmount}
                shippingCost={shippingCost}
                total={total}
                orderNotes={orderNotes}
                token={token}
                onOrderComplete={handleOrderComplete}
              />
            )}

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="flex justify-between mt-6">
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                >
                  {currentStep === 2 ? 'Proceed to Payment' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden sticky top-20">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  Order Summary
                </h2>
              </div>
              
              <div className="p-5">
                {/* Items Preview */}
                <div className="max-h-48 overflow-y-auto space-y-3 mb-4">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.product._id} className="flex gap-3">
                      <img
                        src={item.product.images?.[0]?.url || 'https://via.placeholder.com/50'}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Qty: {item.quantity} × ${item.price?.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        ${item.subtotal?.toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-slate-500 text-center">
                      +{items.length - 3} more items
                    </p>
                  )}
                </div>

                <div className="h-px bg-slate-200 my-4"></div>

                {/* Price Breakdown */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal ({totalQuantity} items)</span>
                    <span className="font-semibold text-slate-700">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className={`font-semibold ${shippingCost === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax (10%)</span>
                    <span className="font-semibold text-slate-700">${taxAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="h-px bg-slate-200 my-3"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Total</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Secure Payment
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Truck className="w-4 h-4 text-blue-500" />
                      Fast Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
