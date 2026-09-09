import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Truck, 
  FileText, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  DollarSign,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { apiconnector } from '../../services/apiconnector';
import { dashboardEndpoints } from '../../services/apis';
import {
  ComposedChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList
} from 'recharts';

const DashboardOverview = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalQuotes: 0,
    activeShipments: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [spendingTrendData, setSpendingTrendData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Chart colors
  const CHART_COLORS = ['#14b8a6', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

  // Fetch dashboard data from backend
  useEffect(() => {
    fetchDashboardData();
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchDashboardData = async () => {
setLoading(true);
    
    try {
      const response = await apiconnector(
        'GET',
        dashboardEndpoints.GET_OVERVIEW_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentOrders(response.data.data.recentOrders || []);
}
    } catch (error) {
      // Set mock data on error for demo
      setStats({
        totalOrders: 42,
        pendingOrders: 5,
        completedOrders: 35,
        totalQuotes: 12,
        activeShipments: 8,
        totalSpent: 45680
      });
    } finally {
      setLoading(false);
}
  };

  const fetchChartData = async () => {
    setChartsLoading(true);
    try {
      // Fetch spending trend
      const spendingResponse = await apiconnector(
        'GET',
        `${dashboardEndpoints.GET_SPENDING_TREND_API}?days=7`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      
      if (spendingResponse.data.success) {
        setSpendingTrendData(spendingResponse.data.data.chartData);
      }

      // Fetch orders by status
      const statusResponse = await apiconnector(
        'GET',
        dashboardEndpoints.GET_ORDERS_BY_STATUS_API,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (statusResponse.data.success) {
        setOrderStatusData(statusResponse.data.data.chartData);
      }
    } catch (error) {
// Set mock chart data on error
      setSpendingTrendData([
        { date: 'Mon', amount: 1200, orders: 3 },
        { date: 'Tue', amount: 2100, orders: 5 },
        { date: 'Wed', amount: 800, orders: 2 },
        { date: 'Thu', amount: 1600, orders: 4 },
        { date: 'Fri', amount: 2400, orders: 6 },
        { date: 'Sat', amount: 1800, orders: 4 },
        { date: 'Sun', amount: 3000, orders: 7 }
      ]);
      setOrderStatusData([
        { name: 'Completed', value: 35, color: '#14b8a6' },
        { name: 'Pending', value: 12, color: '#f59e0b' },
        { name: 'Processing', value: 8, color: '#3b82f6' },
        { name: 'Cancelled', value: 3, color: '#ef4444' }
      ]);
    } finally {
      setChartsLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      change: '+12.5%',
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Shipments',
      value: stats.activeShipments,
      change: '+8.3%',
      icon: Truck,
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-100',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      change: '-5.2%',
      icon: Clock,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Quote Requests',
      value: stats.totalQuotes,
      change: '+15.7%',
      icon: FileText,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  // Mock data fallback for recent orders display
  const displayOrders = recentOrders.length > 0 ? recentOrders : [
    { id: 'ORD-2025-001', orderNumber: 'ORD-2025-001', product: 'Industrial Machinery Parts', status: 'in_transit', amount: 12450, date: new Date('2026-01-20') },
    { id: 'ORD-2025-002', orderNumber: 'ORD-2025-002', product: 'Electronic Components', status: 'pending', amount: 8900, date: new Date('2026-01-18') },
    { id: 'ORD-2025-003', orderNumber: 'ORD-2025-003', product: 'Textile Materials', status: 'completed', amount: 5600, date: new Date('2026-01-15') },
  ];

  const quickActions = [
    { label: 'Request Quote', icon: FileText, to: '/dashboard/quotes', color: 'from-teal-500 to-cyan-600' },
    { label: 'Browse Products', icon: Package, to: '/dashboard/products', color: 'from-blue-500 to-blue-600' },
    { label: 'Track Shipment', icon: Truck, to: '/dashboard/shipments', color: 'from-purple-500 to-purple-600' },
    { label: 'View Orders', icon: ShoppingCart, to: '/dashboard/orders', color: 'from-orange-500 to-orange-600' },
  ];

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase().replace(/_/g, ' ');
    switch (statusLower) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in transit':
      case 'shipped':
      case 'shipping':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
      case 'pending':
      case 'awaiting payment':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatStatus = (status) => {
    return status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format money with K, M, B suffixes
  const formatMoney = (amount) => {
    if (amount === null || amount === undefined) return '$0';
    const num = Number(amount);
    if (isNaN(num)) return '$0';
    
    if (num >= 1000000000) {
      return '$' + (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return '$' + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return '$' + num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-transparent border-t-teal-500 border-r-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-500 border-l-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeInUp_0.6s_ease-out]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1 sm:mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Here's what's happening with your account today.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/dashboard/quotes"
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-teal-500 hover:text-teal-600 transition-all hover:shadow-md text-sm sm:text-base"
          >
            Request Quote
          </Link>
          <Link
            to="/dashboard/products"
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Browse Products
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`bg-gradient-to-br ${stat.bgGradient} border-2 border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-lg`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-4">
                <div className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md border-2 border-white`}>
                  <Icon className={`${stat.iconColor} w-4 h-4 sm:w-6 sm:h-6`} />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm border ${
                  stat.change.startsWith('+') 
                    ? 'bg-green-100 text-green-700 border-green-300' 
                    : 'bg-red-100 text-red-700 border-red-300'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1">{stat.title}</h3>
              <p className="text-xl sm:text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-3 sm:p-6 shadow-xl">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className={`bg-gradient-to-br ${action.color} p-3 sm:p-6 rounded-xl text-white hover:shadow-2xl transition-all hover:-translate-y-2 group border-2 border-white/20 shadow-lg`}
                style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
              >
                <Icon size={22} className="mb-2 sm:mb-3 group-hover:scale-110 transition-transform drop-shadow-lg sm:w-7 sm:h-7" />
                <p className="font-bold text-xs sm:text-sm">{action.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Spending Trend Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
          <div className="p-3 sm:p-6 border-b-2 border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="text-white" size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-gray-900">Spending Trend</h2>
                <p className="text-xs sm:text-sm text-gray-500">Last 6 months</p>
              </div>
            </div>
          </div>
          <div className="p-2 sm:p-6">
            {chartsLoading ? (
              <div className="h-64 sm:h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <ComposedChart data={spendingTrendData} margin={{ top: 10, right: 5, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="colorBars" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#14b8a6" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={35}
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
                        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                        return `$${value}`;
                      }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#8b5cf6" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={25}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        padding: '12px'
                      }}
                      formatter={(value, name) => {
                        if (name === 'amount') {
                          if (value >= 1000000) return [`$${(value / 1000000).toFixed(2)}M`, '💰 Spending'];
                          if (value >= 1000) return [`$${(value / 1000).toFixed(1)}K`, '💰 Spending'];
                          return [`$${value}`, '💰 Spending'];
                        }
                        return [value, '📦 Orders'];
                      }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      formatter={(value) => (
                        <span className="text-sm font-medium text-gray-700">
                          {value === 'amount' ? '💰 Spending' : '📦 Orders'}
                        </span>
                      )}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="orders"
                      fill="url(#colorBars)"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      animationDuration={1500}
                    >
                      <LabelList 
                        dataKey="orders" 
                        position="top" 
                        fill="#8b5cf6" 
                        fontSize={11} 
                        fontWeight="bold"
                        formatter={(value) => value > 0 ? value : ''}
                      />
                    </Bar>
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="amount"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorSpending)"
                      animationDuration={1500}
                      animationEasing="ease-out"
                      dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Orders by Status Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
          <div className="p-3 sm:p-6 border-b-2 border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <PieChartIcon className="text-white" size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-gray-900">Orders by Status</h2>
                <p className="text-xs sm:text-sm text-gray-500">Distribution overview</p>
              </div>
            </div>
          </div>
          <div className="p-2 sm:p-6">
            {chartsLoading ? (
              <div className="h-64 sm:h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : orderStatusData.length === 0 ? (
              <div className="h-64 sm:h-80 flex flex-col items-center justify-center text-gray-400">
                <PieChartIcon size={48} className="mb-3 opacity-50" />
                <p className="font-semibold">No order data available</p>
                <p className="text-sm">Start placing orders to see statistics</p>
              </div>
            ) : (
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart margin={{ left: 10, right: 10 }}>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="42%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={1500}
                      animationEasing="ease-out"
                      label={({ name, percent }) => {
                        const shortName = name === 'Awaiting Payment' ? 'Awaiting' : name;
                        return `${shortName}: ${(percent * 100).toFixed(0)}%`;
                      }}
                      labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        padding: '12px'
                      }}
                      formatter={(value, name) => {
                        const total = orderStatusData.reduce((sum, d) => sum + d.value, 0);
                        const percent = ((value / total) * 100).toFixed(1);
                        return [`${value} orders (${percent}%)`, name];
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={40}
                      formatter={(value, entry) => (
                        <span className="text-gray-700 font-medium text-xs sm:text-sm">
                          {value} ({entry.payload.value})
                        </span>
                      )}
                      wrapperStyle={{ paddingTop: '5px', fontSize: '11px' }}
                    />
                    {/* Center label showing total */}
                    <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle">
                      <tspan x="50%" dy="-0.5em" fontSize="22" fontWeight="bold" fill="#1f2937">
                        {orderStatusData.reduce((sum, d) => sum + d.value, 0)}
                      </tspan>
                      <tspan x="50%" dy="1.4em" fontSize="11" fill="#6b7280">
                        Total Orders
                      </tspan>
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-xl">
          <div className="p-3 sm:p-6 border-b-2 border-gray-200 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-teal-600 hover:text-teal-700 font-semibold text-xs sm:text-sm flex items-center gap-1 group">
              View All
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="p-3 sm:p-6">
            {displayOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-semibold">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">Start browsing products to place your first order</p>
                <Link
                  to="/dashboard/products"
                  className="inline-block mt-4 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {displayOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-teal-400 group shadow-md"
                    style={{ animationDelay: `${index * 0.1 + 0.6}s` }}
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border-2 border-teal-400 flex-shrink-0">
                          <ShoppingCart className="text-white" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{order.orderNumber || order.id}</p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{order.product || 'Product details'}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{formatDate(order.date)}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">{formatMoney(order.amount)}</p>
                        <span className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border-2 shadow-sm ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Stats */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-3 sm:p-6 shadow-xl">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-300 shadow-sm">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-xl font-black text-gray-900">{stats.completedOrders}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center border-2 border-orange-300 shadow-sm">
                    <Clock className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-black text-gray-900">{stats.pendingOrders}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-300 shadow-sm">
                    <Truck className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">In Transit</p>
                    <p className="text-xl font-black text-gray-900">{stats.activeShipments}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-2xl border-2 border-teal-400 hover:shadow-3xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-white/80 font-semibold">Total Spent</p>
                <p className="text-2xl sm:text-3xl font-black">{formatMoney(stats.totalSpent)}</p>
              </div>
            </div>
            <p className="text-xs text-white/80">Lifetime purchases</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
