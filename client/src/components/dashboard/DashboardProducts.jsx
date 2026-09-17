import {
  ChevronDown,
  Eye,
  Filter,
  Grid3x3,
  Heart,
  List,
  Loader2,
  Mail,
  Package,
  Search,
  Send,
  ShoppingCart,
  Star,
  TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { apiconnector } from '../../services/apiconnector';
import { categoryEndpoints, productEndpoints } from '../../services/apis';
import { addToCart } from '../../services/operations/cartAPI';
import { getFavorites, toggleFavorite } from '../../services/operations/favoritesAPI';
import ContactModal from '../ContactModal';
import InquiryModal from '../InquiryModal';

const DashboardProducts = () => {
  const { token, user } = useSelector((state) => state.auth);
  const canViewSupplierIdentity = user?.role === 'admin' || user?.role === 'supplier';
  const { items: favoriteItems } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('newest');
  const [minRating, setMinRating] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Categories from API
  const [categories, setCategories] = useState([
    { _id: 'all', name: 'All Products' }
  ]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiconnector('GET', categoryEndpoints.GET_ALL_CATEGORIES_API);
      if (response.data.success) {
        setCategories([
          { _id: 'all', name: 'All Products' },
          ...response.data.data
        ]);
      }
    } catch (error) {
// Keep default category on error
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // Load favorites
    if (token) {
      dispatch(getFavorites(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sort: getSortValue(sortBy)
      });

      // Category filter - use category ID (not 'all')
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      // Search filter
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      // Price range filter
      if (priceRange[0] > 0) {
        params.append('minPrice', priceRange[0]);
      }
      if (priceRange[1] < 10000) {
        params.append('maxPrice', priceRange[1]);
      }

      // Rating filter
      if (minRating > 0) {
        params.append('rating[gte]', minRating);
      }

      const response = await apiconnector(
        'GET',
        `${productEndpoints.GET_ALL_PRODUCTS_API}?${params}`,
        null,
        token ? { Authorization: `Bearer ${token}` } : {}
      );

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || response.data.pages || 1);
        setTotalProducts(response.data.pagination?.totalResults || response.data.total || response.data.data.length);
      }
    } catch (error) {

      // Mock data for demo
      setProducts(generateMockProducts());
      setTotalPages(3);
      setTotalProducts(36);
    } finally {
      setLoading(false);
    }
  };

  const getSortValue = (sortOption) => {
    const sortMap = {
      'newest': '-createdAt',
      'oldest': 'createdAt',
      'price-low': 'price',
      'price-high': '-price',
      'popular': '-totalOrders',
      'rating': '-rating'
    };
    return sortMap[sortOption] || '-createdAt';
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  // Check if product is in favorites
  const isInFavorites = (productId) => {
    return favoriteItems?.some(item => item._id === productId);
  };

  // Add to cart with MOQ (minimum order quantity) as default
  const handleAddToCart = (product) => {
    const moq = product.moq || 1;
    dispatch(addToCart(product._id, moq, token, product));
  };

  const handleToggleFavorite = (product) => {
    const isFavorite = isInFavorites(product._id);
    dispatch(toggleFavorite(product._id, token, product, isFavorite));
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleContact = (product) => {
    setSelectedProduct(product);
    setContactModalOpen(true);
  };

  const handleRaiseInquiry = (product) => {
    setSelectedProduct(product);
    setInquiryModalOpen(true);
  };

  const generateMockProducts = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      _id: `product-${i + 1}`,
      name: `Industrial Product ${i + 1}`,
      shortDescription: 'High-quality industrial component for manufacturing',
      price: 100 + i * 50,
      moq: 10 + i * 5,
      images: [{ url: `https://via.placeholder.com/300?text=Product+${i + 1}` }],
      rating: 4 + Math.random(),
      totalReviews: Math.floor(Math.random() * 100),
      totalOrders: Math.floor(Math.random() * 500),
      supplier: { companyName: `Supplier ${i + 1}`, country: 'China' },
      category: { name: categories.length > 1 ? categories[Math.floor(Math.random() * (categories.length - 1)) + 1]?.name || 'General' : 'General' },
      badges: i % 3 === 0 ? ['Hot Deal'] : [],
      isFeatured: i % 4 === 0
    }));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2 sm:gap-3">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            Products Catalog
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Browse and discover quality industrial products
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white shadow-sm text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-white shadow-sm text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative w-full sm:w-40 lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white cursor-pointer"
              disabled={loadingCategories}
            >
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-40 lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors duration-200"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm">Filters</span>
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(+e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    fetchProducts();
                  }}
                  className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing <span className="font-semibold text-gray-900">{products.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalProducts}</span> products
        </span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <>
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'
              : 'space-y-3 sm:space-y-4'
          }>
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode={viewMode}
                index={index}
                canViewSupplierIdentity={canViewSupplierIdentity}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                onViewDetails={handleViewDetails}
                onContact={handleContact}
                onRaiseInquiry={handleRaiseInquiry}
                isFavorite={isInFavorites(product._id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 sm:px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
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

// Product Card Component
const ProductCard = ({ product, viewMode, index, canViewSupplierIdentity, onAddToCart, onToggleFavorite, onViewDetails, onContact, onRaiseInquiry, isFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === 'list') {
    return (
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 animate-slideInLeft"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex gap-4">
          {/* Image */}
          <div
            className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => onViewDetails(product._id)}
          >
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3
                  className="text-lg font-bold text-gray-900 mb-1 truncate cursor-pointer hover:text-teal-600"
                  onClick={() => onViewDetails(product._id)}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.shortDescription || product.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating?.toFixed(1) || '0.0'}</span>
                    <span>({product.totalReviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{product.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{product.totalOrders || 0} orders</span>
                  </div>
                </div>

                {/* Price and MOQ */}
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-2xl font-bold text-teal-600">
                      ${product.price || 0}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    MOQ: {product.moq} {product.unit || 'pcs'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onToggleFavorite(product)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onViewDetails(product._id)}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 transition-all duration-200"
                  title="View details"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onContact(product)}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200"
                  title="Contact"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onAddToCart(product)}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 transition-all duration-200"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onRaiseInquiry(product)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-1"
                  title="Raise Inquiry"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fadeInUp flex flex-col h-auto sm:h-[500px]"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-32 sm:h-48 flex-shrink-0 overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 cursor-pointer ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          onClick={() => onViewDetails(product._id)}
        />

        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.badges.map((badge, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {product.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500/90 text-white'
                : 'bg-white/90 hover:bg-red-50 text-gray-700 hover:text-red-500'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product._id);
            }}
            className="p-2 bg-white/90 hover:bg-teal-50 rounded-lg backdrop-blur-sm text-gray-700 hover:text-teal-600 transition-colors duration-200"
            title="View details"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
        {/* Category and Supplier */}
        <div className="flex items-center justify-between mb-1 sm:mb-2 text-[10px] sm:text-xs text-gray-500">
          <span className="font-medium truncate max-w-[50%]">{product.category?.name || 'Uncategorized'}</span>
          <span className="truncate max-w-[40%]">{product.supplier?.country}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-xs sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 sm:h-12">
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                  i < Math.floor(product.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-sm text-gray-600">
            {product.rating?.toFixed(1) || '0.0'}
          </span>
          <span className="text-[9px] sm:text-xs text-gray-400 hidden sm:inline">
            ({product.totalReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mb-1.5 sm:mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-2xl font-bold text-teal-600">
              ${product.price || 0}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500">
            MOQ: {product.moq} {product.unit || 'pcs'}
          </span>
        </div>

        {/* Supplier Info */}
        {canViewSupplierIdentity && (
          <p className="text-[10px] sm:text-xs text-gray-600 mb-1.5 sm:mb-3 truncate">
            by {product.supplier?.companyName}
          </p>
        )}

        {/* Action Buttons - pushed to bottom */}
        <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={() => onContact(product)}
              className="py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 text-[10px] sm:text-sm"
            >
              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Contact</span>
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="py-1.5 sm:py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 text-[10px] sm:text-sm"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Cart</span>
            </button>
          </div>
          <button
            onClick={() => onRaiseInquiry(product)}
            className="w-full py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Raise Inquiry</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;
