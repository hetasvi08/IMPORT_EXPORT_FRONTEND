import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import ContactModal from '../../components/ContactModal';
import InquiryModal from '../../components/InquiryModal';
import useCurrency from '../../hooks/useCurrency';
import { addToCart } from '../../services/operations/cartAPI';
import { getAllCategories } from '../../services/operations/categoryAPI';
import { getFavorites, toggleFavorite } from '../../services/operations/favoritesAPI';
import { getAllProducts } from '../../services/operations/productAPI';
import { contactSupportAboutProduct } from '../../utils/whatsapp';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

// eslint-disable-next-line no-unused-vars
const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
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

const productData = [
  {
    name: "Premium Organic Basmati Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    category: "Food & Beverages",
    price: 1299,
    rating: 4.5,
    totalReviews: 127,
    moq: 50,
    stock: 500,
    isFeatured: true,
    badges: [],
    description: "Premium quality long-grain basmati rice, aged for perfect aroma and taste."
  },
  {
    name: "Handwoven Silk Saree Collection",
    image: "https://images.unsplash.com/photo-1588140686379-1b76a52103dc?w=400&h=300&fit=crop",
    category: "Textiles & Garments",
    price: 3499,
    rating: 4.8,
    totalReviews: 89,
    moq: 10,
    stock: 120,
    isFeatured: false,
    badges: ["Hot Deal"],
    description: "Elegant handwoven silk sarees with traditional Indian craftsmanship."
  },
  {
    name: "Stainless Steel Cookware Set",
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=300&fit=crop",
    category: "Home & Kitchen",
    price: 2199,
    rating: 4.2,
    totalReviews: 203,
    moq: 25,
    stock: 380,
    isFeatured: true,
    badges: [],
    description: "Durable stainless steel cookware set perfect for modern kitchen needs."
  },
  {
    name: "Natural Cold-Pressed Coconut Oil",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop",
    category: "Health & Beauty",
    price: 449,
    rating: 4.6,
    totalReviews: 56,
    moq: 100,
    stock: 1000,
    isFeatured: false,
    badges: [],
    description: "Pure cold-pressed coconut oil extracted from fresh organic coconuts."
  },
  {
    name: "Indian Spice Gift Box",
    image: "https://plus.unsplash.com/premium_photo-1692776206795-60a58a4dc817?w=400&h=300&fit=crop",
    category: "Food & Beverages",
    price: 899,
    rating: 4.3,
    totalReviews: 312,
    moq: 50,
    stock: 750,
    isFeatured: true,
    badges: ["Hot Deal"],
    description: "Curated collection of authentic Indian spices for global cuisine."
  },
  {
    name: "Pure Leather Handcrafted Bag",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
    category: "Fashion & Accessories",
    price: 4999,
    rating: 4.7,
    totalReviews: 74,
    moq: 20,
    stock: 85,
    isFeatured: false,
    badges: [],
    description: "Handcrafted genuine leather bag with contemporary design and ample space."
  },
  {
    name: "Beautiful Handicraft Wooden Vases",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=300&fit=crop",
    category: "Home Decor",
    price: 1599,
    rating: 4.1,
    totalReviews: 41,
    moq: 30,
    stock: 210,
    isFeatured: false,
    badges: [],
    description: "Artisan-made wooden vases featuring intricate hand-carved designs."
  },
  {
    name: "Export Quality Cotton T-Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    category: "Textiles & Garments",
    price: 699,
    rating: 4.4,
    totalReviews: 168,
    moq: 200,
    stock: 5000,
    isFeatured: true,
    badges: [],
    description: "Comfortable premium cotton t-shirts available in multiple colors."
  }
];

export const DUMMY_PRODUCTS = productData.map((product, index) => ({
  _id: `dummy-${index + 1}`,
  name: product.name,
  images: [
    {
      url: product.image,
    },
  ],
  category: {
    name: product.category,
  },
  price: product.price,
  rating: product.rating,
  totalReviews: product.totalReviews,
  moq: product.moq,
  stock: product.stock,
  isFeatured: product.isFeatured,
  badges: product.badges,
  shortDescription: product.description,
  description: product.description,
}));

const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { items: favoriteItems } = useSelector((state) => state.favorites);
  const { formatAmount, symbol, toINR } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: '',
    minPrice: '',
    maxPrice: '',
    moqRange: '',
    country: '',
    page: 1,
    limit: 6
  });
  const [sortBy, setSortBy] = useState('latest');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    // Load favorites if authenticated
    if (isAuthenticated && token) {
      dispatch(getFavorites(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy]);

  useEffect(() => {
if (!isMobileFiltersOpen) {
return;
    }
const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileFiltersOpen]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch {
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;

      // Convert price filters from selected currency to INR (base currency)
      // For predefined ranges, values are already in INR
      // For custom inputs, convert from selected currency
      if (filters.minPrice) {
        // If using predefined range (priceRange is set), values are already in INR
        // If custom input (no priceRange), convert from selected currency
        params.minPrice = filters.priceRange ? filters.minPrice : Math.round(toINR(Number(filters.minPrice)));
      }
      if (filters.maxPrice) {
        params.maxPrice = filters.priceRange ? filters.maxPrice : Math.round(toINR(Number(filters.maxPrice)));
      }

      if (filters.country) params.country = filters.country;
      params.page = filters.page;
      params.limit = filters.limit;
      params.isApproved = 'approved'; // Only show approved products

      // Add sorting parameters
      if (sortBy === 'priceAsc') {
        params.sort = 'price';
      } else if (sortBy === 'priceDesc') {
        params.sort = '-price';
      } else if (sortBy === 'popular') {
        params.sort = '-views,-totalOrders';
      } else {
        params.sort = '-createdAt'; // Latest (default)
      }

      const response = await getAllProducts(params);
      if (response.success && response.data?.length > 0) {
        setProducts(response.data);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total
        });
      } else {
        setProducts(DUMMY_PRODUCTS);
      }
    } catch {
      setProducts(DUMMY_PRODUCTS);
      setPagination(prev => ({ ...prev, total: DUMMY_PRODUCTS.length }));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    // Handle price range radio buttons
    if (key === 'priceRange') {
      const [min, max] = value.split('-');
      setFilters({ ...filters, priceRange: value, minPrice: min, maxPrice: max, page: 1 });
    } else if (key === 'minPrice' || key === 'maxPrice') {
      // Custom price input - clear the priceRange to indicate custom values
      setFilters({ ...filters, priceRange: '', [key]: value, page: 1 });
    } else if (key === 'page') {
      // Don't reset page when changing page
      setFilters({ ...filters, page: value });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleApplyFilters = () => {
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: '',
      minPrice: '',
      maxPrice: '',
      moqRange: '',
      country: '',
      page: 1,
      limit: 6
    });
    setSortBy('latest');
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Check if product is in favorites
  const isInFavorites = (productId) => {
    return favoriteItems?.some(item => item._id === productId);
  };

  // Handle add to cart - uses MOQ (minimum order quantity) as default
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const moq = product.moq || 1;
    dispatch(addToCart(product._id, moq, token, product));
  };

  // Handle toggle favorite
  const handleToggleFavorite = (e, product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const isFavorite = isInFavorites(product._id);
    dispatch(toggleFavorite(product._id, token, product, isFavorite));
  };

  // Handle view product details
  const handleViewDetails = (e, productId) => {
    e.stopPropagation();
    navigate(`/products/${productId}`);
  };

  // Handle contact button - open contact modal
  const handleContact = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setContactModalOpen(true);
  };

  // Handle raise inquiry
  const handleRaiseInquiry = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setInquiryModalOpen(true);
  };

  const renderFiltersContent = (isMobile = false) => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i className="fas fa-filter text-emerald-600"></i>
          Filters
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={clearFilters}
            className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
          >
            Clear All
          </button>
          {isMobile && (
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Close filters"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <i className="fas fa-dollar-sign text-emerald-600"></i>
          Price Range
        </h4>
        <div className="space-y-2">
          {[
            { label: `Under ${formatAmount(2000)}`, value: '0-2000', count: 120 },
            { label: `${formatAmount(2000)} - ${formatAmount(4000)}`, value: '2000-4000', count: 185 },
            { label: `${formatAmount(4000)} - ${formatAmount(8000)}`, value: '4000-8000', count: 82 },
            { label: `Over ${formatAmount(8000)}`, value: '8000-999999', count: 43 }
          ].map((range) => (
            <label key={range.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={filters.priceRange === range.value}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{range.label}</span>
              <span className="text-xs text-slate-400 ml-auto">({range.count})</span>
            </label>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-500 mb-2">CUSTOM RANGE</p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{symbol}</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <span className="text-slate-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{symbol}</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <i className="fas fa-th-large text-emerald-600"></i>
          Categories
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category === cat._id}
                onChange={(e) => handleFilterChange('category', e.target.checked ? cat._id : '')}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{cat.name}</span>
              <span className="text-xs text-slate-400 ml-auto">({cat.productCount || 0})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <i className="fas fa-boxes text-emerald-600"></i>
          Min Order Quantity
        </h4>
        <div className="space-y-2">
          {[
            { label: '1-100 Units', value: '1-100' },
            { label: '100-500 Units', value: '100-500' },
            { label: '500+ Units', value: '500-999999' }
          ].map((moq) => (
            <label key={moq.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="moqRange"
                value={moq.value}
                checked={filters.moqRange === moq.value}
                onChange={(e) => handleFilterChange('moqRange', e.target.value)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{moq.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          handleApplyFilters();
          if (isMobile) setIsMobileFiltersOpen(false);
        }}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
      >
        Apply Filters
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 pt-24 pb-10 md:pt-28 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Our Products</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Explore Global <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Products</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Discover premium products curated by our import-export team
            </p>
          </div>

          {/* Search Bar */}
          <AnimatedSection variants={fadeInUp} delay={0.2} className="mt-8 max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full px-6 py-4 rounded-full text-slate-900 bg-white shadow-xl border-2 border-transparent focus:border-emerald-500 focus:outline-none pl-14 text-base"
              />
              <i className="fas fa-search absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg"></i>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => {
setIsMobileFiltersOpen(true);
}}
            className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm"
          >
            <i className="fas fa-filter text-emerald-600"></i>
            Filter
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatedSection variants={slideInLeft} className="hidden lg:block lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
              {renderFiltersContent(false)}
            </div>
          </AnimatedSection>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-emerald-600"></i>
                <p className="mt-4 text-slate-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                <i className="fas fa-box-open text-6xl text-slate-300 mb-4"></i>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Products Found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <AnimatedSection variants={fadeInUp} className="flex items-center justify-between mb-6">
                  <p className="text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{products.length}</span> of{' '}
                    <span className="font-semibold text-slate-900">{pagination.total}</span> products
                  </p>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="latest">Sort by: Latest</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </AnimatedSection>

                {/* Products Grid */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
                      variants={fadeInUp}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Product Image */}
                      <div className="relative h-48 flex-shrink-0 overflow-hidden bg-slate-100">
                        <img
                          src={product.images[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isFeatured && (
                            <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              Featured
                            </span>
                          )}
                          {product.badges?.includes('Hot Deal') && (
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              Hot Deal
                            </span>
                          )}
                          {product.stock < 10 && product.stock > 0 && (
                            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              Low Stock
                            </span>
                          )}
                        </div>

                        {/* MOQ Badge */}
                        <div className="absolute top-3 right-3">
                          <div className="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-200">
                            MOQ: {product.moq}
                          </div>
                        </div>

                        {/* Hover Action Buttons */}
                        <div className="absolute right-3 top-14 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          {/* Favorite Button */}
                          <button
                            onClick={(e) => handleToggleFavorite(e, product)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${
                              isInFavorites(product._id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-slate-600 hover:bg-red-50 hover:text-red-500'
                            }`}
                            title={isInFavorites(product._id) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <i className={`fas fa-heart ${isInFavorites(product._id) ? '' : ''}`}></i>
                          </button>
                          {/* View Details Button */}
                          <button
                            onClick={(e) => handleViewDetails(e, product._id)}
                            className="w-10 h-10 bg-white text-slate-600 rounded-full flex items-center justify-center shadow-lg hover:bg-teal-50 hover:text-teal-600 transition-all hover:scale-110"
                            title="View details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {/* Share via WhatsApp Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              contactSupportAboutProduct(product, `${window.location.origin}/products/${product._id}`);
                            }}
                            className="w-10 h-10 bg-white text-slate-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-50 hover:text-green-600 transition-all hover:scale-110"
                            title="Contact via WhatsApp"
                          >
                            <i className="fab fa-whatsapp"></i>
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3 flex flex-col h-full">
                        {/* Category */}
                        <div className="mb-1">
                          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded">
                            {product.category?.name || 'Uncategorized'}
                          </span>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 text-base leading-tight h-10">
                          {product.name}
                        </h3>

                        {/* Short Description */}
                        <p className="text-xs text-slate-600 mb-2 line-clamp-2 leading-relaxed h-10">
                          {product.shortDescription || product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star text-[10px] ${
                                  i < Math.floor(product.rating || 0) ? 'text-amber-400' : 'text-slate-300'
                                }`}
                              ></i>
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{product.rating?.toFixed(1) || '0.0'}</span>
                          <span className="text-[10px] text-slate-500">({product.totalReviews || 0})</span>
                        </div>

                        {/* Price */}
                        <div className="mb-1">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400">Price</p>
                          <p className="text-lg font-black text-emerald-600">
                            {formatAmount(product.price || 0)}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-1.5 mt-auto pt-1">
                          <button
                            onClick={(e) => handleViewDetails(e, product._id)}
                            className="md:hidden w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white py-2 rounded-lg text-xs font-semibold hover:from-slate-800 hover:to-black transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <i className="fas fa-eye text-[10px]"></i>
                            <span>View Details</span>
                          </button>
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              onClick={(e) => handleContact(e, product)}
                              className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-2.5 px-3 rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all shadow-sm flex items-center justify-center gap-1.5 min-w-0"
                            >
                              <i className="fas fa-envelope text-[9px] sm:text-[10px]"></i>
                              <span className="truncate leading-none">Contact</span>
                            </button>
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 px-3 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm flex items-center justify-center gap-1.5 min-w-0"
                            >
                              <i className="fas fa-shopping-cart text-[9px] sm:text-[10px]"></i>
                              <span className="truncate leading-none">Add to Cart</span>
                            </button>
                          </div>
                          <button
                            onClick={(e) => handleRaiseInquiry(e, product)}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg text-xs font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <i className="fas fa-paper-plane text-[10px]"></i>
                            <span>Raise Inquiry</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <AnimatedSection variants={fadeInUp} className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                      disabled={filters.page === 1}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleFilterChange('page', i + 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          filters.page === i + 1
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handleFilterChange('page', Math.min(pagination.pages, filters.page + 1))}
                      disabled={filters.page === pagination.pages}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </AnimatedSection>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel - using Portal to avoid stacking context issues */}
      {isMobileFiltersOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999] lg:hidden bg-black/35"
          onClick={() => {
setIsMobileFiltersOpen(false);
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
            style={{ height: '75vh', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}
            onClick={(e) => {
e.stopPropagation();
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-300 flex items-center justify-between shrink-0">
              <h2 className="font-bold text-lg text-slate-900">Filters</h2>
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all"
                  onClick={() => {
handleApplyFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                >
                  Apply
                </button>
                <button
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                  onClick={() => {
setIsMobileFiltersOpen(false);
                  }}
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              {(() => {
return renderFiltersContent(true);
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => {
          setInquiryModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => {
          setContactModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsPage;
