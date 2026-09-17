import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Grid,
  Layers,
  List,
  Loader2,
  Mail,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  X
} from 'lucide-react';
import {
  downloadCatalog,
  getAllCatalogs,
  getCategoriesWithCatalogCounts,
  getFeaturedCatalogs,
  trackCatalogView
} from '../../services/operations/catalogAPI';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

// eslint-disable-next-line no-unused-vars
const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

// eslint-disable-next-line no-unused-vars
const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
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
  { _id: 'c1', name: 'Electronics', description: 'Latest electronics catalogs', catalogCount: 15, totalDownloads: 1200, icon: 'fas fa-laptop' },
  { _id: 'c2', name: 'Fashion', description: 'Trendy clothing and accessories catalogs', catalogCount: 8, totalDownloads: 850, icon: 'fas fa-tshirt' },
  { _id: 'c3', name: 'Home & Garden', description: 'Furniture and decor catalogs', catalogCount: 12, totalDownloads: 640, icon: 'fas fa-couch' },
];

const dummyCatalogs = [
  {
    _id: 'cat1',
    title: 'Summer 2026 Electronics Collection',
    description: 'Explore the latest gadgets and electronic devices for this summer.',
    category: { _id: 'c1', name: 'Electronics' },
    coverImage: null,
    isFeatured: true,
    downloads: 450,
    views: 1200,
    tags: ['electronics', 'summer', 'new']
  },
  {
    _id: 'cat2',
    title: 'Spring Fashion Trends',
    description: 'Discover the hottest fashion trends for the upcoming spring season.',
    category: { _id: 'c2', name: 'Fashion' },
    coverImage: null,
    isFeatured: false,
    downloads: 320,
    views: 800,
    tags: ['fashion', 'spring', 'apparel']
  },
  {
    _id: 'cat3',
    title: 'Modern Home Decor',
    description: 'Revamp your living space with our modern home decor catalog.',
    category: { _id: 'c3', name: 'Home & Garden' },
    coverImage: null,
    isFeatured: true,
    downloads: 210,
    views: 500,
    tags: ['home', 'decor', 'modern']
  },
  {
    _id: 'cat4',
    title: 'Smart Home Devices',
    description: 'Upgrade your home with the latest smart home technology.',
    category: { _id: 'c1', name: 'Electronics' },
    coverImage: null,
    isFeatured: false,
    downloads: 150,
    views: 400,
    tags: ['smart home', 'tech']
  }
];

const dummyFeaturedCatalogs = dummyCatalogs.filter(c => c.isFeatured);

const CatalogsPage = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [featuredCatalogs, setFeaturedCatalogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [downloadModal, setDownloadModal] = useState({ isOpen: false, catalog: null });
  const [downloadForm, setDownloadForm] = useState({ name: '', email: '' });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchFeaturedCatalogs();
  }, []);

  useEffect(() => {
    fetchCatalogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery, pagination.page]);

  const displayCatalogs = catalogs.length > 0 ? catalogs : dummyCatalogs.filter(cat => {
    let match = true;
    if (selectedCategory) match = match && cat.category._id === selectedCategory;
    if (searchQuery) match = match && cat.title.toLowerCase().includes(searchQuery.toLowerCase());
    return match;
  });

  const displayFeatured = featuredCatalogs.length > 0 ? featuredCatalogs : dummyFeaturedCatalogs;
  const displayCategories = categories.length > 0 ? categories : dummyCategories;
  const displayPagination = catalogs.length > 0 ? pagination : {
    total: dummyCatalogs.length,
    page: 1,
    pages: 1
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesWithCatalogCounts();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.debug('Failed to fetch categories, falling back to defaults:', error);
    }
  };

  const fetchFeaturedCatalogs = async () => {
    try {
      const response = await getFeaturedCatalogs(4);
      if (response.success) {
        setFeaturedCatalogs(response.data);
      }
    } catch (error) {
      console.debug('Failed to fetch featured catalogs, falling back to defaults:', error);
    }
  };

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 12
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await getAllCatalogs(params);
      if (response.success) {
        setCatalogs(response.data);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total
        });
      }
    } catch (error) {
      console.debug('Failed to fetch catalogs, falling back to defaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (catalog) => {
    setDownloadModal({ isOpen: true, catalog });
  };

  const processDownload = async () => {
    const { catalog } = downloadModal;

    try {
      setDownloading(true);
      const response = await downloadCatalog(catalog._id, downloadForm);

      if (response.success) {
        // Fetch the PDF and trigger download
        const pdfResponse = await fetch(response.data.downloadUrl);
        const blob = await pdfResponse.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = response.data.fileName || `${catalog.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Failed to process catalog download:', error);
    } finally {
      setDownloading(false);
      setDownloadModal({ isOpen: false, catalog: null });
      setDownloadForm({ name: '', email: '' });
    }
  };

  const directDownload = async (catalog) => {
    try {
      setDownloading(true);
      const response = await downloadCatalog(catalog._id, {});

      if (response.success) {
        // Fetch the PDF and trigger download
        const pdfResponse = await fetch(response.data.downloadUrl);
        const blob = await pdfResponse.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = response.data.fileName || `${catalog.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Failed to initiate direct catalog download:', error);
    } finally {
      setDownloading(false);
      setDownloadModal({ isOpen: false, catalog: null });
      setDownloadForm({ name: '', email: '' });
    }
  };

  // Track catalog view when user interacts with it
  const handleViewTracking = (catalogId) => {
    trackCatalogView(catalogId);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 pt-24 sm:pt-28 lg:pt-20 pb-8 sm:pb-12 relative overflow-hidden shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection variants={scaleIn} className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-xs uppercase tracking-wide">Product Catalogs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
              Download Our <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Product Catalogs</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Browse and download comprehensive product catalogs from our verified suppliers
            </p>
          </AnimatedSection>

          {/* Search Bar */}
          <AnimatedSection variants={fadeInUp} delay={0.2} className="mt-5 sm:mt-6 max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search catalogs by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full text-slate-900 bg-white shadow-xl border-2 border-transparent focus:border-emerald-500 focus:outline-none pl-14 text-sm"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-white via-emerald-50/50 to-white py-6 sm:py-8 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div className="text-center group" variants={fadeInUp}>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100 h-full flex flex-col justify-center">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{displayPagination.total}+</div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Catalogs Available</p>
              </div>
            </motion.div>
            <motion.div className="text-center group" variants={fadeInUp}>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-cyan-200 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-100 h-full flex flex-col justify-center">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{displayCategories.length}</div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Categories</p>
              </div>
            </motion.div>
            <motion.div className="text-center group" variants={fadeInUp}>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100 h-full flex flex-col justify-center">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">PDF</div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Download Format</p>
              </div>
            </motion.div>
            <motion.div className="text-center group" variants={fadeInUp}>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-lg hover:shadow-amber-100 h-full flex flex-col justify-center">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Free</div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">All Downloads</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Featured Catalogs */}
      {displayFeatured.length > 0 && (
        <div className="py-8 sm:py-12 bg-gradient-to-b from-white to-amber-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection variants={fadeInUp} className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Featured Catalogs</h2>
                  <p className="text-sm text-slate-600">Most popular downloads this month</p>
                </div>
              </div>
            </AnimatedSection>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {displayFeatured.map((catalog) => (
                <motion.div
                  key={catalog._id}
                  variants={fadeInUp}
                  className="group relative bg-white rounded-2xl overflow-hidden border-2 border-amber-200 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-100 transition-all duration-500"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Star size={10} /> Featured
                    </span>
                  </div>

                  <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
                    {catalog.coverImage?.url ? (
                      <img
                        src={catalog.coverImage.url}
                        alt={catalog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <BookOpen className="text-amber-300" size={64} />
                    )}
                  </div>

                  <div className="p-5">
                    <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded mb-2 border border-amber-200">
                      {catalog.category?.name || 'General'}
                    </span>
                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">{catalog.title}</h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{catalog.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Download size={12} /> {catalog.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {catalog.views}
                        </span>
                      </div>
                      <button
                        onClick={() => directDownload(catalog)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-1 shadow-lg shadow-amber-200"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>

                    {/* View Products Link */}
                    <Link
                      to={catalog.category?._id ? `/products?category=${catalog.category._id}` : '/products'}
                      onClick={() => handleViewTracking(catalog._id)}
                      className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors py-2 border-t border-amber-100"
                    >
                      <ShoppingBag size={14} /> View Related Products <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          {/* Categories Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sticky top-8 shadow-lg">
              {/* Showing count at top of sidebar */}
              <div className="mb-6 pb-4 border-b border-slate-200">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-bold text-emerald-600">{displayCatalogs.length}</span> of{' '}
                  <span className="font-bold text-emerald-600">{displayPagination.total}</span> catalogs
                </p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <FolderOpen className="text-white" size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Categories</h3>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryClick('')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    selectedCategory === ''
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers size={16} />
                    <span className="font-semibold text-sm">All Catalogs</span>
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    selectedCategory === '' ? 'bg-white/30' : 'bg-slate-200'
                  }`}>
                    {displayPagination.total}
                  </span>
                </button>

                {displayCategories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                      selectedCategory === category._id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {category.icon ? (
                        <i className={`${category.icon} text-sm`}></i>
                      ) : (
                        <FileText size={16} />
                      )}
                      <span className="font-semibold text-sm truncate">{category.name}</span>
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      selectedCategory === category._id ? 'bg-white/30' : 'bg-slate-200'
                    }`}>
                      {category.catalogCount || 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* Category Info */}
              {selectedCategory && displayCategories.find(c => c._id === selectedCategory) && (
                <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <h4 className="font-bold text-emerald-700 mb-2">
                    {displayCategories.find(c => c._id === selectedCategory)?.name}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {displayCategories.find(c => c._id === selectedCategory)?.description || 'Browse catalogs in this category'}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
                    <TrendingUp size={12} />
                    <span>{displayCategories.find(c => c._id === selectedCategory)?.totalDownloads || 0} total downloads</span>
                  </div>
                </div>
              )}

              {/* Browse Products Link */}
              <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-indigo-600" size={18} />
                  <h4 className="font-bold text-slate-900">Browse Products</h4>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Looking for specific products? Check out our full product catalog.
                </p>
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-200"
                >
                  <ShoppingBag size={16} /> View All Products <ArrowRight size={16} />
                </Link>
              </div>

              {/* View Mode Toggle - Hidden on mobile */}
              <div className="hidden md:block mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">View Mode</span>
                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Catalogs Grid */}
          <div className="w-full lg:w-3/4">
            {loading && displayCatalogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading catalogs...</p>
              </div>
            ) : displayCatalogs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-slate-200 shadow-lg">
                <FileText className="mx-auto text-slate-300 mb-4" size={64} />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Catalogs Found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                {/* Catalogs Grid */}
                <div
                  className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6 justify-items-center`}
                >
                  {displayCatalogs.map((catalog) => (
                    <div
                      key={catalog._id}
                      className={`group bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 w-full max-w-sm mx-auto ${
                        viewMode === 'list' ? 'flex max-w-full' : ''
                      }`}
                    >
                      {/* Catalog Cover */}
                      <div className={`relative bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden ${
                        viewMode === 'list' ? 'w-48 h-full' : 'h-48'
                      }`}>
                        {catalog.coverImage?.url ? (
                          <img
                            src={catalog.coverImage.url}
                            alt={catalog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <BookOpen className="text-slate-400" size={64} />
                        )}

                        {catalog.isFeatured && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                              <Star size={10} /> Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Catalog Info */}
                      <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded mb-2 border border-emerald-200">
                          {catalog.category?.name || 'General'}
                        </span>

                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {catalog.title}
                        </h3>

                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                          {catalog.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Download size={12} /> {catalog.downloads} downloads
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {catalog.views} views
                          </span>
                        </div>

                        {/* Tags */}
                        {catalog.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {catalog.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded border border-slate-200">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(catalog)}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                          >
                            <Download size={16} /> Download PDF
                          </button>
                        </div>

                        {/* View Products Link */}
                        <Link
                          to={catalog.category?._id ? `/products?category=${catalog.category._id}` : '/products'}
                          onClick={() => handleViewTracking(catalog._id)}
                          className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors py-2 border-t border-slate-200"
                        >
                          <ShoppingBag size={14} /> View Related Products <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {displayPagination.pages > 1 && (
                  <AnimatedSection variants={fadeInUp} className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPagination({ ...pagination, page: Math.max(1, displayPagination.page - 1) })}
                      disabled={displayPagination.page === 1}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>

                    {[...Array(displayPagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPagination({ ...pagination, page: i + 1 })}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          displayPagination.page === i + 1
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200'
                            : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPagination({ ...pagination, page: Math.min(displayPagination.pages, displayPagination.page + 1) })}
                      disabled={displayPagination.page === displayPagination.pages}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </AnimatedSection>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {downloadModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-slate-200"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Download className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Download Catalog</h3>
                    <p className="text-emerald-100 text-sm">Get the PDF file</p>
                  </div>
                </div>
                <button
                  onClick={() => setDownloadModal({ isOpen: false, catalog: null })}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">{downloadModal.catalog?.title}</h4>
                <p className="text-sm text-slate-600">{downloadModal.catalog?.category?.name}</p>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                Click download to save the PDF. Optionally, enter email to also receive the download link.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Name (Optional)</label>
                  <input
                    type="text"
                    value={downloadForm.name}
                    onChange={(e) => setDownloadForm({ ...downloadForm, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none text-slate-900 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email (Optional - to receive link)</label>
                  <input
                    type="email"
                    value={downloadForm.email}
                    onChange={(e) => setDownloadForm({ ...downloadForm, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    directDownload(downloadModal.catalog);
                  }}
                  disabled={downloading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                  {downloading ? (
                    <><Loader2 size={16} className="animate-spin" /> Downloading...</>
                  ) : (
                    <><Download size={16} /> Download Now</>
                  )}
                </button>
                <button
                  onClick={processDownload}
                  disabled={!downloadForm.email || downloading}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-slate-300"
                >
                  <Mail size={16} /> Email Link
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CatalogsPage;
