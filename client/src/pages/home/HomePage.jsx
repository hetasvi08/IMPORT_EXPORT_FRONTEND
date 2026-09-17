import { ArrowRight, Box, CheckCircle, FileText, Globe, Handshake, Headphones, Loader2, Lock, Package, Phone, Plus, Rocket, Search, Send, Shield, Star, Truck, UserPlus, X, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import useCurrency from '../../hooks/useCurrency';
import useSiteStats from '../../hooks/useSiteStats';
import { apiconnector } from '../../services/apiconnector';
import { quoteEndpoints } from '../../services/apis';
import { getFeaturedProducts } from '../../services/operations/productAPI';
import { fetchHotCategories } from '../../store/slices/categorySlice';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

// Reusable animated section wrapper
const AnimatedSection = ({ children, variants = fadeInUp, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const canViewSupplierIdentity = user?.role === 'admin' || user?.role === 'supplier';
  const { hotCategories, hotLoading, hotFetched } = useSelector((state) => state.categories);
  const { formatAmount } = useCurrency();
  const { getStatValue, getStatLabel } = useSiteStats();
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const fetchedRef = useRef(false);

  // Fetch hot categories and featured products on mount (with caching to prevent duplicate calls)
  useEffect(() => {
    // Only fetch if not already loaded/loading/attempted
    if (hotCategories.length === 0 && !hotLoading && !hotFetched) {
      dispatch(fetchHotCategories(6));
    }
  }, [dispatch, hotCategories.length, hotLoading, hotFetched]);

  useEffect(() => {
    // Use ref to prevent double fetch in StrictMode
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchFeaturedProductsData();
  }, []);

  const fetchFeaturedProductsData = async () => {
    try {
      const response = await getFeaturedProducts();
      if (response?.success) {
        setFeaturedProducts(response.data || []);
      }
    } catch {
      setFeaturedProducts([]);
    } finally {
      setFeaturedLoading(false);
    }
  };

  // Icon mapping for categories
  const iconMap = {
    'fas fa-laptop': '💻',
    'fas fa-tshirt': '👕',
    'fas fa-couch': '🛋️',
    'fas fa-cog': '⚙️',
    'fas fa-cut': '✂️',
    'fas fa-seedling': '🌱',
    'fas fa-flask': '🧪',
    'fas fa-car': '🚗',
    'fas fa-gem': '💎',
    'fas fa-running': '🏃',
    'fas fa-utensils': '🍽️',
    'fas fa-boxes': '📦',
    'fas fa-building': '🏗️',
    'fas fa-pills': '💊',
    'fas fa-paint-brush': '🎨',
    'fas fa-camera': '📷',
    'fas fa-clock': '⌚',
    'fas fa-mobile-alt': '📱',
    'fas fa-box': '📦',
    'fas fa-home': '🏠',
    'fas fa-heartbeat': '❤️',
    'fas fa-dumbbell': '🏋️',
    'fas fa-gamepad': '🎮',
    'fas fa-music': '🎵',
    'fas fa-tools': '🔧',
    'fas fa-leaf': '🍃',
    'fas fa-baby': '👶',
    'fas fa-book': '📚',
    'fas fa-wine-bottle': '🍷',
  };

  const getIconEmoji = (iconClass) => iconMap[iconClass] || '📦';

  const handleRequestQuote = () => {
    if (isAuthenticated) {
      setShowQuoteModal(true);
    } else {
      navigate('/login', { state: { from: '/dashboard/quotes' } });
    }
  };

  const handleStartJourney = () => {
    if (isAuthenticated) {
      navigate('/products');
    } else {
      navigate('/signup');
    }
  };

  const getDisplayStatLabel = (key, fallback) => {
    const label = getStatLabel(key) || fallback;
    if (key === 'verifiedSuppliers' && /supplier/i.test(label)) {
      return 'Verified Trade Partners';
    }
    return label;
  };

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 pt-20 sm:pt-24 lg:pt-16 py-10 sm:py-12 lg:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_20%_30%,rgba(52,211,153,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.08)_0%,transparent_50%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">

            {/* Left Content */}
            <AnimatedSection variants={slideInLeft} className="text-white lg:w-1/2">
              {/* Trust Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white"></div>
                </div>
                <p className="text-xs font-semibold">Trusted by Growing Businesses Worldwide</p>
                <CheckCircle size={14} className="text-emerald-400" />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black mb-6 leading-tight">
                Connect Global
                <span className="block bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                  Trade Partners
                </span>
                Instantly
              </h1>

              {/* Feature Badges */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-10">
                {[
                  { icon: Box, label: 'Safe Trading', sublabel: 'Secure Platform', iconColor: 'text-amber-400', bgColor: 'bg-amber-500/20' },
                  { icon: Shield, label: 'Verified Partners', sublabel: 'Trusted Network', iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
                  { icon: Truck, label: 'Global Reach', sublabel: 'Fast Delivery', iconColor: 'text-cyan-400', bgColor: 'bg-cyan-500/20' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/15 transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                      <item.icon className={item.iconColor} size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-xs">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.sublabel}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row flex-wrap gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link
                  to="/products"
                  className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all shadow-xl transform hover:scale-105 flex items-center gap-2 justify-center w-full sm:w-auto"
                >
                  <Search size={18} />
                  Explore Products
                </Link>
                <button
                  onClick={handleRequestQuote}
                  className="bg-white/10 backdrop-blur-md border-2 border-white/30 px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all flex items-center gap-2 justify-center w-full sm:w-auto"
                >
                  <FileText size={18} />
                  Request Quote
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 max-w-sm sm:max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <motion.div
                  className="relative group bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border-2 border-amber-400/30 rounded-2xl p-4 text-center shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:border-amber-400/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <p className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent mb-1 drop-shadow-lg">{getStatValue('activeUsers') || '450+'}</p>
                    <p className="text-[10px] text-amber-100 font-bold uppercase tracking-wider leading-tight">Active Users</p>
                  </div>
                </motion.div>
                <motion.div
                  className="relative group bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border-2 border-emerald-400/30 rounded-2xl p-4 text-center shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <p className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent mb-1 drop-shadow-lg">{getStatValue('countries') || '7+'}</p>
                    <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider leading-tight">Countries</p>
                  </div>
                </motion.div>
                <motion.div
                  className="relative group bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border-2 border-cyan-400/30 rounded-2xl p-4 text-center shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <p className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-1 drop-shadow-lg">{getStatValue('satisfactionRate') || '98%'}</p>
                    <p className="text-[10px] text-cyan-100 font-bold uppercase tracking-wider leading-tight">Satisfaction</p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatedSection>

            {/* Right Image */}
            <AnimatedSection variants={slideInRight} className="relative lg:w-1/2">
              <div className="relative">
                {/* Main Image */}
                <div className="relative h-[320px] sm:h-[380px] lg:h-[450px] rounded-[35px] overflow-hidden shadow-2xl border-4 border-white/15">
                  <img
                    src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop&q=80"
                    alt="Global Trade"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                  {/* Floating Stats Card */}
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border-2 border-white/30 rounded-[25px] p-4 sm:p-5 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                      <motion.div
                        className="relative group"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100"></div>
                        <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-xl p-2 sm:p-3 group-hover:border-amber-400/60 transition-all h-full flex flex-col items-center justify-center">
                          <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">{getStatValue('productsListed') || '30+'}</p>
                          <p className="text-[9px] sm:text-[10px] text-white font-semibold leading-tight">{getDisplayStatLabel('productsListed', 'Active Products')}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        className="relative group"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100"></div>
                        <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30 rounded-xl p-2 sm:p-3 group-hover:border-emerald-400/60 transition-all h-full flex flex-col items-center justify-center">
                          <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">{getStatValue('verifiedSuppliers') || '45+'}</p>
                          <p className="text-[9px] sm:text-[10px] text-white font-semibold leading-tight">{getDisplayStatLabel('verifiedSuppliers', 'Verified Trade Partners')}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        className="relative group"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100"></div>
                        <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-2 sm:p-3 group-hover:border-cyan-400/60 transition-all h-full flex flex-col items-center justify-center">
                          <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">24/7</p>
                          <p className="text-[9px] sm:text-[10px] text-white font-semibold leading-tight">Support</p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Small Feature Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  {[
                    { icon: CheckCircle, title: 'High Quality Products', subtitle: 'Carefully Checked', gradient: 'from-amber-400 to-amber-600' },
                    { icon: Lock, title: 'Secure Payments', subtitle: '100% Protected', gradient: 'from-emerald-400 to-emerald-600' },
                    { icon: Zap, title: 'Faster Delivery', subtitle: 'Express Shipping', gradient: 'from-cyan-400 to-blue-600' },
                    { icon: Headphones, title: '24/7 Support', subtitle: 'Always Available', gradient: 'from-purple-400 to-pink-600' }
                  ].map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md border-2 border-white/15 p-3 sm:p-4 rounded-2xl hover:transform hover:-translate-y-1 transition-all group"
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <card.icon className="text-white" size={20} />
                      </div>
                      <p className="font-bold text-white text-[10px] sm:text-[11px] mb-0.5 leading-tight">{card.title}</p>
                      <p className="text-[9px] text-white/70 leading-tight">{card.subtitle}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-10 lg:py-14 bg-gradient-to-br from-slate-50 via-teal-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Why Choose Us</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Everything You Need for <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Global Trade</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make international trading simple, secure, and successful
            </p>
          </AnimatedSection>

          {/* Features Grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">

            {[
              { gradient: 'from-emerald-500 to-teal-600', icon: Globe, title: 'Global Trade Network', desc: 'Connect with trusted importers, exporters, and distribution partners across multiple countries.', link: '/services', delay: 0.1 },
              { gradient: 'from-amber-500 to-orange-600', icon: Shield, title: 'Verified Trade Partners', desc: 'Our business network is validated for reliability and consistent product quality.', link: '/services', delay: 0.15 },
              { gradient: 'from-cyan-500 to-blue-600', icon: Lock, title: 'Secure Trading', desc: 'Protected transactions with escrow and buyer protection guarantee.', link: '/services', delay: 0.2 },
              { gradient: 'from-purple-500 to-indigo-600', icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock customer support to assist with your inquiries.', link: '/contact', delay: 0.25 },
              { gradient: 'from-rose-500 to-pink-600', icon: Truck, title: 'Fast Shipping', desc: 'Reliable global logistics with express delivery options available.', link: '/services', delay: 0.3 },
              { gradient: 'from-indigo-500 to-violet-600', icon: CheckCircle, title: 'High Quality Products', desc: 'High quality products with strict quality checks for every order.', link: '/services', delay: 0.35 }
            ].map((feature, index) => (
              <AnimatedSection key={index} variants={scaleIn} delay={feature.delay}>
                <div className={`bg-gradient-to-br ${feature.gradient} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden h-full`}>
                  <div className="relative z-10">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon className="text-white" size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1.5">{feature.title}</h3>
                    <p className="text-white/90 leading-relaxed mb-3 text-sm">{feature.desc}</p>
                    <Link to={feature.link} className="flex items-center gap-2 text-white text-sm font-semibold hover:gap-3 transition-all">
                      <span>Learn More</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}

          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="py-14 sm:py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection className="text-center mb-12">
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full px-6 py-2.5 mb-6 shadow-xl shadow-amber-500/25"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Star className="w-5 h-5 fill-current" />
                <p className="font-bold text-sm uppercase tracking-widest">Featured Products</p>
                <Star className="w-5 h-5 fill-current" />
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                Handpicked <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">Premium</span> Products
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover top-rated featured products curated by our import-export team
              </p>
            </AnimatedSection>

            {/* Featured Products Grid */}
            {featuredLoading ? (
              <div className="flex items-center justify-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-amber-500" />
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group"
                  >
                    <Link to={`/products/${product._id}`} className="block">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                        {/* Product Image */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                          <img
                            src={product.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Featured Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </span>
                          </div>
                          {/* MOQ Badge */}
                          <div className="absolute top-3 right-3">
                            <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-lg">
                              MOQ: {product.moq || 1}
                            </span>
                          </div>
                          {/* Quick View Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                              View Details
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          {/* Category */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                              {product.category?.name || 'General'}
                            </span>
                            {product.rating > 0 && (
                              <span className="flex items-center gap-1 text-xs text-amber-600">
                                <Star className="w-3 h-3 fill-current" />
                                {product.rating?.toFixed(1)}
                              </span>
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                            {product.name}
                          </h3>

                          {/* Description */}
                          <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                            {product.shortDescription || product.description || 'Quality export-ready product from our verified catalog'}
                          </p>

                          {/* Price & Source */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-black text-emerald-600">{formatAmount(product.price)}</span>
                              <span className="text-slate-400 text-sm">/unit</span>
                            </div>
                            {canViewSupplierIdentity && product.supplier?.companyName && (
                              <div className="text-right">
                                <p className="text-xs text-slate-400">by</p>
                                <p className="text-xs font-medium text-slate-600 truncate max-w-[100px]">
                                  {product.supplier.companyName}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* View All Button */}
            <AnimatedSection delay={0.4} className="text-center mt-10">
              <Link
                to="/products?featured=true"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
              >
                <span>View All Featured Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      )}

      {/* Featured Categories Section - Premium */}
      <div className="py-14 sm:py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 relative overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-6 py-2.5 mb-6 shadow-xl shadow-emerald-500/25"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Star className="w-5 h-5" />
              <p className="font-bold text-sm uppercase tracking-widest">Top Selling Categories</p>
              <Star className="w-5 h-5" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Explore <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Premium</span> Categories
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Discover our best-selling product categories with exclusive deals and trusted sourcing
            </p>
          </AnimatedSection>

          {/* Hot Categories Grid - Large Premium Cards */}
          {hotLoading ? (
            <div className="flex items-center justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-emerald-500" />
              </motion.div>
            </div>
          ) : hotCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotCategories.slice(0, 6).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{
                    y: -12,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <Link
                    to={`/products?category=${category._id}`}
                    className="block bg-white rounded-3xl border-2 border-slate-200/80 hover:border-emerald-400 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 overflow-hidden"
                  >
                    {/* Card Header with Image */}
                    <div className="h-44 sm:h-56 relative overflow-hidden">
                      {category.image?.url ? (
                        <motion.img
                          src={category.image.url}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.7 }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent)]"></div>
                        </div>
                      )}

                      {/* Light Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"></div>

                      {/* Animated Decorative Elements */}
                      <motion.div
                        className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -mr-20 -mt-20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                      ></motion.div>
                      <motion.div
                        className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/30 rounded-full -ml-16 -mb-16"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                      ></motion.div>

                      {/* Premium Badge */}
                      <div className="absolute top-4 left-4">
                        <motion.div
                          className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Star size={12} className="fill-current" />
                          Featured
                        </motion.div>
                      </div>

                      {/* Category Tags - Right Top Corner */}
                      <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                        {category.isHot && (
                          <motion.span
                            className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            🔥 Hot
                          </motion.span>
                        )}
                        {category.isTrending && (
                          <motion.span
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1"
                            animate={{ y: [0, -2, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            📈 Trending
                          </motion.span>
                        )}
                        {category.isNew && (
                          <motion.span
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg"
                            animate={{ rotate: [-2, 2, -2] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                          >
                            ✨ New
                          </motion.span>
                        )}
                      </div>

                      {/* Icon with Glow */}
                      <motion.div
                        className="absolute bottom-4 left-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border-2 border-white"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="text-3xl">{getIconEmoji(category.icon)}</span>
                      </motion.div>

                      {/* Product Count Badge */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm text-slate-800 text-sm px-4 py-2 rounded-full font-bold shadow-lg border border-white">
                          {(category.productCount || 0).toLocaleString()} Products
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 bg-gradient-to-br from-white to-slate-50 flex flex-col min-h-[160px] sm:min-h-[180px]">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-2 flex-grow">
                        {category.description || 'Explore our premium collection of quality products'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white shadow-sm"></div>
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white shadow-sm"></div>
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white shadow-sm"></div>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">Trusted Network</span>
                        </div>
                        <motion.div
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all"
                          whileHover={{ scale: 1.1, x: 5 }}
                        >
                          <ArrowRight className="text-white" size={20} />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : null}

          {/* View All Link */}
          <AnimatedSection className="text-center mt-12 sm:mt-14" delay={0.5}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/categories"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50"
              >
                <Package size={24} />
                View All Categories
                <ArrowRight size={24} />
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-14 sm:py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Process</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              How It <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">Start your global trading journey in 4 simple steps</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              { num: 1, icon: UserPlus, title: 'Sign Up Free', desc: 'Create your account in minutes. No credit card required to get started.', color: 'emerald', borderColor: 'border-emerald-500/30 hover:border-emerald-500', bgGradient: 'from-emerald-400 to-emerald-600', iconGradient: 'from-emerald-500 to-emerald-600', delay: 0.1 },
              { num: 2, icon: Search, title: 'Browse Products', desc: 'Explore active listings across our curated import-export categories.', color: 'amber', borderColor: 'border-amber-500/30 hover:border-amber-500', bgGradient: 'from-amber-400 to-amber-600', iconGradient: 'from-amber-500 to-amber-600', delay: 0.2 },
              { num: 3, icon: Handshake, title: 'Connect & Negotiate', desc: 'Request quotes and coordinate directly with our trade operations team.', color: 'cyan', borderColor: 'border-cyan-500/30 hover:border-cyan-500', bgGradient: 'from-cyan-400 to-cyan-600', iconGradient: 'from-cyan-500 to-cyan-600', delay: 0.3 },
              { num: 4, icon: Truck, title: 'Ship Globally', desc: 'Secure payment and worldwide shipping arranged for you.', color: 'purple', borderColor: 'border-purple-500/30 hover:border-purple-500', bgGradient: 'from-purple-400 to-purple-600', iconGradient: 'from-purple-500 to-purple-600', delay: 0.4 }
            ].map((step, index) => (
              <AnimatedSection key={index} variants={fadeInUp} delay={step.delay}>
                <div className="relative h-full">
                  <div className={`bg-white/10 backdrop-blur-md border-2 ${step.borderColor} p-6 sm:p-8 rounded-[30px] transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group flex flex-col h-full min-h-[240px] sm:min-h-[280px]`}>
                    {/* Step Number */}
                    <div className={`absolute -top-5 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${step.bgGradient} rounded-full flex items-center justify-center shadow-xl`}>
                      <span className="text-xl sm:text-2xl font-black text-white">{step.num}</span>
                    </div>

                    <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${step.iconGradient} rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <step.icon className="text-white" size={28} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed flex-grow">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}

          </div>

          {/* CTA Button */}
          <AnimatedSection className="text-center mt-12" delay={0.5}>
            <button
              onClick={handleStartJourney}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-xl font-bold text-base hover:from-emerald-600 hover:to-teal-700 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Rocket size={20} />
              Start Your Journey Today
            </button>
          </AnimatedSection>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-14 sm:py-20 bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Growing <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Trade Community</span>
            </h2>
            <p className="text-base text-gray-600">Live platform statistics - Updated January 2026</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: getStatValue('activeUsers') || '450+', label: getDisplayStatLabel('activeUsers', 'Active Users'), gradient: 'from-emerald-500 to-emerald-700', bg: 'from-emerald-50 via-white to-emerald-50', delay: 0.1 },
              { value: getStatValue('productsListed') || '30+', label: getDisplayStatLabel('productsListed', 'Active Products'), gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 via-white to-orange-50', delay: 0.2 },
              { value: getStatValue('countries') || '7+', label: getDisplayStatLabel('countries', 'Countries'), gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 via-white to-blue-50', delay: 0.3 },
              { value: getStatValue('verifiedSuppliers') || '45+', label: getDisplayStatLabel('verifiedSuppliers', 'Verified Trade Partners'), gradient: 'from-purple-500 to-indigo-600', bg: 'from-purple-50 via-white to-indigo-50', delay: 0.4 }
            ].map((stat, index) => (
              <AnimatedSection key={index} variants={scaleIn} delay={stat.delay}>
                <div className={`group text-center bg-gradient-to-br ${stat.bg} p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}>
                  <div className="relative">
                    <div className={`text-4xl sm:text-5xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}>{stat.value}</div>
                    <p className="text-gray-600 font-semibold text-sm transition-colors">{stat.label}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-14 sm:py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Expand Your <span className="text-amber-300">Global Trade?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our growing community of importers and exporters. Start connecting with verified partners today.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-8">
              <Link
                to="/signup"
                className="bg-white text-slate-900 px-10 py-4 rounded-xl font-black text-base hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-amber-400/50 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Rocket size={20} />
                Get Started
              </Link>
              <Link
                to="/contact"
                className="bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-amber-400 text-white px-10 py-4 rounded-xl font-bold text-base hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl inline-flex items-center gap-2 transform hover:scale-105 w-full sm:w-auto justify-center"
              >
                <Phone size={20} />
                Contact Sales
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <p className="mt-6 text-sm font-semibold flex flex-wrap justify-center gap-4">
              {[
                { text: 'No credit card required', color: 'emerald' },
                { text: 'Free forever plan', color: 'cyan' },
                { text: 'Start instantly', color: 'amber' }
              ].map((badge, index) => (
                <span key={index} className={`flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 sm:px-5 py-2.5 rounded-full border-2 border-${badge.color}-400 shadow-lg shadow-${badge.color}-500/30 hover:shadow-${badge.color}-500/50 transition-all duration-300 transform hover:scale-105`}>
                  <span className={`text-${badge.color}-500 text-base font-bold animate-pulse`}>✓</span>
                  <span className="text-slate-900 font-semibold text-xs sm:text-sm">{badge.text}</span>
                </span>
              ))}
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <QuoteRequestModal
          onClose={() => setShowQuoteModal(false)}
          onSuccess={() => {
            setShowQuoteModal(false);
            navigate('/dashboard/quotes');
          }}
          token={token}
        />
      )}

    </div>
  );
};

// Quote Request Modal Component
const QuoteRequestModal = ({ onClose, onSuccess, token }) => {
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState('catalog'); // 'catalog' or 'custom'
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '',
    unit: 'pieces',
    description: '',
    specifications: '',
    targetPrice: '',
    urgency: 'Medium',
    expectedDeliveryDate: '',
    deliveryCity: '',
    deliveryCountry: ''
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await apiconnector(
          'GET',
          '/api/products?limit=200&isApproved=approved',
          null,
          token ? { Authorization: `Bearer ${token}` } : null
        );
        if (response.data.success) {
          const productsData = response.data.data || response.data.products || [];
          const approvedProducts = productsData.filter(p => p.isApproved === 'approved');
          setProducts(approvedProducts);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProductDropdown && !event.target.closest('.product-dropdown-container')) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProductDropdown]);

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    if (!productSearch.trim()) return true;
    const searchLower = productSearch.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower) ||
      product.category?.name?.toLowerCase().includes(searchLower) ||
      (typeof product.category === 'string' && product.category.toLowerCase().includes(searchLower)) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  });

  // Handle product selection from dropdown
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    let categoryName = '';
    if (product.category) {
      if (typeof product.category === 'object' && product.category.name) {
        categoryName = product.category.name;
      } else if (typeof product.category === 'string' && product.category.length !== 24) {
        categoryName = product.category;
      }
    }
    setFormData(prev => ({
      ...prev,
      productName: product.name || '',
      category: categoryName || 'General',
      targetPrice: product.price || '',
      description: product.description || prev.description,
      specifications: Array.isArray(product.specifications)
        ? product.specifications.map(s => typeof s === 'object' ? `${s.key}: ${s.value}` : s).join('\n')
        : prev.specifications
    }));
    setShowProductDropdown(false);
    setProductSearch('');
  };

  // Clear selected product
  const clearSelectedProduct = () => {
    setSelectedProduct(null);
    setFormData(prev => ({
      ...prev,
      productName: '',
      category: '',
      targetPrice: '',
      description: '',
      specifications: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate based on product type
      if (productType === 'catalog' && !selectedProduct) {
        setLoading(false);
        return;
      }

      // Client-side validation
      if (!formData.productName?.trim()) {
        setLoading(false);
        return;
      }
      if (!formData.category?.trim()) {
        setLoading(false);
        return;
      }
      if (!formData.quantity || parseInt(formData.quantity) < 1) {
        setLoading(false);
        return;
      }
      if (!formData.description?.trim()) {
        setLoading(false);
        return;
      }
      if (!formData.deliveryCountry?.trim()) {
        setLoading(false);
        return;
      }

      const quoteData = {
        productName: formData.productName.trim(),
        category: formData.category.trim(),
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        description: formData.description.trim(),
        specifications: formData.specifications?.trim() || '',
        targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : undefined,
        urgency: formData.urgency,
        expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
        deliveryLocation: {
          city: formData.deliveryCity?.trim() || '',
          country: formData.deliveryCountry.trim()
        },
        isCustomProduct: productType === 'custom',
        ...(productType === 'catalog' && selectedProduct && {
          product: selectedProduct._id,
          selectedProduct: {
            productId: selectedProduct._id,
            name: selectedProduct.name,
            sku: selectedProduct.sku || '',
            image: selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || selectedProduct.image || '',
            price: selectedProduct.price,
            category: selectedProduct.category?.name || selectedProduct.category || ''
          }
        })
      };
const response = await apiconnector(
        'POST',
        quoteEndpoints.CREATE_QUOTE_API,
        quoteData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (response.data.success) {
        onSuccess();
      } else {
        // Handle validation errors
        if (response.data.errors && response.data.errors.length > 0) {
        } else {
        }
      }
    } catch (error) {
const errorMessage = error.response?.data?.errors?.[0]?.message ||
                          error.response?.data?.message ||
                          'Failed to create quote request';
    } finally {
      setLoading(false);
    }
  };

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full h-auto max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] overflow-hidden animate-scaleIn transform transition-all duration-300 flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 sm:p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plus className="w-8 h-8" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black">Request a Quote</h2>
                <p className="text-teal-100 text-sm leading-snug">Fill in the details to request a quote</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-hide">
          <div className="space-y-4">

            {/* Product Type Toggle */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-3 sm:p-4 rounded-xl border border-slate-200">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Product Selection *
              </label>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProductType('catalog');
                    clearSelectedProduct();
                  }}
                  className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                    productType === 'catalog'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-[1.02]'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Select from </span>Catalog
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProductType('custom');
                    setSelectedProduct(null);
                    setFormData(prev => ({
                      ...prev,
                      productName: '',
                      category: '',
                      targetPrice: '',
                      description: '',
                      specifications: ''
                    }));
                  }}
                  className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                    productType === 'custom'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg scale-[1.02]'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-violet-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Custom<span className="hidden sm:inline"> Product</span>
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">
                {productType === 'catalog'
                  ? '📦 Select an existing product from our catalog'
                  : '✏️ Describe your custom product requirements'}
              </p>
            </div>

            {/* Product Selection Dropdown (for catalog) */}
            {productType === 'catalog' && (
              <div className="relative product-dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product *
                </label>

                {/* Selected Product Display */}
                {selectedProduct ? (
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      {(selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || selectedProduct.image) ? (
                        <img
                          src={selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                          <Package className="w-6 h-6 text-teal-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{selectedProduct.name}</p>
                      <p className="text-sm text-gray-500">{selectedProduct.category?.name || selectedProduct.category}</p>
                      {selectedProduct.price && (
                        <p className="text-sm font-semibold text-teal-600">${selectedProduct.price.toFixed(2)}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={clearSelectedProduct}
                      className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Dropdown Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setShowProductDropdown(!showProductDropdown)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white text-left flex items-center justify-between hover:border-teal-300"
                    >
                      <span className="text-gray-500 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {loadingProducts ? 'Loading products...' : `Choose from ${products.length} products`}
                      </span>
                      <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${showProductDropdown ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {showProductDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                        {/* Search Input Inside Dropdown */}
                        <div className="p-3 border-b border-gray-100 bg-gray-50 sticky top-0">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              placeholder="Search by name, SKU, category..."
                              autoFocus
                            />
                            {productSearch && (
                              <button
                                type="button"
                                onClick={() => setProductSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
                              >
                                <X className="w-3 h-3 text-gray-400" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {productSearch ? `${filteredProducts.length} results` : `${products.length} products available`}
                          </p>
                        </div>

                        {/* Products List */}
                        <div className="max-h-64 overflow-y-auto">
                          {loadingProducts ? (
                            <div className="p-6 text-center text-gray-500">
                              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-teal-500" />
                              <p>Loading products...</p>
                            </div>
                          ) : filteredProducts.length > 0 ? (
                            filteredProducts.slice(0, 20).map((product) => (
                              <button
                                key={product._id}
                                type="button"
                                onClick={() => handleProductSelect(product)}
                                className="w-full p-3 flex items-center gap-3 hover:bg-teal-50 transition-colors border-b border-gray-50 last:border-b-0"
                              >
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  {(product.images?.[0]?.url || product.images?.[0] || product.image) ? (
                                    <img
                                      src={product.images?.[0]?.url || product.images?.[0] || product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                      <Package className="w-5 h-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {product.category?.name || product.category || 'General'}
                                    {product.sku && ` • SKU: ${product.sku}`}
                                  </p>
                                </div>
                                {product.price ? (
                                  <span className="text-sm font-bold text-teal-600">${product.price.toFixed(2)}</span>
                                ) : (
                                  <span className="text-xs text-gray-400">Request Quote</span>
                                )}
                              </button>
                            ))
                          ) : products.length > 0 && productSearch ? (
                            <div className="p-6 text-center text-gray-500">
                              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm font-medium">No products match "{productSearch}"</p>
                              <button
                                type="button"
                                onClick={() => setProductSearch('')}
                                className="mt-3 px-4 py-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium border border-teal-200 rounded-lg hover:bg-teal-50"
                              >
                                Clear Search
                              </button>
                            </div>
                          ) : (
                            <div className="p-6 text-center text-gray-500">
                              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm font-medium">No products available</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setProductType('custom');
                                  setShowProductDropdown(false);
                                }}
                                className="mt-3 px-4 py-2 text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 font-medium rounded-lg transition-colors"
                              >
                                Switch to Custom Product →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Custom Product Fields (shown when custom type or catalog with product selected) */}
            {(productType === 'custom' || selectedProduct) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  disabled={productType === 'catalog' && selectedProduct}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 hover:border-teal-400 ${
                    productType === 'catalog' && selectedProduct ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={productType === 'catalog' && selectedProduct}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    productType === 'catalog' && selectedProduct ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="e.g., Electronics"
                />
              </div>
            </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="tons">Tons</option>
                  <option value="liters">Liters</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Describe your requirements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>
              <textarea
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                rows="2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Technical specifications, standards, etc."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Your budget"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency *
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.deliveryCountry}
                  onChange={(e) => setFormData({ ...formData, deliveryCountry: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., USA"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="border-t border-gray-200 p-4 sm:p-6 flex gap-3 shrink-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-medium text-sm sm:text-base transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Quote Request
              </>
            )}
          </button>
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HomePage;
