import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import { getProductById } from '../../services/operations/productAPI';
import { getProductReviews, createReview, toggleReviewHelpful } from '../../services/operations/reviewAPI';
import { getCatalogsByCategory } from '../../services/operations/catalogAPI';
import { apiconnector } from '../../services/apiconnector';
import ContactModal from '../../components/ContactModal';
import { contactSupportAboutProduct } from '../../utils/whatsapp';
import { addToCart } from '../../services/operations/cartAPI';
import useCurrency from '../../hooks/useCurrency';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { formatAmount } = useCurrency();
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('specifications');
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [fullImageModal, setFullImageModal] = useState(false);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [savingSummary, setSavingSummary] = useState(false);
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, totalReviews: 0 });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  // Quote modal states
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    quantity: 1,
    description: '',
    targetPrice: '',
    urgency: 'Medium',
    expectedDeliveryDate: '',
    deliveryCity: '',
    deliveryCountry: ''
  });
  // Catalog states
  const [categoryCatalogs, setCategoryCatalogs] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-slide effect for images
  useEffect(() => {
    if (!product?.images || product.images.length <= 1 || !isAutoSliding) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [product?.images, isAutoSliding]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && fullImageModal) {
        setFullImageModal(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullImageModal]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Use admin API if admin, otherwise use regular API
      const response = isAdmin 
        ? await getAdminProductById(id, token)
        : await getProductById(id);
      
      if (response.success) {
        setProduct(response.data);
        setSummaryText(response.data.summary || '');
        // Set initial quantity to MOQ (minimum order quantity)
        setQuantity(response.data.moq || 1);
        // Fetch reviews after product is loaded
        fetchReviews();
        // Fetch catalogs for product's category
        if (response.data.category?._id || response.data.category) {
          const categoryId = response.data.category?._id || response.data.category;
          fetchCategoryCatalogs(categoryId);
        }
      }
    } catch {
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await getProductReviews(id);
      if (response.success) {
        setReviews(response.data || []);
        setReviewStats(response.stats || { avgRating: 0, totalReviews: 0 });
      }
    } catch {
      void 0;
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchCategoryCatalogs = async (categoryId) => {
    if (!categoryId) return;
    try {
      setLoadingCatalogs(true);
      const response = await getCatalogsByCategory(categoryId);
      if (response.success) {
        setCategoryCatalogs(response.data || []);
      }
    } catch {
      void 0;
    } finally {
      setLoadingCatalogs(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      return;
    }
    if (!reviewFormData.comment.trim()) {
      return;
    }
    try {
      setSubmittingReview(true);
      await createReview({
        product: id,
        rating: reviewFormData.rating,
        title: reviewFormData.title,
        comment: reviewFormData.comment
      }, token);
      setShowReviewForm(false);
      setReviewFormData({ rating: 5, title: '', comment: '' });
      fetchReviews();
    } catch {
      void 0;
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!token) {
      return;
    }
    try {
      await toggleReviewHelpful(reviewId, token);
      fetchReviews();
    } catch {
      void 0;
    }
  };

  const handleRequestQuote = () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    // Reset form and open modal
    setQuoteFormData({
      quantity: quantity,
      description: '',
      targetPrice: product?.price || '',
      urgency: 'Medium',
      expectedDeliveryDate: '',
      deliveryCity: '',
      deliveryCountry: ''
    });
    setShowQuoteModal(true);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!quoteFormData.quantity || quoteFormData.quantity < 1) {
      return;
    }

    setSubmittingQuote(true);
    try {
      const quoteData = {
        product: product._id,
        productName: product.name,
        category: product.category?._id || product.category,
        quantity: parseInt(quoteFormData.quantity),
        unit: product.unit || 'pieces',
        description: quoteFormData.description,
        targetPrice: quoteFormData.targetPrice ? parseFloat(quoteFormData.targetPrice) : undefined,
        urgency: quoteFormData.urgency,
        expectedDeliveryDate: quoteFormData.expectedDeliveryDate || undefined,
        deliveryLocation: {
          city: quoteFormData.deliveryCity,
          country: quoteFormData.deliveryCountry
        }
      };

      const response = await apiconnector(
        'POST',
        quoteEndpoints.CREATE_QUOTE_API,
        quoteData,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        setShowQuoteModal(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleNextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Summary handlers
  const handleEditSummary = () => {
    if (!isAdmin) return;
    setIsEditingSummary(true);
  };

  const handleCancelEditSummary = () => {
    setSummaryText(product?.summary || '');
    setIsEditingSummary(false);
  };

  const handleSaveSummary = async () => {
    if (!isAdmin || !id) return;
    
    try {
      setSavingSummary(true);
      const response = await updateProductSummary(id, summaryText, token);
      
      if (response.success) {
        setProduct({ ...product, summary: summaryText });
        setIsEditingSummary(false);
      }
    } catch {
      void 0;
    } finally {
      setSavingSummary(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i>
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <i className="fas fa-box-open text-6xl text-slate-300"></i>
        <p className="text-slate-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[60px] bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/40">
      {/* Breadcrumb + Back Button */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm py-3 sm:py-4 sticky top-[60px] z-30 border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-orange-100 hover:to-amber-100 text-slate-700 hover:text-orange-700 rounded-xl font-bold text-xs sm:text-sm transition-all flex-shrink-0"
            >
              <i className="fas fa-arrow-left"></i>
              <span className="hidden sm:inline">Back to Products</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm min-w-0">
              <i className="fas fa-chevron-right text-slate-400 text-xs flex-shrink-0"></i>
              <button 
                onClick={() => navigate('/')}
                className="text-slate-600 hover:text-orange-600 transition-colors font-medium flex-shrink-0"
              >
                Home
              </button>
              <i className="fas fa-chevron-right text-slate-400 text-xs flex-shrink-0"></i>
              <button 
                onClick={() => navigate('/products')}
                className="text-slate-600 hover:text-orange-600 transition-colors font-medium flex-shrink-0"
              >
                Products
              </button>
              <i className="fas fa-chevron-right text-slate-400 text-xs flex-shrink-0"></i>
              <span className="text-slate-900 font-semibold truncate">{product.name}</span>
            </div>
            <span className="sm:hidden text-xs font-semibold text-slate-700 truncate min-w-0">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* Main Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
          {/* LEFT - Images */}
          <div className="space-y-4">
            {/* Main Image with Fixed Height */}
            <div className="relative group">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-orange-100/50 relative h-[280px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <div 
                    className="relative w-full h-full flex items-center justify-center cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => {
                      setShowZoom(true);
                      setIsAutoSliding(false);
                    }}
                    onMouseLeave={() => {
                      setShowZoom(false);
                      setIsAutoSliding(true);
                    }}
                  >
                    <img 
                      src={product.images[selectedImage]?.url} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 transition-all duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <i className="fas fa-box text-8xl text-orange-300"></i>
                  </div>
                )}

                {/* Full Image Button */}
                <button
                  onClick={() => setFullImageModal(true)}
                  className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-sm"
                >
                  <i className="fas fa-expand mr-2"></i>
                  See Full Image
                </button>

                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-orange-500 text-slate-700 hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      onMouseEnter={() => setIsAutoSliding(false)}
                      onMouseLeave={() => setIsAutoSliding(true)}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-orange-500 text-slate-700 hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      onMouseEnter={() => setIsAutoSliding(false)}
                      onMouseLeave={() => setIsAutoSliding(true)}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Zoomed Image Overlay - Amazon Style */}
              {showZoom && product.images && product.images.length > 0 && (
                <div className="hidden lg:block absolute top-0 left-full ml-4 w-[450px] h-[500px] bg-white shadow-2xl border-2 border-orange-300 rounded-2xl overflow-hidden z-20">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${product.images[selectedImage]?.url})`,
                      backgroundSize: '200%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      <i className="fas fa-search-plus mr-1.5"></i>
                      Zoomed View
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images - Bottom */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setIsAutoSliding(false);
                      setTimeout(() => setIsAutoSliding(true), 5000);
                    }}
                    className={`flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 w-20 h-20 ${
                      selectedImage === index 
                        ? 'ring-3 ring-orange-500 shadow-xl scale-105' 
                        : 'ring-1 ring-slate-200 hover:ring-orange-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={image.url} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Summary Section */}
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md border border-purple-100/50 mt-3 sm:mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i className="fas fa-file-alt text-purple-600"></i>
                  Product Summary
                </h3>
                {isAdmin && !isEditingSummary && (
                  <button
                    onClick={handleEditSummary}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 bg-white px-3 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-1.5"
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                )}
              </div>

              {isEditingSummary ? (
                <div className="space-y-3">
                  <textarea
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    placeholder="Enter detailed product summary..."
                    rows="8"
                    maxLength="3000"
                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-sm text-slate-700 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      {summaryText.length} / 3000 characters
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEditSummary}
                        disabled={savingSummary}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSummary}
                        disabled={savingSummary}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {savingSummary ? (
                          <>
                            <i className="fas fa-circle-notch fa-spin"></i>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save"></i>
                            Save Summary
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {product?.summary || (
                    <p className="text-slate-500 italic flex items-center gap-2">
                      <i className="fas fa-info-circle"></i>
                      {isAdmin 
                        ? 'No summary available. Click "Edit" to add a detailed product summary.'
                        : 'No summary available for this product.'
                      }
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Product Info */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-orange-100/50 transform transition-all duration-300 hover:shadow-2xl h-fit">
            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mb-3 sm:mb-4 leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">{product.name}</h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i}
                    className={`fas fa-star transition-all duration-300 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300'}`}
                  ></i>
                ))}
                <span className="text-sm font-bold text-slate-900 ml-2">{product.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <span className="text-sm text-slate-600">({product.totalReviews || 0} Reviews)</span>
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
                  <i className="fas fa-check-circle mr-1"></i>
                  In Stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs font-bold rounded-full shadow-md">
                  <i className="fas fa-times-circle mr-1"></i>
                  Out of Stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-emerald-200/50 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  {formatAmount(product.price || 0)}
                </span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <i className="fas fa-check-circle text-emerald-500"></i>
                Inclusive of all taxes • Free shipping
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 flex items-center gap-2">
                <i className="fas fa-boxes text-emerald-500"></i>
                Min. Order: {product.moq || 1} {product.unit || 'units'}
              </p>
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <i className="fas fa-sparkles text-orange-500"></i>
                  Key Features
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm bg-gradient-to-r from-orange-50/50 to-amber-50/50 p-2.5 sm:p-3 rounded-lg transition-all duration-200 hover:from-orange-50 hover:to-amber-50 hover:shadow-md transform hover:-translate-y-0.5">
                      <i className="fas fa-check-circle text-orange-500 flex-shrink-0"></i>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.color && product.color.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <i className="fas fa-palette text-orange-500"></i>
                  Available Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.color.map((color, index) => (
                    <span key={index} className="bg-gradient-to-r from-orange-100 to-amber-100 text-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-orange-200 transition-all duration-200 hover:shadow-md hover:scale-105 transform cursor-pointer hover:from-orange-200 hover:to-amber-200">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity - Only for non-admin users */}
            {!isAdmin && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <i className="fas fa-calculator text-orange-500"></i>
                  Quantity
                </h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(product.moq || 1, quantity - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 rounded-xl flex items-center justify-center font-bold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-minus text-orange-600"></i>
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    min={product.moq || 1}
                    onChange={(e) => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || 1))}
                    className="w-16 sm:w-20 h-10 sm:h-12 bg-white border-2 border-orange-200 rounded-xl text-center font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm text-sm sm:text-base"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 rounded-xl flex items-center justify-center font-bold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-plus text-orange-600"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons - Different for admin vs user */}
            {!isAdmin && (
              <div className="flex flex-col gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                {/* Add to Cart Button */}
                <button 
                  onClick={() => dispatch(addToCart(product._id, quantity, token, product))}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-shopping-cart"></i>
                  Add to Cart
                </button>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button 
                    onClick={() => setContactModalOpen(true)}
                    className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                  
                    Contact Team
                  </button>
                  <button 
                    onClick={handleRequestQuote}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                   
                    Request Quote
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                  <button 
                    onClick={() => contactSupportAboutProduct(product, window.location.href)}
                    className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <i className="fab fa-whatsapp"></i>
                    Contact Support
                  </button>
                </div>
              </div>
            )}

            {/* Category Catalog Download */}
            {!isAdmin && (loadingCatalogs || categoryCatalogs.length > 0) && (
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-emerald-200/50 shadow-md hover:shadow-lg transition-all duration-300 mt-3 sm:mt-4">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <i className="fas fa-file-pdf text-white text-sm sm:text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Category Catalog</h4>
                    <p className="text-xs text-slate-600">Download detailed product catalogs</p>
                  </div>
                </div>
                {loadingCatalogs ? (
                  <div className="text-center py-4">
                    <i className="fas fa-spinner fa-spin text-emerald-500 text-xl"></i>
                    <p className="text-xs text-slate-500 mt-2">Loading catalogs...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {categoryCatalogs.slice(0, 3).map((catalog) => (
                        <button
                          key={catalog._id}
                          onClick={async () => {
                            try {
                              const response = await fetch(catalog.pdfFile?.url);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `${catalog.title}.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } catch {
// Fallback: open in new tab
                              window.open(catalog.pdfFile?.url, '_blank');
                            }
                          }}
                          className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <i className="fas fa-book text-emerald-500"></i>
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors truncate max-w-[150px]">
                              {catalog.title}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">
                            <i className="fas fa-download"></i> PDF
                          </span>
                        </button>
                      ))}
                    </div>
                    {categoryCatalogs.length > 3 && (
                      <button
                        onClick={() => navigate(`/catalogs?category=${product.category?._id || product.category}`)}
                        className="mt-3 w-full text-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 py-2 border-t border-emerald-200"
                      >
                        View all {categoryCatalogs.length} catalogs <i className="fas fa-arrow-right ml-1"></i>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Stats - Only for admin */}
            {isAdmin && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-blue-600">{product.totalReviews || 0}</p>
                  <p className="text-xs text-blue-700">Reviews</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-emerald-600">{product.totalOrders || 0}</p>
                  <p className="text-xs text-emerald-700">Orders</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-amber-600">{product.inquiries || 0}</p>
                  <p className="text-xs text-amber-700">Inquiries</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-orange-100/50 overflow-hidden">
          {/* Tabs - Scrollable on mobile */}
          <div className="flex gap-0 border-b border-orange-200 bg-gradient-to-r from-orange-50/50 via-amber-50/50 to-yellow-50/50 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-4 py-3 sm:px-8 sm:py-4 font-bold text-xs sm:text-sm transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${
                activeTab === 'specifications'
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <i className="fas fa-cog mr-1.5 sm:mr-2"></i>
              Specifications
              {activeTab === 'specifications' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-3 sm:px-8 sm:py-4 font-bold text-xs sm:text-sm transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${
                activeTab === 'description'
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <i className="fas fa-align-left mr-1.5 sm:mr-2"></i>
              Description
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-3 sm:px-8 sm:py-4 font-bold text-xs sm:text-sm transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <i className="fas fa-star mr-1.5 sm:mr-2"></i>
              Reviews ({product.totalReviews || 0})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="animate-fadeIn">
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <i className="fas fa-cog text-orange-500"></i>
                  Technical Specifications
                </h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                        <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                          <i className="fas fa-circle text-orange-500 text-xs"></i>
                          {spec.key}
                        </span>
                        <span className="text-sm text-slate-900 font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-clipboard-list text-6xl text-slate-300 mb-4"></i>
                    <p className="text-slate-600">No specifications available</p>
                  </div>
                )}

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {product.material && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <p className="text-xs font-semibold text-blue-600 mb-0.5 flex items-center gap-2">
                        <i className="fas fa-cube"></i>
                        Material
                      </p>
                      <p className="font-bold text-slate-900">{product.material}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <p className="text-xs font-semibold text-purple-600 mb-0.5 flex items-center gap-2">
                        <i className="fas fa-weight"></i>
                        Weight
                      </p>
                      <p className="font-bold text-slate-900">{product.weight.value} {product.weight.unit}</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <p className="text-xs font-semibold text-orange-600 mb-0.5 flex items-center gap-2">
                        <i className="fas fa-ruler-combined"></i>
                        Dimensions
                      </p>
                      <p className="font-bold text-slate-900">
                        {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                      </p>
                    </div>
                  )}
                  {product.leadTime && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <p className="text-xs font-semibold text-emerald-600 mb-0.5 flex items-center gap-2">
                        <i className="fas fa-clock"></i>
                        Lead Time
                      </p>
                      <p className="font-bold text-slate-900">
                        {product.leadTime.min}-{product.leadTime.max} {product.leadTime.unit}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-4 sm:mb-6">Product Description</h3>
                <div className="prose max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                  {product.shortDescription && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:shadow-md transition-all duration-200">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <i className="fas fa-info-circle text-orange-600"></i>
                        Summary
                      </h4>
                      <p className="text-slate-700">{product.shortDescription}</p>
                    </div>
                  )}

                  {/* Package Contents */}
                  {product.packaging && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 hover:shadow-md transition-all duration-200">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <i className="fas fa-box text-slate-600"></i>
                        Packaging
                      </h4>
                      <p className="text-slate-700">{product.packaging}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900">Customer Reviews</h3>
                    <div className="flex items-center gap-2 sm:gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`fas fa-star ${
                              star <= Math.round(reviewStats.avgRating)
                                ? 'text-amber-400'
                                : 'text-slate-300'
                            }`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-lg font-bold text-slate-900">
                        {reviewStats.avgRating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-slate-500">
                        ({reviewStats.totalReviews || 0} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                  
                  {user && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm"
                    >
                      <i className="fas fa-pen mr-2"></i>
                      Write a Review
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Write Your Review</h4>
                    <form onSubmit={handleSubmitReview} className="space-y-3 sm:space-y-4">
                      {/* Star Rating */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                        <div className="flex gap-1.5 sm:gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewFormData({ ...reviewFormData, rating: star })}
                              className="text-2xl sm:text-3xl transition-all hover:scale-110"
                            >
                              <i
                                className={`fas fa-star ${
                                  star <= reviewFormData.rating ? 'text-amber-400' : 'text-slate-300'
                                }`}
                              ></i>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Review Title (Optional)
                        </label>
                        <input
                          type="text"
                          value={reviewFormData.title}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, title: e.target.value })}
                          placeholder="Summarize your experience"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-0 outline-none"
                          maxLength={100}
                        />
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Your Review <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={reviewFormData.comment}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                          placeholder="Share your experience with this product..."
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-0 outline-none resize-none"
                          maxLength={1000}
                          required
                        />
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                        >
                          {submittingReview ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane mr-2"></i>
                              Submit Review
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                {loadingReviews ? (
                  <div className="text-center py-8 sm:py-12">
                    <i className="fas fa-spinner fa-spin text-3xl sm:text-4xl text-orange-500 mb-4"></i>
                    <p className="text-slate-600 text-sm sm:text-base">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-xl sm:rounded-2xl">
                    <i className="fas fa-comments text-4xl sm:text-6xl text-slate-300 mb-3 sm:mb-4"></i>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">No Reviews Yet</h4>
                    <p className="text-slate-500 text-sm sm:text-base">Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all"
                      >
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="flex items-center gap-2.5 sm:gap-4">
                            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                              {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-900 text-sm sm:text-base">{review.user?.name || 'Anonymous'}</h5>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                      key={star}
                                      className={`fas fa-star text-sm ${
                                        star <= review.rating ? 'text-amber-400' : 'text-slate-300'
                                      }`}
                                    ></i>
                                  ))}
                                </div>
                                {review.isVerifiedPurchase && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                    <i className="fas fa-check-circle mr-1"></i>
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm text-slate-500 flex-shrink-0">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Review Content */}
                        {review.title && (
                          <h4 className="font-bold text-slate-900 mb-2">{review.title}</h4>
                        )}
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{review.comment}</p>

                        {/* Helpful Button */}
                        <div className="flex items-center gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                          <button
                            onClick={() => handleHelpful(review._id)}
                            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all text-xs sm:text-sm ${
                              review.helpfulBy?.includes(user?._id)
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <i className="fas fa-thumbs-up"></i>
                            <span>Helpful ({review.helpfulCount || 0})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {fullImageModal && product.images && product.images.length > 0 && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn">
          {/* Blurry Background Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setFullImageModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 max-w-6xl w-full max-h-[92vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setFullImageModal(false)}
              className="absolute top-3 right-3 sm:-top-2 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white backdrop-blur-sm text-slate-700 hover:text-orange-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-90 shadow-lg z-20"
            >
              <i className="fas fa-times text-base sm:text-lg"></i>
            </button>

            {/* Image Container */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <div className="relative h-[58vh] sm:h-[70vh] flex items-center justify-center p-3 sm:p-6">
                <img 
                  src={product.images[selectedImage]?.url} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-all duration-500"
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-white/90 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 text-slate-700 hover:text-white rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                    >
                      <i className="fas fa-chevron-left text-sm sm:text-xl"></i>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-white/90 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 text-slate-700 hover:text-white rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                    >
                      <i className="fas fa-chevron-right text-sm sm:text-xl"></i>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold shadow-2xl text-sm sm:text-base">
                  {selectedImage + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="bg-black/30 backdrop-blur-sm p-2.5 sm:p-4">
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-white/10">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-110 w-14 h-14 sm:w-20 sm:h-20 ${
                          selectedImage === index 
                            ? 'ring-4 ring-orange-500 scale-110' 
                            : 'ring-2 ring-white/30 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={image.url} 
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Image Info */}
            <div className="mt-3 sm:mt-4 text-center px-4">
              <p className="text-white font-bold text-sm sm:text-lg drop-shadow-lg line-clamp-1">{product.name}</p>
              <p className="text-white/70 text-xs sm:text-sm mt-1">Tap outside or press ESC to close</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - Only for admin */}
      {isAdmin && deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trash text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Delete Product?</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        product={product}
      />

      {/* Quote Request Modal */}
      {showQuoteModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header - Sticky */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <i className="fas fa-file-invoice text-blue-500"></i>
                Request Quote
              </h3>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all"
              >
                <i className="fas fa-times text-slate-600"></i>
              </button>
            </div>

            {/* Scrollable Content - Hidden scrollbar */}
            <div className="quote-modal-scroll flex-1 overflow-y-auto p-4 sm:p-6 pt-3 sm:pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`.quote-modal-scroll::-webkit-scrollbar { display: none; }`}</style>

            {/* Product Info */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl mb-4 sm:mb-6 border border-slate-200">
              {product.images?.[0]?.url ? (
                <img 
                  src={product.images[0].url} 
                  alt={product.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-box text-slate-400 text-lg sm:text-xl"></i>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 line-clamp-2 text-sm sm:text-base">{product.name}</h4>
                <p className="text-sm text-slate-600">{formatAmount(product.price)} per {product.unit || 'unit'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <i className="fas fa-boxes text-blue-500 mr-2"></i>
                  Quantity Required *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quoteFormData.quantity}
                  onChange={(e) => setQuoteFormData({...quoteFormData, quantity: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              {/* Target Price */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <i className="fas fa-dollar-sign text-emerald-500 mr-2"></i>
                  Target Price (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={quoteFormData.targetPrice}
                  onChange={(e) => setQuoteFormData({...quoteFormData, targetPrice: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Your target price per unit"
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <i className="fas fa-clock text-orange-500 mr-2"></i>
                  Urgency
                </label>
                <select
                  value={quoteFormData.urgency}
                  onChange={(e) => setQuoteFormData({...quoteFormData, urgency: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all bg-white"
                >
                  <option value="Low">Low - No rush</option>
                  <option value="Medium">Medium - Standard timeline</option>
                  <option value="High">High - Urgent requirement</option>
                </select>
              </div>

              {/* Expected Delivery Date */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <i className="fas fa-calendar-alt text-purple-500 mr-2"></i>
                  Expected Delivery Date (Optional)
                </label>
                <input
                  type="date"
                  value={quoteFormData.expectedDeliveryDate}
                  onChange={(e) => setQuoteFormData({...quoteFormData, expectedDeliveryDate: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              {/* Delivery Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <i className="fas fa-city text-teal-500 mr-2"></i>
                    City
                  </label>
                  <input
                    type="text"
                    value={quoteFormData.deliveryCity}
                    onChange={(e) => setQuoteFormData({...quoteFormData, deliveryCity: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="Delivery city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <i className="fas fa-globe text-teal-500 mr-2"></i>
                    Country
                  </label>
                  <input
                    type="text"
                    value={quoteFormData.deliveryCountry}
                    onChange={(e) => setQuoteFormData({...quoteFormData, deliveryCountry: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="Delivery country"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <i className="fas fa-sticky-note text-yellow-500 mr-2"></i>
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows="3"
                  value={quoteFormData.description}
                  onChange={(e) => setQuoteFormData({...quoteFormData, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none"
                  placeholder="Any specific requirements or notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingQuote}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingQuote ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Submit Quote
                    </>
                  )}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductDetail;
