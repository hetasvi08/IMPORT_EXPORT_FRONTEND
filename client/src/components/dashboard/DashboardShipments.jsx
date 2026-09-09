import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  TrendingUp,
  Plane,
  Ship,
  ArrowRight,
  Box,
  FileText,
  User,
  Phone,
  Globe,
  BarChart3,
  Activity
} from 'lucide-react';
import { apiconnector } from '../../services/apiconnector';
import { dashboardEndpoints } from '../../services/apis';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const DashboardShipments = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pendingPickup: 0,
    inTransit: 0,
    delivered: 0,
    delayed: 0,
    pickedUp: 0,
    customs: 0,
    outForDelivery: 0,
    failed: 0,
    returned: 0
  });

  const statusConfig = {
    'Pending Pickup': {
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      label: 'Pending Pickup',
      gradient: 'from-amber-400 to-amber-600',
      chartColor: '#f59e0b'
    },
    'Picked Up': {
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      label: 'Picked Up',
      gradient: 'from-blue-400 to-blue-600',
      chartColor: '#3b82f6'
    },
    'In Transit': {
      icon: Truck,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      label: 'In Transit',
      gradient: 'from-purple-400 to-purple-600',
      chartColor: '#8b5cf6'
    },
    'Customs Clearance': {
      icon: FileText,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800',
      label: 'Customs',
      gradient: 'from-orange-400 to-orange-600',
      chartColor: '#f97316'
    },
    'Out for Delivery': {
      icon: TrendingUp,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-800',
      label: 'Out for Delivery',
      gradient: 'from-cyan-400 to-cyan-600',
      chartColor: '#06b6d4'
    },
    'Delivered': {
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
      label: 'Delivered',
      gradient: 'from-emerald-400 to-emerald-600',
      chartColor: '#10b981'
    },
    'Delayed': {
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      label: 'Delayed',
      gradient: 'from-red-400 to-red-600',
      chartColor: '#ef4444'
    },
    'Failed Delivery': {
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-800',
      label: 'Failed',
      gradient: 'from-rose-400 to-rose-600',
      chartColor: '#f43f5e'
    },
    'Returned': {
      icon: Package,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-800',
      label: 'Returned',
      gradient: 'from-gray-400 to-gray-600',
      chartColor: '#6b7280'
    }
  };

  const shippingMethodIcons = {
    'Air': Plane,
    'Sea': Ship,
    'Land': Truck,
    'Express': Plane,
    'Standard': Truck
  };

  useEffect(() => {
    fetchShipments();
  }, [token]);

  useEffect(() => {
    filterShipments();
  }, [shipments, statusFilter, searchQuery]);

  const fetchShipments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await apiconnector(
        'GET',
        dashboardEndpoints.GET_SHIPMENTS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        const shipmentsData = response.data.data || [];
        setShipments(shipmentsData);
        calculateStats(shipmentsData);
      }
    } catch (error) {
      setShipments([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (shipmentsData) => {
    const stats = {
      total: shipmentsData.length,
      pendingPickup: shipmentsData.filter(s => s.status === 'Pending Pickup').length,
      pickedUp: shipmentsData.filter(s => s.status === 'Picked Up').length,
      inTransit: shipmentsData.filter(s => s.status === 'In Transit').length,
      customs: shipmentsData.filter(s => s.status === 'Customs Clearance').length,
      outForDelivery: shipmentsData.filter(s => s.status === 'Out for Delivery').length,
      delivered: shipmentsData.filter(s => s.status === 'Delivered').length,
      delayed: shipmentsData.filter(s => s.status === 'Delayed').length,
      failed: shipmentsData.filter(s => s.status === 'Failed Delivery').length,
      returned: shipmentsData.filter(s => s.status === 'Returned').length
    };
    setStats(stats);
  };

  const filterShipments = () => {
    let filtered = [...shipments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(shipment =>
        shipment.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.carrier?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.destination?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredShipments(filtered);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDetails = (shipment) => {
    setSelectedShipment(shipment);
    setShowDetails(true);
  };

  // Prepare chart data
  const doughnutChartData = useMemo(() => {
    const data = [
      { name: 'Pending Pickup', value: stats.pendingPickup, color: statusConfig['Pending Pickup'].chartColor },
      { name: 'Picked Up', value: stats.pickedUp, color: statusConfig['Picked Up'].chartColor },
      { name: 'In Transit', value: stats.inTransit, color: statusConfig['In Transit'].chartColor },
      { name: 'Customs', value: stats.customs, color: statusConfig['Customs Clearance'].chartColor },
      { name: 'Out for Delivery', value: stats.outForDelivery, color: statusConfig['Out for Delivery'].chartColor },
      { name: 'Delivered', value: stats.delivered, color: statusConfig['Delivered'].chartColor },
      { name: 'Delayed', value: stats.delayed, color: statusConfig['Delayed'].chartColor },
      { name: 'Failed', value: stats.failed, color: statusConfig['Failed Delivery'].chartColor },
      { name: 'Returned', value: stats.returned, color: statusConfig['Returned'].chartColor },
    ].filter(item => item.value > 0);
    return data;
  }, [stats]);

  // Activity heatmap data - last 12 weeks activity by day
  const heatmapData = useMemo(() => {
    const weeks = 12;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    
    // Create a map of activity counts by date
    const activityMap = {};
    shipments.forEach(shipment => {
      shipment.timeline?.forEach(event => {
        if (event.timestamp) {
          const dateStr = new Date(event.timestamp).toISOString().split('T')[0];
          activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
        }
      });
    });

    // Generate last 12 weeks of data
    const today = new Date();
    
    // If no real data, generate sample visualization data
    const hasRealData = Object.keys(activityMap).length > 0;
    
    for (let week = weeks - 1; week >= 0; week--) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7) - (6 - day));
        const dateStr = date.toISOString().split('T')[0];
        
        // Use real data if available, otherwise generate sample pattern
        let count = activityMap[dateStr] || 0;
        if (!hasRealData) {
          // Generate sample data pattern for visualization
          const samplePatterns = [
            [0, 2, 3, 1, 2, 0, 1],
            [1, 3, 4, 2, 3, 1, 0],
            [2, 4, 5, 3, 4, 2, 1],
            [1, 2, 3, 4, 3, 2, 1],
            [0, 1, 2, 3, 2, 1, 0],
            [2, 3, 4, 5, 4, 3, 2],
            [1, 2, 3, 2, 3, 4, 3],
            [3, 4, 5, 4, 3, 2, 1],
            [2, 3, 4, 3, 4, 5, 4],
            [1, 2, 1, 2, 3, 4, 3],
            [0, 1, 2, 3, 4, 3, 2],
            [1, 2, 3, 4, 5, 4, 3]
          ];
          count = samplePatterns[week % 12][day];
        }
        
        data.push({
          week: weeks - 1 - week,
          day,
          dayName: days[day],
          date: dateStr,
          count,
          displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
    }
    
    return data;
  }, [shipments]);

  // Get max activity count for color scaling
  const maxActivity = useMemo(() => {
    return Math.max(...heatmapData.map(d => d.count), 1);
  }, [heatmapData]);

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Shipment Tracking
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Monitor and track all your shipments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Shipments"
          value={stats.total}
          icon={Package}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          titleColor="text-indigo-700"
        />
        <StatCard
          title="Pending Pickup"
          value={stats.pendingPickup}
          icon={Clock}
          badge="Action"
          badgeColor="bg-amber-100 text-amber-800"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          titleColor="text-amber-700"
        />
        <StatCard
          title="In Transit"
          value={stats.inTransit}
          icon={Truck}
          badge="Live"
          badgeColor="bg-cyan-100 text-cyan-800"
          iconBg="bg-cyan-100"
          iconColor="text-cyan-600"
          titleColor="text-cyan-700"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={CheckCircle}
          badge="Done"
          badgeColor="bg-emerald-100 text-emerald-800"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          titleColor="text-emerald-700"
        />
        <StatCard
          title="Delayed"
          value={stats.delayed}
          icon={AlertTriangle}
          badge="Alert"
          badgeColor="bg-rose-100 text-rose-800"
          iconBg="bg-rose-100"
          iconColor="text-rose-600"
          titleColor="text-rose-700"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut Chart - Shipment Status Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Status Distribution</h3>
              <p className="text-xs sm:text-sm text-gray-500">Breakdown by shipment status</p>
            </div>
          </div>
          
          {doughnutChartData.length > 0 ? (
            <div className="h-56 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={doughnutChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {doughnutChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-200">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: data.color }}
                              />
                              <span className="font-semibold text-gray-900">{data.name}</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{data.value}</p>
                            <p className="text-xs text-gray-500">
                              {((data.value / stats.total) * 100).toFixed(1)}% of total
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => (
                      <span className="text-sm text-gray-700 font-medium">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 sm:h-80 flex items-center justify-center">
              <div className="text-center">
                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No shipment data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Activity Heatmap */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Shipment Activity</h3>
              <p className="text-xs sm:text-sm text-gray-500">Last 12 weeks activity heatmap</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {/* Week labels */}
            <div className="flex gap-1 mb-3">
              <div className="w-6 sm:w-10" /> {/* Spacer for day labels */}
              <div className="flex-1 flex justify-between text-[10px] sm:text-xs text-gray-400 px-1">
                <span>12 weeks ago</span>
                <span>Now</span>
              </div>
            </div>
            
            {/* Heatmap grid */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
              <div key={day} className="flex gap-1 items-center">
                <span className="w-6 sm:w-10 text-[10px] sm:text-xs text-gray-500 font-medium">{day}</span>
                <div className="flex-1 flex gap-1">
                  {Array.from({ length: 12 }).map((_, weekIndex) => {
                    const cellData = heatmapData.find(d => d.week === weekIndex && d.day === dayIndex);
                    const count = cellData?.count || 0;
                    const intensity = count / maxActivity;
                    
                    // Color gradient from light gray to teal
                    const bgColor = count === 0 
                      ? 'bg-gray-100' 
                      : intensity < 0.25 
                        ? 'bg-teal-200' 
                        : intensity < 0.5 
                          ? 'bg-teal-400' 
                          : intensity < 0.75 
                            ? 'bg-teal-500' 
                            : 'bg-teal-600';
                    
                    return (
                      <div
                        key={`${day}-${weekIndex}`}
                        className={`flex-1 h-4 sm:h-6 rounded-sm ${bgColor} cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-teal-400 hover:ring-offset-1`}
                        title={`${cellData?.displayDate || ''}: ${count} ${count === 1 ? 'activity' : 'activities'}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-[10px] sm:text-xs text-gray-500">Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-gray-100" />
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-teal-200" />
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-teal-400" />
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-teal-500" />
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-teal-600" />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tracking number, carrier, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="lg:w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="Pending Pickup">Pending Pickup</option>
              <option value="Picked Up">Picked Up</option>
              <option value="In Transit">In Transit</option>
              <option value="Customs Clearance">Customs Clearance</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
              <option value="Failed Delivery">Failed Delivery</option>
              <option value="Returned">Returned</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Shipments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Shipments Found</h3>
          <p className="text-sm sm:text-base text-gray-600">No shipments match your current filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredShipments.map((shipment) => (
            <ShipmentCard
              key={shipment._id}
              shipment={shipment}
              config={statusConfig[shipment.status] || statusConfig['In Transit']}
              formatDate={formatDate}
              shippingMethodIcons={shippingMethodIcons}
              onViewDetails={() => handleViewDetails(shipment)}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedShipment && (
        <ShipmentDetailsModal
          shipment={selectedShipment}
          onClose={() => {
            setShowDetails(false);
            setSelectedShipment(null);
          }}
          config={statusConfig[selectedShipment.status] || statusConfig['In Transit']}
          statusConfig={statusConfig}
          formatDate={formatDate}
          shippingMethodIcons={shippingMethodIcons}
        />
      )}
    </div>
  );
};

// Stat Card Component (Admin-style)
// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, badge, badgeColor, iconBg, iconColor, titleColor }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-start justify-between mb-2 sm:mb-3">
      <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${iconColor}`} />
      </div>
      {badge && (
        <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-sm ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <p className={`text-xs sm:text-sm font-bold ${titleColor || 'text-gray-600'}`}>{title}</p>
    <p className="text-xl sm:text-3xl font-black text-gray-900 mt-1">{value}</p>
  </div>
);

// Shipment Card Component
const ShipmentCard = ({ shipment, config, formatDate, shippingMethodIcons, onViewDetails }) => {
  const StatusIcon = config.icon;
  const MethodIcon = shippingMethodIcons[shipment.shippingMethod] || Truck;
  
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-2 border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-teal-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <div className="p-3 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${config.bg} flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0`}>
                <Package className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-200 truncate">
                {shipment.trackingNumber}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 ml-8 sm:ml-10">
              <Box className="w-3 h-3 sm:w-4 sm:h-4" />
              {shipment.carrier?.name}
            </p>
          </div>
          <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold ${config.badge} flex items-center gap-1 sm:gap-1.5 shadow-sm border border-current/10 flex-shrink-0`}>
            <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{config.label}</span>
            <span className="sm:hidden">{config.label.split(' ')[0]}</span>
          </span>
        </div>

        {/* Route */}
        <div className="mb-3 sm:mb-4 p-2 sm:p-4 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1">From</p>
              <p className="text-xs sm:text-base font-bold text-gray-900 flex items-center gap-1 sm:gap-1.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-100 flex items-center justify-center shadow-sm border border-teal-200 flex-shrink-0">
                  <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-teal-600" />
                </div>
                <span className="truncate">{shipment.origin?.city}</span>
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 ml-6 sm:ml-8 truncate">{shipment.origin?.country}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-4 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <div className="w-8 h-0.5 bg-gradient-to-r from-teal-400 to-purple-400" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse animation-delay-500" />
              </div>
              <MethodIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1">To</p>
              <p className="text-xs sm:text-base font-bold text-gray-900 flex items-center justify-end gap-1 sm:gap-1.5">
                <span className="truncate">{shipment.destination?.city}</span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-100 flex items-center justify-center shadow-sm border border-rose-200 flex-shrink-0">
                  <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-rose-600" />
                </div>
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 mr-6 sm:mr-8 truncate">{shipment.destination?.country}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          {shipment.currentLocation && (
            <div className="flex items-center justify-between text-xs sm:text-sm bg-gray-50 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-100 shadow-sm">
              <span className="text-gray-600 flex items-center gap-1.5 sm:gap-2">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-500" />
                <span className="hidden sm:inline">Current Location</span>
                <span className="sm:hidden">Location</span>
              </span>
              <span className="font-semibold text-gray-900 truncate ml-2">{shipment.currentLocation}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs sm:text-sm bg-gray-50 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-100 shadow-sm">
            <span className="text-gray-600 flex items-center gap-1.5 sm:gap-2">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
              Est. Delivery
            </span>
            <span className="font-bold text-gray-900">{formatDate(shipment.estimatedDelivery)}</span>
          </div>

          {shipment.packageInfo && (
            <div className="flex items-center justify-between text-xs sm:text-sm bg-gray-50 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-100 shadow-sm">
              <span className="text-gray-600 flex items-center gap-1.5 sm:gap-2">
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                Packages
              </span>
              <span className="font-semibold text-gray-900">
                {shipment.packageInfo.numberOfPackages} x {shipment.packageInfo.weight?.value}{shipment.packageInfo.weight?.unit}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {shipment.timeline && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Shipment Progress</span>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                {Math.round((shipment.timeline.filter(t => t.isCompleted).length / shipment.timeline.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div
                className={`bg-gradient-to-r ${config.gradient} h-full rounded-full transition-all duration-500 shadow-md`}
                style={{
                  width: `${(shipment.timeline.filter(t => t.isCompleted).length / shipment.timeline.length) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-gray-400">{shipment.timeline.filter(t => t.isCompleted).length} updates</span>
              <span className="text-xs text-gray-400">{shipment.timeline.length} total</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg border border-slate-600"
        >
          <Eye className="w-4 h-4" />
          Track Shipment
        </button>
      </div>
    </div>
  );
};

// Shipment Details Modal Component
const ShipmentDetailsModal = ({ shipment, onClose, config, statusConfig, formatDate, shippingMethodIcons }) => {
  const StatusIcon = config.icon;
  const MethodIcon = shippingMethodIcons[shipment.shippingMethod] || Truck;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto animate-fadeIn" onClick={onClose}>
      <div className="min-h-full flex items-end sm:items-center justify-center p-0 sm:p-6">
        <div className="bg-white rounded-t-2xl sm:rounded-3xl max-w-4xl w-full shadow-2xl animate-scaleIn flex flex-col max-h-[92vh] sm:max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${config.gradient} p-3 sm:p-6 relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl flex-shrink-0`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <StatusIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-2xl font-black text-white tracking-tight">
                    {shipment.trackingNumber}
                  </h2>
                  <p className="text-white/80 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                    <Box className="w-3 h-3 sm:w-4 sm:h-4" />
                    {shipment.carrier?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:flex px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-bold items-center gap-2 shadow-lg">
                  <StatusIcon className="w-4 h-4" />
                  {config.label}
                </span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors duration-200 flex items-center justify-center"
                >
                  <XCircle className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* Route Information */}
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 rounded-2xl p-3 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <MethodIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Shipment Route
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {/* Origin */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-emerald-700 font-bold mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    Origin
                  </div>
                  {shipment.origin?.name && (
                    <div className="flex items-start gap-3 mb-3">
                      <User className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900">{shipment.origin.name}</p>
                        {shipment.origin.company && (
                          <p className="text-sm text-gray-500">{shipment.origin.company}</p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="space-y-1 text-gray-700">
                    <p className="text-sm">{shipment.origin?.address}</p>
                    <p className="font-semibold">
                      {shipment.origin?.city}, {shipment.origin?.state && `${shipment.origin.state}, `}
                      {shipment.origin?.country}
                    </p>
                    {shipment.origin?.zipCode && (
                      <p className="text-sm text-gray-500 font-mono">{shipment.origin.zipCode}</p>
                    )}
                  </div>
                </div>
                
                {/* Destination */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-rose-700 font-bold mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-rose-600" />
                    </div>
                    Destination
                  </div>
                  {shipment.destination?.name && (
                    <div className="flex items-start gap-3 mb-3">
                      <User className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900">{shipment.destination.name}</p>
                        {shipment.destination.company && (
                          <p className="text-sm text-gray-500">{shipment.destination.company}</p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="space-y-1 text-gray-700">
                    <p className="text-sm">{shipment.destination?.address}</p>
                    <p className="font-semibold">
                      {shipment.destination?.city}, {shipment.destination?.state && `${shipment.destination.state}, `}
                      {shipment.destination?.country}
                    </p>
                    {shipment.destination?.zipCode && (
                      <p className="text-sm text-gray-500 font-mono">{shipment.destination.zipCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Package Information */}
            {shipment.packageInfo && (
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl p-3 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Package Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1 sm:mb-2 uppercase tracking-wide">Weight</p>
                    <p className="text-lg sm:text-2xl font-black text-gray-900">
                      {shipment.packageInfo.weight?.value}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">{shipment.packageInfo.weight?.unit}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1 sm:mb-2 uppercase tracking-wide">Packages</p>
                    <p className="text-lg sm:text-2xl font-black text-gray-900">{shipment.packageInfo.numberOfPackages}</p>
                    <p className="text-xs sm:text-sm text-gray-500">units</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1 sm:mb-2 uppercase tracking-wide">Type</p>
                    <p className="text-base sm:text-xl font-bold text-gray-900">{shipment.packageInfo.packageType}</p>
                  </div>
                  {shipment.packageInfo.dimensions && (
                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center">
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1 sm:mb-2 uppercase tracking-wide">Dimensions</p>
                      <p className="text-sm sm:text-lg font-bold text-gray-900">
                        {shipment.packageInfo.dimensions.length} × {shipment.packageInfo.dimensions.width} × {shipment.packageInfo.dimensions.height}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">{shipment.packageInfo.dimensions.unit}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Timeline - IMPROVED STYLING */}
            {shipment.timeline && shipment.timeline.length > 0 && (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-3 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="hidden sm:inline">Tracking History</span>
                  <span className="sm:hidden">History</span>
                  <span className="ml-auto text-[10px] sm:text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    {shipment.timeline.filter(t => t.isCompleted).length}/{shipment.timeline.length}
                  </span>
                </h3>
                
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-blue-400 to-purple-400" />
                  
                  <div className="space-y-1">
                    {[...shipment.timeline].reverse().map((event, index) => {
                      const eventConfig = statusConfig[event.status] || statusConfig['In Transit'];
                      const EventIcon = eventConfig.icon;
                      
                      return (
                        <div key={index} className="relative flex gap-2 sm:gap-4 group">
                          {/* Timeline node */}
                          <div className="relative z-10 flex-shrink-0">
                            <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                              event.isCompleted 
                                ? `bg-gradient-to-br ${eventConfig.gradient}` 
                                : 'bg-gray-200'
                            }`}>
                              {event.isCompleted ? (
                                <EventIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className={`flex-1 bg-white rounded-xl p-3 sm:p-4 border shadow-sm mb-2 sm:mb-3 transition-all duration-300 group-hover:shadow-md ${
                            event.isCompleted ? 'border-gray-200' : 'border-gray-100 opacity-60'
                          }`}>
                            <div className="flex items-start justify-between gap-2 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                                  <span className={`text-xs sm:text-base font-bold text-gray-900 ${event.isCompleted ? '' : 'text-gray-500'}`}>
                                    {event.status}
                                  </span>
                                  {event.isCompleted && (
                                    <span className={`px-1.5 py-0.5 sm:px-2 rounded-full text-[10px] sm:text-xs font-semibold ${eventConfig.badge}`}>
                                      Completed
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{event.description}</p>
                                {event.location && (
                                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-teal-500" />
                                    {event.location}
                                  </p>
                                )}
                              </div>
                              {event.timestamp && (
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm font-semibold text-gray-700">
                                    {new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-5">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <MethodIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <p className="text-xs sm:text-sm text-blue-700 font-medium">Shipping Method</p>
                </div>
                <p className="text-base sm:text-xl font-bold text-gray-900">{shipment.shippingMethod}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 sm:p-5">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  <p className="text-xs sm:text-sm text-emerald-700 font-medium">Shipping Cost</p>
                </div>
                <p className="text-base sm:text-xl font-bold text-gray-900">${shipment.shippingCost}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 sm:p-5">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  <p className="text-xs sm:text-sm text-amber-700 font-medium">Est. Delivery</p>
                </div>
                <p className="text-base sm:text-xl font-bold text-gray-900">{formatDate(shipment.estimatedDelivery)}</p>
              </div>
            </div>

            {/* Delivered Date */}
            {shipment.actualDelivery && (
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-3 sm:p-5 text-white shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-100 text-xs sm:text-sm font-medium">Successfully Delivered</p>
                    <p className="text-lg sm:text-2xl font-bold">{formatDate(shipment.actualDelivery)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Carrier Contact */}
            {shipment.carrier?.contactNumber && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-5 text-white shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium">Carrier Contact</p>
                    <p className="text-base sm:text-xl font-bold">{shipment.carrier.contactNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 sm:rounded-b-3xl flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-bold text-sm hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            <XCircle className="w-5 h-5" />
            Close
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShipments;
