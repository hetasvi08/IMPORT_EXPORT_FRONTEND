import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ArrowRight, TrendingUp, Star, Zap, Package, Sparkles, Loader2 } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { 
  fetchCategories, 
  fetchFeaturedCategories,
  fetchCategoryStats 
} from '../../store/slices/categorySlice';

// Default icon mapping for categories without images
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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

const dummyCategories = [
  {
    _id: 'd1',
    name: 'Electronics',
    description: 'Latest gadgets and electronic devices.',
    icon: 'fas fa-laptop',
    productCount: 1500,
    isFeatured: true,
    isHot: true,
    gradient: { from: 'blue-500', to: 'indigo-600' }
  },
  {
    _id: 'd2',
    name: 'Fashion',
    description: 'Trendy clothing and accessories.',
    icon: 'fas fa-tshirt',
    productCount: 3200,
    isTrending: true,
    gradient: { from: 'pink-500', to: 'rose-500' }
  },
  {
    _id: 'd3',
    name: 'Home & Garden',
    description: 'Furniture, decor, and gardening tools.',
    icon: 'fas fa-couch',
    productCount: 850,
    isNew: true,
    gradient: { from: 'emerald-500', to: 'teal-600' }
  },
  {
    _id: 'd4',
    name: 'Sports & Outdoors',
    description: 'Gear and equipment for active lifestyles.',
    icon: 'fas fa-running',
    productCount: 1200,
    gradient: { from: 'orange-500', to: 'amber-500' }
  },
  {
    _id: 'd5',
    name: 'Beauty & Health',
    description: 'Skincare, cosmetics, and wellness products.',
    icon: 'fas fa-heartbeat',
    productCount: 2100,
    isFeatured: true,
    gradient: { from: 'purple-500', to: 'fuchsia-600' }
  },
  {
    _id: 'd6',
    name: 'Automotive',
    description: 'Car parts, accessories, and tools.',
    icon: 'fas fa-car',
    productCount: 600,
    gradient: { from: 'slate-500', to: 'slate-700' }
  }
];

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, featuredCategories, loading } = useSelector(state => state.categories);
  
  const displayCategories = categories.length > 0 ? categories : dummyCategories;
  const displayFeatured = featuredCategories.length > 0 ? featuredCategories : dummyCategories.filter(c => c.isFeatured);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchFeaturedCategories(6));
    dispatch(fetchCategoryStats());
  }, [dispatch]);

  const filters = [
    { id: 'all', label: 'All Categories' },
    { id: 'featured', label: 'Featured' },
    { id: 'hot', label: 'Hot' },
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New Arrivals' }
  ];

  const filteredCategories = displayCategories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'featured' && cat.isFeatured) ||
      (activeFilter === 'hot' && cat.isHot) ||
      (activeFilter === 'trending' && cat.isTrending) ||
      (activeFilter === 'new' && cat.isNew);
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const totalProducts = displayCategories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
  const totalCategories = displayCategories.length;

  const getIconEmoji = (iconClass) => {
    return iconMap[iconClass] || '📦';
  };

  if (loading && displayCategories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 relative">
      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)' }}></div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 pt-20 pb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection variants={scaleIn} className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500 rounded-full px-3 py-2 mb-3">
              <Zap className="w-3 h-3 text-white" />
              <span className="text-white font-bold text-xs">BROWSE CATEGORIES</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              Product <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Categories</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">Discover products organized by industry-leading categories</p>
          </AnimatedSection>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with Search and Results Count */}
          <AnimatedSection variants={fadeInUp} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeFilter === 'all' ? 'All Categories' : filters.find(f => f.id === activeFilter)?.label}
              </h2>
              <p className="text-slate-600 text-sm mt-1">Showing {filteredCategories.length} categories</p>
            </div>
            
            {/* Search Bar - Right Side */}
            <div className="lg:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search categories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-10 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Filter Tabs */}
          <AnimatedSection className="flex flex-wrap gap-2 mb-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:shadow-md hover:scale-105'
                } px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform`}
              >
                {filter.label}
              </button>
            ))}
          </AnimatedSection>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group cursor-pointer ring-4 ring-emerald-500/10"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black mb-1">{totalCategories}+</div>
                <div className="text-xs font-semibold text-white/80">Total Categories</div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group cursor-pointer ring-4 ring-amber-500/10"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black mb-1">{totalProducts > 1000 ? `${(totalProducts / 1000).toFixed(1)}K+` : `${totalProducts}+`}</div>
                <div className="text-xs font-semibold text-white/80">Products Available</div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group cursor-pointer ring-4 ring-cyan-500/10"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black mb-1">7+</div>
                <div className="text-xs font-semibold text-white/80">Countries Served</div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group cursor-pointer ring-4 ring-purple-500/10"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black mb-1">45+</div>
                <div className="text-xs font-semibold text-white/80">Trade Partners</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Categories Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            key={`${activeFilter}-${searchQuery}`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredCategories.map((category) => (
              <motion.div
                key={category._id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to={`/products?category=${category._id}`}
                  className="group block bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-2xl shadow-lg transition-all duration-500 overflow-hidden hover:ring-4 hover:ring-emerald-500/10 h-full"
                >
                  {/* Card Header with Image or Gradient */}
                  <div className="h-28 relative overflow-hidden">
                    {category.image?.url ? (
                      <img 
                        src={category.image.url} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br from-${category.gradient?.from || 'blue-500'} to-${category.gradient?.to || 'blue-700'}`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-14 h-14 bg-black/10 rounded-full -ml-7 -mb-7 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    {/* Category Tags - Right Top Corner */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {category.isHot && (
                        <span className="bg-red-500/90 text-white text-[7px] px-1.5 py-0.5 rounded font-bold">🔥 Hot</span>
                      )}
                      {category.isTrending && (
                        <span className="bg-purple-500/90 text-white text-[7px] px-1.5 py-0.5 rounded font-bold">📈 Trending</span>
                      )}
                      {category.isNew && (
                        <span className="bg-emerald-500/90 text-white text-[7px] px-1.5 py-0.5 rounded font-bold">✨ New</span>
                      )}
                      {category.badge?.text && (
                        <span className={`${category.badge.color || 'bg-emerald-500'} text-white text-[7px] px-1.5 py-0.5 rounded font-bold`}>{category.badge.text}</span>
                      )}
                    </div>
                    
                    {/* Icon - Smaller */}
                    <div className="absolute bottom-2 left-2 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      {category.icon ? (
                        <span className="text-lg">{getIconEmoji(category.icon)}</span>
                      ) : (
                        <Package className="text-white" size={16} />
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 mb-3 leading-relaxed line-clamp-2">
                      {category.description || 'Explore our collection of quality products'}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-all duration-300">
                        {(category.productCount || 0).toLocaleString()} Products
                      </span>
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-300">
                        <ArrowRight className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredCategories.length === 0 && !loading && (
            <AnimatedSection variants={scaleIn} className="text-center py-20">
              <motion.div 
                className="text-slate-300 mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Search size={64} className="mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No categories found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear Filters
              </button>
            </AnimatedSection>
          )}

          {/* Why Choose Our Products Section */}
          {filteredCategories.length > 0 && (
            <AnimatedSection variants={fadeInUp} className="mt-12 mb-8 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 rounded-2xl p-6 md:p-8 shadow-xl border border-emerald-200/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full px-4 py-1.5 mb-4 shadow-lg">
                    <Star className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-xs">WHY CHOOSE OUR PRODUCTS</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
                    Industry-Leading <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Product Selection</span>
                  </h2>
                  <p className="text-slate-600 max-w-2xl mx-auto">
                    Access thousands of high-quality products across multiple industries with competitive pricing and reliable export delivery
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-300 group relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <TrendingUp className="text-white" size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Export-Ready Sourcing</h3>
                      <p className="text-sm text-slate-600">
                        Every category is curated for quality, consistency, and smooth international shipment readiness
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200/50 hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 group relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Zap className="text-white" size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Competitive Pricing</h3>
                      <p className="text-sm text-slate-600">
                        Get access to factory-direct pricing with volume discounts and flexible payment terms for bulk orders
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 group relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Star className="text-white" size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Quality Assurance</h3>
                      <p className="text-sm text-slate-600">
                        Every product undergoes rigorous quality checks before shipment to meet your exact specifications
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Navigation Tips Section */}
          {filteredCategories.length > 0 && (
            <AnimatedSection variants={fadeInUp} className="mt-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-8 border border-blue-200/50 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">💡 Quick Tips for Better Results</h3>
                <p className="text-sm text-slate-600">Maximize your product discovery experience</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                  <div className="text-2xl mb-2">🔍</div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Use Search</h4>
                  <p className="text-xs text-slate-600">Type keywords to quickly find specific categories</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                  <div className="text-2xl mb-2">🏷️</div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Filter Smart</h4>
                  <p className="text-xs text-slate-600">Use filters to view popular or trending categories</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Check Count</h4>
                  <p className="text-xs text-slate-600">Product count indicates availability in each category</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Watch Badges</h4>
                  <p className="text-xs text-slate-600">Hot, Top, and Trending badges mark best categories</p>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>

      {/* Featured Categories Spotlight */}
      {displayFeatured.length > 0 && (
        <div className="py-12 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection variants={fadeInUp} className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-xs">FEATURED SPOTLIGHT</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
                Most Popular <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">This Month</span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Discover our trending categories with the highest demand and strongest import-export opportunities
              </p>
            </AnimatedSection>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {displayFeatured.slice(0, 3).map((category) => (
                <motion.div
                  key={category._id}
                  variants={scaleIn}
                  whileHover={{ scale: 1.03, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={`/products?category=${category._id}`}
                    className="group block bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-slate-200 hover:border-emerald-400"
                  >
                    <div className="h-40 relative overflow-hidden">
                      {category.image?.url ? (
                        <img 
                          src={category.image.url} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br from-${category.gradient?.from || 'purple-500'} to-${category.gradient?.to || 'pink-500'}`}></div>
                      )}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-4 left-4 z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                          <span className="text-2xl">{getIconEmoji(category.icon)}</span>
                        </div>
                        <h3 className="text-xl font-black text-white">{category.name}</h3>
                        <p className="text-white/90 text-sm">{category.description}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black text-slate-900">{(category.productCount || 0).toLocaleString()}</span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Products</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">Explore Category</span>
                        <ArrowRight className="text-emerald-500 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <AnimatedSection variants={fadeInUp} className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold text-xs">GET STARTED TODAY</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
            Can't Find What You're <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Looking For?</span>
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our expert team is ready to help you source the right products for your import and export goals.
            Whether you need custom categories or specific product requirements, we've got you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:from-emerald-600 hover:to-teal-600 transition-all shadow-2xl hover:shadow-emerald-500/50 inline-flex items-center justify-center gap-2 sm:gap-3 border-2 border-emerald-400/50 w-full sm:w-auto"
              >
                <Search size={18} className="sm:w-5 sm:h-5" />
                Request Custom Category
                <ArrowRight size={18} className="sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/products"
                className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-5 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
              >
                Browse All Products
                <Package size={18} className="sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-black text-white mb-2">24/7</div>
              <div className="text-sm font-semibold text-slate-300">Customer Support</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-black text-white mb-2">100%</div>
              <div className="text-sm font-semibold text-slate-300">Quality Guarantee</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-black text-white mb-2">Fast</div>
              <div className="text-sm font-semibold text-slate-300">Global Shipping</div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default CategoriesPage;
