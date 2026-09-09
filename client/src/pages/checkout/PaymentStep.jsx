import { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  Lock, 
  AlertCircle,
  CheckCircle,
  Loader2,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { paymentEndpoints } from '../../services/apis';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = ({
  items,
  shippingAddress,
  billingAddress,
  subtotal,
  taxAmount,
  shippingCost,
  total,
  orderNotes,
  token,
  onOrderComplete,
  paymentMethod,
  setPaymentMethod
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Prepare payload for checkout session
      const payload = {
        items: items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.price,
          price: item.subtotal,
          sku: item.product.sku,
          image: item.product.images?.[0]?.url
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          company: shippingAddress.company,
          phone: shippingAddress.phone,
          email: shippingAddress.email,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        },
        billingAddress: billingAddress.sameAsShipping ? {
          fullName: shippingAddress.fullName,
          company: shippingAddress.company,
          phone: shippingAddress.phone,
          email: shippingAddress.email,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        } : {
          fullName: billingAddress.fullName,
          company: billingAddress.company,
          phone: billingAddress.phone,
          email: billingAddress.email,
          street: billingAddress.street,
          city: billingAddress.city,
          state: billingAddress.state,
          zipCode: billingAddress.zipCode,
          country: billingAddress.country
        },
        pricing: {
          itemsPrice: subtotal,
          taxPrice: taxAmount,
          shippingPrice: shippingCost,
          discount: 0,
          totalPrice: total
        },
        orderNotes: orderNotes
      };

      // Create Stripe Checkout Session
      const response = await axios.post(
        paymentEndpoints.CREATE_STRIPE_CHECKOUT_SESSION_API,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const { url } = response.data;
      window.location.href = url;
    } catch (err) {
setError(err.response?.data?.message || err.message || 'Payment failed');
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    setLoading(true);
    setError(null);

    try {
      // For bank transfer, create order directly
      const orderPayload = {
        items: items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.price,
          price: item.subtotal,
          sku: item.product.sku,
          image: item.product.images?.[0]?.url
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          company: shippingAddress.company,
          phone: shippingAddress.phone,
          email: shippingAddress.email,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        },
        billingAddress: billingAddress.sameAsShipping ? {
          fullName: shippingAddress.fullName,
          company: shippingAddress.company,
          phone: shippingAddress.phone,
          email: shippingAddress.email,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        } : billingAddress,
        pricing: {
          itemsPrice: subtotal,
          taxPrice: taxAmount,
          shippingPrice: shippingCost,
          discount: 0,
          totalPrice: total
        },
        orderNotes: orderNotes,
        orderStatus: 'Awaiting Payment',
        paymentStatus: 'Pending',
        paymentMethod: 'Bank Transfer'
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/orders`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create order');
      }

      onOrderComplete({ ...response.data.data, paymentMethod: 'Bank Transfer' });
    } catch (err) {
setError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      handleStripeCheckout();
    } else if (paymentMethod === 'bank') {
      handleBankTransfer();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Payment Method Selection */}
      <div className="space-y-3 mb-6">
        {/* Credit/Debit Card - Stripe Checkout */}
        <label
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === 'card'
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-5 h-5 text-emerald-500"
          />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Credit / Debit Card</p>
              <p className="text-xs text-slate-500">Secure payment via Stripe</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2 items-center">
            <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/us.svg" alt="Card" className="h-5 w-auto opacity-70" />
            <span className="text-xs text-slate-400">Visa, Mastercard, Amex</span>
          </div>
        </label>

        {/* Bank Transfer */}
        <label
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === 'bank'
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="bank"
            checked={paymentMethod === 'bank'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-5 h-5 text-emerald-500"
          />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Bank Transfer</p>
              <p className="text-xs text-slate-500">Direct bank transfer (manual verification)</p>
            </div>
          </div>
        </label>
      </div>

      {/* Stripe Checkout Info */}
      {paymentMethod === 'card' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Secure Stripe Checkout
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            You will be redirected to Stripe&apos;s secure payment page to complete your payment. 
            This ensures your card details are handled with the highest security standards.
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-blue-600">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> PCI Compliant
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> 256-bit Encryption
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Apple Pay & Google Pay
            </span>
          </div>
        </div>
      )}

      {/* Bank Transfer Info */}
      {paymentMethod === 'bank' && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Bank Transfer Instructions
          </h4>
          <p className="text-sm text-amber-700 mb-3">
            After placing your order, you&apos;ll receive bank details via email. 
            Your order will be processed once payment is verified (1-2 business days).
          </p>
          <div className="text-xs text-amber-600">
            Note: Please include your Order ID in the transfer reference.
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
          loading
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : paymentMethod === 'card' ? (
          <>
            <ExternalLink className="w-5 h-5" />
            Pay ${total.toFixed(2)} with Stripe
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Place Order - ${total.toFixed(2)}
          </>
        )}
      </button>

      {/* Security Info */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          256-bit Encryption
        </div>
        <div className="flex items-center gap-1">
          <Lock className="w-4 h-4 text-emerald-500" />
          PCI Compliant
        </div>
      </div>
    </form>
  );
};

// Main Payment Step Component
const PaymentStep = (props) => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <div className="space-y-6">
      {/* Payment Form Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h3>
          <p className="text-emerald-100 text-sm">Choose your preferred payment method</p>
        </div>

        <div className="p-6">
          <PaymentForm 
            {...props}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
      </div>

      {/* Order Total Reminder */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-400">Total Amount to Pay</p>
            <p className="text-2xl font-black">${props.total.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
