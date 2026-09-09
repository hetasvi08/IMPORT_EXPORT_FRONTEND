import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Mail, 
  Truck, 
  ArrowRight,
  Home,
  FileText,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const CheckoutSuccess = ({ order }) => {
  const navigate = useNavigate();

  // Trigger confetti on mount
  useEffect(() => {
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Additional burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Success Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-10 px-6 text-center relative overflow-hidden">
            {/* Animated circles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full"></div>
            </div>
            
            <div className="relative">
              {/* Success Icon */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                <CheckCircle className="w-14 h-14 text-emerald-500" />
              </div>
              
              <h1 className="text-3xl font-black text-white mb-2">Order Confirmed!</h1>
              <p className="text-emerald-100 text-lg">
                Thank you for your purchase
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-8">
            {/* Order Number */}
            <div className="text-center mb-8">
              <p className="text-sm text-slate-500 mb-1">Order Number</p>
              <p className="text-2xl font-mono font-bold text-slate-800 bg-slate-100 inline-block px-6 py-2 rounded-lg">
                {order?.orderId || 'ORD-XXXXX'}
              </p>
            </div>

            {/* Status Steps */}
            <div className="flex justify-between items-center mb-8 px-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-slate-600">Confirmed</span>
              </div>
              <div className="flex-1 h-1 bg-emerald-500 mx-2 rounded"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-slate-600">Email Sent</span>
              </div>
              <div className="flex-1 h-1 bg-slate-200 mx-2 rounded"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-xs text-slate-400">Processing</span>
              </div>
              <div className="flex-1 h-1 bg-slate-200 mx-2 rounded"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-xs text-slate-400">Shipped</span>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-slate-50 rounded-xl p-5 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Payment Status</p>
                  <p className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {order?.paymentStatus || 'Paid'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Payment Method</p>
                  <p className="font-semibold text-slate-700">
                    {order?.paymentMethod || 'Credit Card'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Order Total</p>
                  <p className="font-bold text-lg text-slate-800">
                    ${order?.pricing?.totalPrice?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Estimated Delivery</p>
                  <p className="font-semibold text-slate-700">5-7 business days</p>
                </div>
              </div>
            </div>

            {/* Email Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Check your email</h4>
                  <p className="text-sm text-blue-700">
                    We've sent a confirmation email with your order details and tracking information.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/dashboard/orders')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
              >
                <FileText className="w-5 h-5" />
                View My Orders
              </button>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/')}
                className="text-slate-500 hover:text-emerald-600 text-sm flex items-center gap-1 mx-auto transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Need help? <a href="/contact" className="text-emerald-600 hover:underline">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
