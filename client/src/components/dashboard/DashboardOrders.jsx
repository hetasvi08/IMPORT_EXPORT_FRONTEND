import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Download,
  Loader2,
  Search,
  ChevronDown,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  X,
  TrendingUp,
  ShoppingCart,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import { apiconnector } from '../../services/apiconnector';
import { orderEndpoints, dashboardEndpoints } from '../../services/apis';
import { selectCurrency } from '../../store/slices/currencySlice';
import { currencySymbols } from '../../utils/currency';

// Helper function to get order item image
const getOrderItemImage = (orderItem) => {
  if (!orderItem) return null;
  
  // Check direct image field first
  if (orderItem.image && orderItem.image.trim() !== '') {
    return orderItem.image;
  }
  
  // Check populated product images
  if (orderItem.product?.images && orderItem.product.images.length > 0 && orderItem.product.images[0]?.url) {
    return orderItem.product.images[0].url;
  }
  
  return null;
};

const DashboardOrders = () => {
  const { token } = useSelector((state) => state.auth);
  const selectedCurrency = useSelector(selectCurrency);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [downloadingInvoice, setDownloadingInvoice] = useState(null);
  
  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Advanced stats
  const [advancedStats, setAdvancedStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    growthPercentage: 0,
    thisMonthOrders: 0,
    lastMonthOrders: 0
  });

  // Chart data
  const [orderTrendData, setOrderTrendData] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusConfig = {
    'Pending': { 
      icon: Clock, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800',
      gradient: 'from-yellow-400 to-yellow-500'
    },
    'Awaiting Payment': { 
      icon: DollarSign, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800',
      gradient: 'from-orange-400 to-orange-500'
    },
    'Processing': { 
      icon: RefreshCw, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      gradient: 'from-blue-400 to-blue-500'
    },
    'Confirmed': { 
      icon: CheckCircle, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      gradient: 'from-purple-400 to-purple-500'
    },
    'Shipped': { 
      icon: Truck, 
      color: 'text-cyan-600', 
      bg: 'bg-cyan-50', 
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-800',
      gradient: 'from-cyan-400 to-cyan-500'
    },
    'Delivered': { 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800',
      gradient: 'from-green-400 to-green-500'
    },
    'Cancelled': { 
      icon: XCircle, 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      gradient: 'from-red-400 to-red-500'
    },
    'Refunded': { 
      icon: RotateCcw, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800',
      gradient: 'from-orange-400 to-orange-500'
    }
  };

  const PAYMENT_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  useEffect(() => {
    fetchAdvancedStats();
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, token]);

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, searchQuery]);

  const fetchAdvancedStats = async () => {
    try {
      const response = await apiconnector(
        'GET',
        dashboardEndpoints.GET_ADVANCED_ORDER_STATS_API,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        setAdvancedStats(response.data.data);
      }
    } catch (error) {
}
  };

  const fetchChartData = async () => {
    setChartsLoading(true);
    try {
      const [trendsRes, paymentRes] = await Promise.all([
        apiconnector('GET', dashboardEndpoints.GET_ORDER_TRENDS_API, null, { Authorization: `Bearer ${token}` }),
        apiconnector('GET', dashboardEndpoints.GET_PAYMENT_STATUS_API, null, { Authorization: `Bearer ${token}` })
      ]);

      if (trendsRes.data.success) {
        setOrderTrendData(trendsRes.data.data);
      }
      if (paymentRes.data.success) {
        setPaymentStatusData(paymentRes.data.data);
      }
    } catch (error) {
} finally {
      setChartsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `${dashboardEndpoints.GET_ORDERS_API}?page=${currentPage}&limit=10`;
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }

      const response = await apiconnector('GET', url, null, { Authorization: `Bearer ${token}` });

      if (response.data.success) {
        setOrders(response.data.data || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = useCallback(() => {
    let filtered = [...orders];
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderItems?.some(item => 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    setFilteredOrders(filtered);
  }, [orders, searchQuery]);

  const handleCancelOrderClick = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (reason) => {
    if (!orderToCancel) return;
    
    setCancelling(true);
    try {
      const response = await apiconnector(
        'PUT',
        orderEndpoints.CANCEL_ORDER_API(orderToCancel),
        { reason },
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        
        fetchOrders();
        fetchAdvancedStats();
        setShowDetails(false);
        setShowCancelModal(false);
        setOrderToCancel(null);
      }
    } catch (error) {

    } finally {
      setCancelling(false);
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const handleDownloadInvoice = async (orderId) => {
    setDownloadingInvoice(orderId);
    try {
      const response = await fetch(dashboardEndpoints.GET_ORDER_INVOICE_API(orderId), {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to download invoice');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {

    } finally {
      setDownloadingInvoice(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    const symbol = currencySymbols[selectedCurrency] || '₹';
    
    // Convert from INR (base) to selected currency
    const converted = selectedCurrency === 'INR' ? num : num * (selectedCurrency === 'USD' ? 0.012 : selectedCurrency === 'EUR' ? 0.011 : selectedCurrency === 'AED' ? 0.044 : 1);
    
    if (selectedCurrency === 'INR') {
      // Indian format: K, L, Cr
      if (converted >= 10000000) return `${symbol}${(converted / 10000000).toFixed(2)}Cr`;
      if (converted >= 100000) return `${symbol}${(converted / 100000).toFixed(2)}L`;
      if (converted >= 1000) return `${symbol}${(converted / 1000).toFixed(2)}K`;
    } else {
      // International format: K, M, B
      if (converted >= 1000000000) return `${symbol}${(converted / 1000000000).toFixed(2)}B`;
      if (converted >= 1000000) return `${symbol}${(converted / 1000000).toFixed(2)}M`;
      if (converted >= 1000) return `${symbol}${(converted / 1000).toFixed(2)}K`;
    }
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2 sm:gap-3">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            My Orders
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Track and manage all your orders
          </p>
        </div>
      </div>

      {/* Stats Cards - Row 1 */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        <StatCard
          title="Total Orders"
          value={advancedStats.total}
          icon={ShoppingCart}
          badge={advancedStats.growthPercentage !== 0 ? `${advancedStats.growthPercentage > 0 ? '+' : ''}${advancedStats.growthPercentage}%` : null}
          badgeColor={advancedStats.growthPercentage >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
        />
        <StatCard
          title="Pending"
          value={advancedStats.pending}
          icon={Clock}
          badge="Action"
          badgeColor="bg-yellow-100 text-yellow-700"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Processing"
          value={advancedStats.processing}
          icon={RefreshCw}
          badge="Active"
          badgeColor="bg-blue-100 text-blue-700"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Shipped"
          value={advancedStats.shipped}
          icon={Truck}
          badge="Transit"
          badgeColor="bg-cyan-100 text-cyan-700"
          iconBg="bg-cyan-100"
          iconColor="text-cyan-600"
        />
        <StatCard
          title="Delivered"
          value={advancedStats.delivered}
          icon={CheckCircle}
          badge="Done"
          badgeColor="bg-green-100 text-green-700"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Cancelled"
          value={advancedStats.cancelled}
          icon={XCircle}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Stats Cards - Row 2 (Revenue) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <RevenueCard
          title="Total Spending"
          value={formatCurrency(advancedStats.totalRevenue)}
          subtitle="This Month"
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <RevenueCard
          title="Avg Order Value"
          value={formatCurrency(advancedStats.avgOrderValue)}
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <RevenueCard
          title="Orders This Month"
          value={advancedStats.thisMonthOrders || 0}
          icon={Package}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <RevenueCard
          title="Last Month"
          value={advancedStats.lastMonthOrders || 0}
          icon={Calendar}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Order Trends Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
            Order Trends (Last 6 Months)
          </h3>
          {chartsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : orderTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={orderTrendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="#94a3b8" width={30} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="#94a3b8" width={35} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0) + 'K' : v}`} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                  formatter={(value, name) => [
                    name === 'amount' ? formatCurrency(value) : value,
                    name === 'amount' ? 'Spending' : 'Orders'
                  ]}
                />
                <Area yAxisId="left" type="monotone" dataKey="orders" stroke="#14b8a6" strokeWidth={2} fill="url(#colorOrders)" />
                <Area yAxisId="right" type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No order data available
            </div>
          )}
        </div>

        {/* Payment Status Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
            Payment Status
          </h3>
          {chartsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : paymentStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No payment data available
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID or product..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-48 lg:w-64">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Processing">Processing</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : "You haven't placed any orders yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredOrders.map((order, index) => (
            <OrderCard
              key={order._id}
              order={order}
              index={index}
              statusConfig={statusConfig}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              onViewDetails={() => {
                setSelectedOrder(order);
                setShowDetails(true);
              }}
              onDownloadInvoice={handleDownloadInvoice}
              downloadingInvoice={downloadingInvoice}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <span className="px-3 py-2 text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          statusConfig={statusConfig}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          onClose={() => {
            setShowDetails(false);
            setSelectedOrder(null);
          }}
          onCancel={handleCancelOrderClick}
          onDownloadInvoice={handleDownloadInvoice}
          downloadingInvoice={downloadingInvoice}
        />
      )}

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <CancelOrderModal
          onConfirm={handleConfirmCancel}
          onClose={handleCloseCancelModal}
          cancelling={cancelling}
        />
      )}
    </div>
  );
};

// Stat Card Component (Admin-style)
const StatCard = ({ title, value, icon: Icon, badge, badgeColor, iconBg, iconColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-start justify-between mb-2 sm:mb-3">
      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${iconColor}`} />
      </div>
      {badge && (
        <span className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
    <p className="text-xl sm:text-3xl font-black text-gray-900 mt-0.5 sm:mt-1">{value}</p>
  </div>
);

// Order Item Image Component with proper error handling
const OrderItemImage = ({ item, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getOrderItemImage(item);
  const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  
  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt={item?.name || 'Product'}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-50">
      <Package className={`${sizeClasses} text-teal-600`} />
    </div>
  );
};

// Revenue Card Component
const RevenueCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-start justify-between mb-2 sm:mb-3">
      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${iconColor}`} />
      </div>
      {subtitle && (
        <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-teal-100 text-teal-700">
          {subtitle}
        </span>
      )}
    </div>
    <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
    <p className="text-lg sm:text-2xl font-black text-gray-900 mt-0.5 sm:mt-1">{value}</p>
  </div>
);

// Order Card Component
const OrderCard = ({ order, index, statusConfig, formatDate, formatCurrency, onViewDetails, onDownloadInvoice, downloadingInvoice }) => {
  const [imageError, setImageError] = useState(false);
  const config = statusConfig[order.orderStatus] || statusConfig['Pending'];
  const StatusIcon = config.icon;

  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 hover:shadow-xl transition-all duration-300 overflow-hidden group ${config.border}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-3 sm:p-5">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors truncate">
              {order.orderId}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0 ml-2">
            <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold ${config.badge} flex items-center gap-1 sm:gap-1.5`}>
              <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {order.orderStatus}
            </span>
            {order.paymentStatus && (
              <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                order.paymentStatus === 'Paid' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {order.paymentStatus}
              </span>
            )}
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
            {getOrderItemImage(order.orderItems?.[0]) && !imageError ? (
              <img
                src={getOrderItemImage(order.orderItems?.[0])}
                alt={order.orderItems?.[0]?.name || 'Product'}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-50">
                <Package className="w-6 h-6 text-teal-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-xs sm:text-base">
              {order.orderItems?.[0]?.name || 'Product'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {order.orderItems?.length || 0} item(s) • Qty: {order.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-gray-900 text-sm sm:text-base">
              {formatCurrency((parseFloat(order.pricing?.itemsPrice) || 0) + (parseFloat(order.pricing?.shippingPrice) || 0) + (parseFloat(order.pricing?.taxPrice) || 0))}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-teal-200 hover:shadow-xl hover:-translate-y-0.5 transform"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            View Details
          </button>
          
          <button
            onClick={() => onDownloadInvoice(order._id)}
            disabled={downloadingInvoice === order._id}
            className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 sm:gap-2 disabled:opacity-50"
          >
            {downloadingInvoice === order._id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, statusConfig, formatDate, formatCurrency, onClose, onCancel, onDownloadInvoice, downloadingInvoice }) => {
  const config = statusConfig[order.orderStatus] || statusConfig['Pending'];
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-2xl w-full sm:my-8 animate-scaleIn flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 sm:p-5 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${config.bg} flex items-center justify-center`}>
                <Truck className={`w-5 h-5 sm:w-6 sm:h-6 ${config.color}`} />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">{order.orderId}</h2>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Status Badges */}
          <div className="flex items-center gap-3 mt-4">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${config.badge} flex items-center gap-1.5`}>
              <StatusIcon className="w-4 h-4" />
              {order.orderStatus}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              order.paymentStatus === 'Paid' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-teal-600" />
              Order Items ({order.orderItems?.length || 0})
            </h3>
            <div className="space-y-2">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    <OrderItemImage item={item} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(item.unitPrice || (item.price / item.quantity))}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-600" />
              Pricing
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.pricing?.itemsPrice || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatCurrency(order.pricing?.shippingPrice || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(order.pricing?.taxPrice || 0)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-base font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-teal-600">{formatCurrency((parseFloat(order.pricing?.itemsPrice) || 0) + (parseFloat(order.pricing?.shippingPrice) || 0) + (parseFloat(order.pricing?.taxPrice) || 0))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                Shipping Address
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                {order.shippingAddress.company && (
                  <p className="text-gray-600 text-sm">{order.shippingAddress.company}</p>
                )}
                <p className="text-gray-600 text-sm mt-1">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600 text-sm">{order.shippingAddress.country}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-3 pt-3 border-t border-gray-200">
                  {order.shippingAddress.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {order.shippingAddress.phone}
                    </span>
                  )}
                  {order.shippingAddress.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {order.shippingAddress.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 flex flex-wrap gap-2 flex-shrink-0 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => onDownloadInvoice(order._id)}
            disabled={downloadingInvoice === order._id}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {downloadingInvoice === order._id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Invoice
          </button>
          
          {/* Cancel allowed if: not Delivered/Shipped/Cancelled/Refunded AND within 3 days of order */}
          {!['Delivered', 'Shipped', 'Cancelled', 'Refunded'].includes(order.orderStatus) && 
           ((new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24)) <= 3 && (
            <button
              onClick={() => {
                onCancel(order._id);
                onClose();
              }}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel Order
            </button>
          )}
          
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Cancel Order Confirmation Modal Component
const CancelOrderModal = ({ onConfirm, onClose, cancelling }) => {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  
  const presetReasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Order placed by mistake',
    'Delivery time too long',
    'Product no longer needed',
    'Other'
  ];

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Other' ? reason : selectedReason;
    onConfirm(finalReason || 'No reason provided');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order</h3>
          <p className="text-gray-600">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>
        </div>

        {/* Reason Selection */}
        <div className="px-6 pb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Cancellation <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {presetReasons.map((presetReason) => (
              <label
                key={presetReason}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedReason === presetReason
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={presetReason}
                  checked={selectedReason === presetReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="ml-3 text-sm text-gray-700">{presetReason}</span>
              </label>
            ))}
          </div>
          
          {selectedReason === 'Other' && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please specify your reason..."
              rows={3}
              className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
            />
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={cancelling}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
          >
            No, Keep Order
          </button>
          <button
            onClick={handleConfirm}
            disabled={cancelling || !selectedReason || (selectedReason === 'Other' && !reason.trim())}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {cancelling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Yes, Cancel Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrders;
