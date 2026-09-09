import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SupplierProducts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 12
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, [filters, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // TODO: Implement supplier products API call
      setProducts([]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(p => p.isApproved === activeTab);
    }
    
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const tabs = [
    { id: 'all', label: 'All Products', icon: 'fas fa-box', count: products.length },
    { id: 'approved', label: 'Approved', icon: 'fas fa-check-circle', count: products.filter(p => p.isApproved === 'approved').length },
    { id: 'pending', label: 'Pending', icon: 'fas fa-clock', count: products.filter(p => p.isApproved === 'pending').length },
    { id: 'rejected', label: 'Rejected', icon: 'fas fa-times-circle', count: products.filter(p => p.isApproved === 'rejected').length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i>
          <p className="text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">My Products</h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Manage your product listings</p>
        </div>
        <button
          onClick={() => navigate('/supplier/products/create')}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <i className="fas fa-plus"></i>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className={`${tab.icon} text-xs sm:text-sm`}></i>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-box-open text-3xl text-slate-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Products Found</h3>
              <p className="text-slate-600 mb-6">
                {activeTab === 'all' 
                  ? 'Start by adding your first product to the marketplace.'
                  : `You don't have any ${activeTab} products yet.`
                }
              </p>
              {activeTab === 'all' && (
                <button
                  onClick={() => navigate('/supplier/products/create')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-all group bg-white"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {product.images?.[0]?.url ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <i className="fas fa-box text-5xl text-slate-300"></i>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        product.isApproved === 'approved' ? 'bg-emerald-500 text-white' :
                        product.isApproved === 'rejected' ? 'bg-red-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        <i className={`fas fa-${
                          product.isApproved === 'approved' ? 'check' :
                          product.isApproved === 'rejected' ? 'times' : 'clock'
                        }`}></i>
                        {product.isApproved === 'approved' ? 'Approved' :
                         product.isApproved === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-sm">
                      {product.name}
                    </h4>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-slate-500">Price Range</p>
                        <p className="text-base font-bold text-slate-900">
                          ${product.price?.min} - ${product.price?.max}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Stock</p>
                        <p className="text-base font-bold text-slate-900">{product.stock || 0}</p>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {product.isApproved === 'rejected' && product.rejectionReason && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</p>
                        <p className="text-xs text-red-700">{product.rejectionReason}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                        title="View Product"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        onClick={() => navigate(`/supplier/products/edit/${product._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors"
                        title="Edit Product"
                        disabled={product.isApproved === 'approved'}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
                        title="Delete Product"
                        disabled={product.isApproved === 'approved'}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierProducts;
