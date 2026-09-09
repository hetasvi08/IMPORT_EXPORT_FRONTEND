import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, User, Download, Upload, ShoppingBag, CheckCircle, Globe, Shield, Package, TrendingUp, Users, Truck, Store } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { register, setCredentials } from '../../store/slices/authSlice';
import { auth } from '../../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import nexarionLogo from '../../assets/nexarion_logo.png';
import useSiteStats from '../../hooks/useSiteStats';

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getStatValue } = useSiteStats();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Send to backend
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/google`, {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL
      });

      // Store token and user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update Redux store
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token
      }));
      
      navigate('/');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      return;
    }

    if (!formData.agreeToTerms) {
      return;
    }

    if (formData.password.length < 8) {
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(register(formData)).unwrap();
      
      // Always redirect to verification page
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 p-3 overflow-hidden">
      
      {/* Contained Card */}
      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-cyan-700 to-teal-700 p-6 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200/15 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/15 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-4 animate-[fadeInUp_0.6s_ease-out]">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
              <img src={nexarionLogo} alt="Nexarion" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-black text-xl text-white">Nexarion</h1>
              <p className="text-[10px] text-blue-50 font-medium uppercase tracking-wide">Global Exports</p>
            </div>
          </Link>

          {/* Main Heading */}
          <div className="mb-3 animate-[fadeInUp_0.8s_ease-out]">
            <h1 className="text-3xl font-black text-white mb-2 leading-tight">
              Join Us Today
            </h1>
            <p className="text-sm text-white/90 leading-snug max-w-md">
              Connect with verified suppliers and buyers worldwide. Start trading with confidence today.
            </p>
          </div>

          {/* Image with User Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden mb-3 border border-white/20 shadow-2xl animate-[scaleIn_1s_ease-out]">
            <div className="relative h-24 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=500&h=300&fit=crop&q=80"
                alt="Shipping containers"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-600/60 to-transparent"></div>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-white" size={20} />
                <span className="text-white font-bold text-base">Join {getStatValue('activeUsers') || '450+'} Active Users</span>
              </div>
              <div className="flex gap-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                  <span className="text-white text-xs font-semibold">Verified Suppliers</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                  <span className="text-white text-xs font-semibold">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-2 animate-[fadeInUp_1.2s_ease-out]">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all">
              <Package className="text-white mb-1" size={20} />
              <h3 className="text-white font-bold text-xs mb-0.5">Product Catalog</h3>
              <p className="text-white/80 text-[10px]">Browse {getStatValue('productsListed') || '30+'} products</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all">
              <Truck className="text-white mb-1" size={20} />
              <h3 className="text-white font-bold text-xs mb-0.5">Global Shipping</h3>
              <p className="text-white/80 text-[10px]">Ship to {getStatValue('countries') || '7+'} countries</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all">
              <Shield className="text-white mb-1" size={20} />
              <h3 className="text-white font-bold text-xs mb-0.5">Trade Protection</h3>
              <p className="text-white/80 text-[10px]">Secure transactions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all">
              <TrendingUp className="text-white mb-1" size={20} />
              <h3 className="text-white font-bold text-xs mb-0.5">{getStatValue('yearsExperience') || '3+'} Years</h3>
              <p className="text-white/80 text-[10px]">Industry experience</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-auto flex items-center justify-center gap-3 text-white/90 text-[10px]">
          <div className="flex items-center gap-1">
            <CheckCircle size={12} />
            <span>Secure</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Lock size={12} />
            <span>Encrypted</span>
          </div>
          <span>•</span>
          <span>© 2026 Nexarion</span>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-teal-100/40 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-5 w-24 h-24 bg-blue-100/40 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-5 w-16 h-16 bg-emerald-100/30 rounded-full blur-lg"></div>
        
        <div className="w-full max-w-md relative z-10">

          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md ring-1 ring-teal-100/80 flex items-center justify-center bg-white">
              <img src={nexarionLogo} alt="Nexarion" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-black text-xl text-gray-800">Nexarion</h1>
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Global Exports</p>
            </div>
          </Link>
          
          {/* Header */}
          <div className="mb-2">
            <h2 className="text-xl font-black text-gray-900 mb-1">Create Account</h2>
            <p className="text-gray-600 text-xs">Fill in your details to get started</p>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 font-semibold py-2 px-4 rounded-xl border-2 border-gray-200 hover:border-teal-300 flex items-center justify-center gap-2 mb-2 transition-all shadow-sm hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            
            {/* Account Type */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                I am a <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'importer', iconComponent: Download, label: 'Importer' },
                  { value: 'exporter', iconComponent: Upload, label: 'Exporter' },
                  { value: 'user', iconComponent: ShoppingBag, label: 'User' },
                  { value: 'supplier', iconComponent: Store, label: 'Supplier' }
                ].map(({ value, iconComponent: IconComponent, label }) => (
                  <label key={value} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={formData.role === value}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="bg-white border-2 border-gray-200 peer-checked:border-teal-500 peer-checked:bg-teal-50 rounded-lg p-2 text-center transition-all hover:border-gray-300 hover:shadow-sm">
                      <IconComponent className="text-teal-600 mx-auto mb-0.5" size={16} />
                      <p className="text-[10px] font-bold text-gray-800">{label}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-4 pr-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-4 pr-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full pl-4 pr-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  className="w-full pl-4 pr-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">Minimum 8 characters</p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
              />
              <label className="text-[10px] text-gray-600 leading-snug">
                I agree to the{' '}
                <Link to="/terms" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-xs text-gray-600 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-bold hover:underline">
              Sign In
            </Link>
          </p>

          {/* Terms Footer */}
          <p className="text-center text-[10px] text-gray-500 mt-1.5">
            By signing up you agree to our{' '}
            <Link to="/terms" className="text-teal-600 hover:underline">Terms</Link>
            {' & '}
            <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
          </p>

        </div>
      </div>

      </div>

    </div>
  );
};

export default SignupPage;
