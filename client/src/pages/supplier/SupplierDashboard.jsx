import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const SupplierDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    approvedProducts: 0,
    pendingProducts: 0,
    rejectedProducts: 0,
    totalOrders: 0,
    totalRevenue: 0  
  });
 
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // TODO: Implement supplier stats API call
      setStats({
        totalProducts: 0,
        approvedProducts: 0,
        pendingProducts: 0,
        rejectedProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName || 'Supplier'}!
        </h2>
        <p className="text-orange-100">
          Manage your products, track orders, and grow your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-box text-blue-600 text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalProducts}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-600">Total Products</h3>
          <p className="text-xs text-slate-500 mt-1">All your listed products</p>
        </div>

        {/* Approved Products */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-emerald-600 text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-emerald-600">{stats.approvedProducts}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-600">Approved Products</h3>
          <p className="text-xs text-slate-500 mt-1">Live on marketplace</p>
        </div>

        {/* Pending Products */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-clock text-amber-600 text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-amber-600">{stats.pendingProducts}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-600">Pending Review</h3>
          <p className="text-xs text-slate-500 mt-1">Awaiting admin approval</p>
        </div>

        {/* Rejected Products */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-times-circle text-red-600 text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-red-600">{stats.rejectedProducts}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-600">Rejected Products</h3>
          <p className="text-xs text-slate-500 mt-1">Need revision</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-shopping-cart text-purple-600 text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalOrders}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-600">Total Orders</h3>
          <p className="text-xs text-slate-500 mt-1">Orders received</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-dollar-sign text-green-600 text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-green-600">
              ${stats.totalRevenue.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-600">Total Revenue</h3>
          <p className="text-xs text-slate-500 mt-1">Estimated earnings</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-500 transition-colors">
              <i className="fas fa-plus text-orange-500 group-hover:text-white"></i>
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900 text-sm">Add Product</p>
              <p className="text-xs text-slate-500">List new product</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <i className="fas fa-list text-blue-500 group-hover:text-white"></i>
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900 text-sm">My Products</p>
              <p className="text-xs text-slate-500">View all products</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
              <i className="fas fa-shopping-bag text-purple-500 group-hover:text-white"></i>
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900 text-sm">View Orders</p>
              <p className="text-xs text-slate-500">Check orders</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <i className="fas fa-clock text-4xl text-slate-300 mb-3"></i>
          <p className="text-slate-500">No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
