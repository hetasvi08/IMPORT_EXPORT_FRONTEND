import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Plus,
  Eye,
  Loader2,
  Search,
  ChevronDown,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  AlertCircle,
  X,
  Send,
  Paperclip,
  Building2,
  Mail,
  Phone,
  MapPin,
  Inbox
} from 'lucide-react';
import { apiconnector } from '../../services/apiconnector';
import { quoteEndpoints, dashboardEndpoints } from '../../services/apis';
import { acceptQuote, rejectQuote } from '../../services/operations/inquiryAPI';

const DashboardQuotes = () => {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [quoteToReject, setQuoteToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectCategory, setRejectCategory] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'responses'
  const [productFromNav, setProductFromNav] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    quoted: 0,
    accepted: 0,
    rejected: 0
  });

  // Predefined rejection categories
  const rejectionCategories = [
    { value: 'price_too_high', label: 'Price Too High' },
    { value: 'delivery_time_long', label: 'Delivery Time Too Long' },
    { value: 'found_better_offer', label: 'Found Better Offer' },
    { value: 'quality_concerns', label: 'Quality Concerns' },
    { value: 'terms_not_acceptable', label: 'Terms Not Acceptable' },
    { value: 'budget_changed', label: 'Budget Changed' },
    { value: 'project_cancelled', label: 'Project Cancelled' },
    { value: 'other', label: 'Other (Please Specify)' }
  ];

  const statusConfig = {
    'pending': {
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800',
      label: 'Pending'
    },
    'in-review': {
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      label: 'In Review'
    },
    'quoted': {
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      label: 'Quoted'
    },
    'negotiating': {
      icon: TrendingUp,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-800',
      label: 'Negotiating'
    },
    'accepted': {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800',
      label: 'Accepted'
    },
    'rejected': {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      label: 'Rejected'
    },
    'expired': {
      icon: AlertCircle,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-800',
      label: 'Expired'
    }
  };

  const urgencyConfig = {
    'Low': { badge: 'bg-gray-100 text-gray-700', label: 'Low' },
    'Medium': { badge: 'bg-blue-100 text-blue-700', label: 'Medium' },
    'High': { badge: 'bg-orange-100 text-orange-700', label: 'High' },
    'Urgent': { badge: 'bg-red-100 text-red-700', label: 'Urgent' }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Handle navigation from product detail page
  useEffect(() => {
    if (location.state?.productId) {
      setProductFromNav({
        productId: location.state.productId,
        productName: location.state.productName,
        productImage: location.state.productImage,
        productPrice: location.state.productPrice,
        quantity: location.state.quantity
      });
      setShowCreateModal(true);
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    filterQuotes();
  }, [quotes, statusFilter, searchQuery, activeTab]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await apiconnector(
        'GET',
        dashboardEndpoints.GET_QUOTES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        const quotesData = response.data.data || [];
        setQuotes(quotesData);
        calculateStats(quotesData);
      }
    } catch (error) {
      // Mock data for demo
      const mockQuotes = generateMockQuotes();
      setQuotes(mockQuotes);
      calculateStats(mockQuotes);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (quotesData) => {
    // Calculate stats based on active tab
    const myRequests = quotesData; // All quotes user submitted
    const supplierResponses = quotesData.filter(q => 
      q.status === 'quoted' && q.supplierResponse && q.supplierResponse.quotedPrice
    );
    
    const newStats = {
      total: myRequests.length,
      pending: myRequests.filter(q => q.status === 'pending').length,
      quoted: supplierResponses.length,
      accepted: myRequests.filter(q => q.status === 'accepted').length,
      rejected: myRequests.filter(q => q.status === 'rejected').length
    };setStats(newStats);
  };

  const filterQuotes = () => {
    let filtered = [...quotes];

    // Filter by tab
    if (activeTab === 'responses') {
      // Show only quotes that have supplier responses and are "quoted" status
      filtered = filtered.filter(quote => 
        quote.status === 'quoted' && 
        quote.supplierResponse && 
        quote.supplierResponse.quotedPrice
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(quote =>
        quote.quoteId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredQuotes(filtered);
  };

  // Handle Accept Quote
  const handleAcceptQuote = async (quoteId) => {
    setActionLoading(true);
    try {
      const result = await acceptQuote(quoteId, token);
      if (result) {
        // Update local state
        const updatedQuotes = quotes.map(q => 
          q._id === quoteId ? { ...q, status: 'accepted' } : q
        );
        setQuotes(updatedQuotes);
        // Recalculate stats with updated data
        calculateStats(updatedQuotes);
        setShowDetails(false);
        
      }
    } catch (error) {} finally {
      setActionLoading(false);
    }
  };

  // Handle Reject Quote - Open Modal
  const handleRejectClick = (quote) => {
    setQuoteToReject(quote);
    setRejectReason('');
    setRejectCategory('');
    setShowRejectModal(true);
  };

  // Handle Reject Quote - Confirm
  const handleRejectQuote = async () => {
    if (!quoteToReject) return;
    
    // Validate that a category is selected
    if (!rejectCategory) {
      
      return;
    }

    // If "Other" is selected, reason text is required
    if (rejectCategory === 'other' && !rejectReason.trim()) {
      
      return;
    }
    
    setActionLoading(true);
    try {
      const result = await rejectQuote(quoteToReject._id, rejectCategory, rejectReason, token);if (result) {
        // Update local state
        const updatedQuotes = quotes.map(q => 
          q._id === quoteToReject._id ? { ...q, status: 'rejected', rejectionCategory: rejectCategory, rejectionReason: rejectReason } : q
        );setQuotes(updatedQuotes);
        // Recalculate stats with updated data
        calculateStats(updatedQuotes);
        setShowDetails(false);
        setShowRejectModal(false);
        setQuoteToReject(null);
        setRejectReason('');
        setRejectCategory('');
        
      }
    } catch (error) {} finally {
      setActionLoading(false);
    }
  };

  const generateMockQuotes = () => {
    const statuses = ['pending', 'in-review', 'quoted', 'negotiating', 'accepted', 'rejected'];
    const urgencies = ['Low', 'Medium', 'High', 'Urgent'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      _id: `quote-${i + 1}`,
      quoteId: `QTE-2025-${String(i + 1).padStart(5, '0')}`,
      productName: `Industrial Product ${i + 1}`,
      category: 'Industrial Equipment',
      quantity: Math.floor(Math.random() * 500) + 100,
      unit: 'pieces',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
      targetPrice: 100 + i * 50,
      description: 'High-quality industrial component with specific requirements',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      expectedDeliveryDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryLocation: {
        city: 'New York',
        country: 'USA'
      },
      customerInfo: {
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: '+1234567890',
        company: user?.company || 'ABC Corp'
      },
      supplierResponse: i % 3 === 0 ? {
        quotedPrice: 120 + i * 60,
        moq: 50,
        leadTime: { value: 15, unit: 'days' },
        paymentTerms: '50% advance, 50% on delivery',
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      } : null
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2 sm:gap-3">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            {activeTab === 'requests' ? 'My Quote Requests' : 'Supplier Responses'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {activeTab === 'requests' 
              ? 'Request and manage product quotes' 
              : 'Review and respond to supplier quotes'}
          </p>
        </div>
        {activeTab === 'requests' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            New Quote Request
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-fit animate-fadeInUp" style={{animationDelay: '0.05s'}}>
        <button
          onClick={() => {
            setActiveTab('requests');
            setStatusFilter('all');
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none justify-center sm:justify-start ${
            activeTab === 'requests'
              ? 'bg-white text-teal-600 shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">My </span>Requests
          <span className={`ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full ${
            activeTab === 'requests' ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-600'
          }`}>
            {stats.total}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab('responses');
            setStatusFilter('all');
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none justify-center sm:justify-start ${
            activeTab === 'responses'
              ? 'bg-white text-purple-600 shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Supplier </span>Responses
          {stats.quoted > 0 && (
            <span className={`ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full animate-pulse ${
              activeTab === 'responses' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {stats.quoted}
            </span>
          )}
        </button>
      </div>

      {/* Stats Cards - Different for each tab */}
      {activeTab === 'requests' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <StatCard
            title="Total Quotes"
            value={stats.total}
            icon={FileText}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
            titleColor="text-indigo-700"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            badge="Action"
            badgeColor="bg-amber-100 text-amber-800"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            titleColor="text-amber-700"
          />
          <StatCard
            title="Quoted"
            value={stats.quoted}
            icon={MessageSquare}
            badge="New"
            badgeColor="bg-violet-100 text-violet-800"
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
            titleColor="text-violet-700"
          />
          <StatCard
            title="Accepted"
            value={stats.accepted}
            icon={CheckCircle}
            badge="Done"
            badgeColor="bg-emerald-100 text-emerald-800"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            titleColor="text-emerald-700"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            iconBg="bg-rose-100"
            iconColor="text-rose-600"
            titleColor="text-rose-700"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <StatCard
            title="Awaiting Response"
            value={stats.quoted}
            icon={Inbox}
            badge="New"
            badgeColor="bg-violet-100 text-violet-800"
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
            titleColor="text-violet-700"
          />
          <StatCard
            title="Accepted"
            value={stats.accepted}
            icon={CheckCircle}
            badge="Done"
            badgeColor="bg-emerald-100 text-emerald-800"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            titleColor="text-emerald-700"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            iconBg="bg-rose-100"
            iconColor="text-rose-600"
            titleColor="text-rose-700"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'requests' 
                  ? "Search quotes..." 
                  : "Search responses..."}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          {activeTab === 'requests' && (
            <div className="relative w-full sm:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white cursor-pointer text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-review">In Review</option>
                <option value="quoted">Quoted</option>
                <option value="negotiating">Negotiating</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          )}
          
          {activeTab === 'responses' && (
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-purple-700">
              <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Showing quotes awaiting response</span>
            </div>
          )}
        </div>
      </div>

      {/* Quotes List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          {activeTab === 'requests' ? (
            <>
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quotes Found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by creating your first quote request'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Create Quote Request
                </button>
              )}
            </>
          ) : (
            <>
              <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Supplier Responses Yet</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'When suppliers respond to your quote requests, they will appear here for your review.'}
              </p>
              <button
                onClick={() => setActiveTab('requests')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <FileText className="w-5 h-5" />
                View My Requests
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
          {filteredQuotes.map((quote, index) => (
            <QuoteCard
              key={quote._id}
              quote={quote}
              index={index}
              statusConfig={statusConfig}
              urgencyConfig={urgencyConfig}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              onViewDetails={() => {
                setSelectedQuote(quote);
                setShowDetails(true);
              }}
              showActions={activeTab === 'responses'}
              onAccept={handleAcceptQuote}
              onReject={handleRejectClick}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* Quote Details Modal */}
      {showDetails && selectedQuote && (
        <QuoteDetailsModal
          quote={selectedQuote}
          statusConfig={statusConfig}
          urgencyConfig={urgencyConfig}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          onClose={() => {
            setShowDetails(false);
            setSelectedQuote(null);
          }}
          onAccept={handleAcceptQuote}
          onReject={handleRejectClick}
          actionLoading={actionLoading}
        />
      )}

      {/* Create Quote Modal */}
      {showCreateModal && (
        <CreateQuoteModal
          onClose={() => {
            setShowCreateModal(false);
            setProductFromNav(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setProductFromNav(null);
            fetchQuotes();
          }}
          preselectedProduct={productFromNav}
        />
      )}

      {/* Reject Quote Modal */}
      {showRejectModal && quoteToReject && (
        <RejectQuoteModal
          quote={quoteToReject}
          reason={rejectReason}
          setReason={setRejectReason}
          category={rejectCategory}
          setCategory={setRejectCategory}
          categories={rejectionCategories}
          onClose={() => {
            setShowRejectModal(false);
            setQuoteToReject(null);
            setRejectReason('');
            setRejectCategory('');
          }}
          onConfirm={handleRejectQuote}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

// Stat Card Component (Admin-style)
const StatCard = ({ title, value, icon: Icon, badge, badgeColor, iconBg, iconColor, titleColor }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-start justify-between mb-2 sm:mb-3">
      <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${iconColor}`} />
      </div>
      {badge && (
        <span className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-sm ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <p className={`text-xs sm:text-sm font-bold ${titleColor || 'text-gray-600'}`}>{title}</p>
    <p className="text-xl sm:text-3xl font-black text-gray-900 mt-0.5 sm:mt-1">{value}</p>
  </div>
);

// Quote Card Component
const QuoteCard = ({ quote, index, statusConfig, urgencyConfig, formatDate, formatCurrency, onViewDetails, showActions, onAccept, onReject, actionLoading }) => {
  const config = statusConfig[quote.status] || statusConfig['pending'];
  const StatusIcon = config.icon;
  const urgency = urgencyConfig[quote.urgency] || urgencyConfig['Medium'];

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-teal-300 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 animate-slideInLeft overflow-hidden group h-full flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 truncate">{quote.quoteId}</h3>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold ${urgency.badge} flex-shrink-0`}>
                {quote.urgency}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 font-medium truncate">{quote.productName}</p>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{quote.category}</p>
          </div>
          <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold ${config.badge} flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ml-2`}>
            <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {config.label}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600 flex items-center gap-1 sm:gap-1.5">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Quantity
            </span>
            <span className="font-semibold text-gray-900">
              {quote.quantity} {quote.unit}
            </span>
          </div>

          {quote.targetPrice && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600 flex items-center gap-1 sm:gap-1.5">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Target Price
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(quote.targetPrice)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600 flex items-center gap-1 sm:gap-1.5">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Requested
            </span>
            <span className="font-medium text-gray-900">
              {formatDate(quote.createdAt)}
            </span>
          </div>

          {quote.expectedDeliveryDate && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600 flex items-center gap-1 sm:gap-1.5">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Delivery
              </span>
              <span className="font-medium text-gray-900">
                {formatDate(quote.expectedDeliveryDate)}
              </span>
            </div>
          )}
        </div>

        {/* Supplier Response */}
        {quote.supplierResponse && quote.supplierResponse.quotedPrice && (
          <div className={`${config.bg} border ${config.border} rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <MessageSquare className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${config.color}`} />
              <span className={`text-xs sm:text-sm font-semibold ${config.color}`}>
                Supplier Quote
              </span>
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              {quote.supplierResponse.quotedPrice && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(quote.supplierResponse.quotedPrice)}
                  </span>
                </div>
              )}
              {quote.supplierResponse.moq && (
                <div className="flex justify-between">
                  <span className="text-gray-600">MOQ:</span>
                  <span className="font-medium text-gray-900">
                    {quote.supplierResponse.moq} pcs
                  </span>
                </div>
              )}
              {quote.supplierResponse.leadTime?.value && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Lead Time:</span>
                  <span className="font-medium text-gray-900">
                    {quote.supplierResponse.leadTime.value} {quote.supplierResponse.leadTime.unit || 'days'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 mt-auto">
          <button
            onClick={onViewDetails}
            className="w-full py-2 sm:py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm hover:shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            View Details
          </button>
          
          {/* Accept/Reject buttons for supplier responses */}
          {showActions && quote.status === 'quoted' && (
            <div className="flex gap-2 pt-1 sm:pt-2">
              <button
                onClick={() => onAccept(quote._id)}
                disabled={actionLoading}
                className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 text-xs sm:text-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                Accept
              </button>
              <button
                onClick={() => onReject(quote)}
                disabled={actionLoading}
                className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 text-xs sm:text-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Quote Details Modal Component
const QuoteDetailsModal = ({ quote, statusConfig, urgencyConfig, formatDate, formatCurrency, onClose, onAccept, onReject, actionLoading }) => {
  const config = statusConfig[quote.status] || statusConfig['pending'];
  const StatusIcon = config.icon;
  const urgency = urgencyConfig[quote.urgency] || urgencyConfig['Medium'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-scaleIn transform transition-all duration-500">
        {/* Header */}
        <div className={`${config.bg} ${config.border} border-b p-3 sm:p-6 transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center`}>
                <StatusIcon className={`w-4 h-4 sm:w-6 sm:h-6 ${config.color}`} />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-gray-900">{quote.quoteId}</h2>
                <p className="text-xs sm:text-sm text-gray-600">Created on {formatDate(quote.createdAt)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/50 rounded-lg transition-all duration-300"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-140px)] sm:max-h-[calc(90vh-180px)] p-3 sm:p-6 scrollbar-hide">
          <div className="space-y-4 sm:space-y-6">
            {/* Status and Urgency */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${config.badge} flex items-center gap-1.5 sm:gap-2 shadow-md`}>
                <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {config.label}
              </span>
              <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${urgency.badge} shadow-md`}>
                {quote.urgency} Priority
              </span>
            </div>

            {/* Product Information */}
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-4 flex items-center gap-2 flex-wrap">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                Product Information
                {/* Catalog/Custom Badge */}
                {quote.isCustomProduct === false ? (
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-teal-100 text-teal-700 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1">
                    <i className="fas fa-check-circle"></i> From Catalog
                  </span>
                ) : (
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-violet-100 text-violet-700 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1">
                    <i className="fas fa-edit"></i> Custom Request
                  </span>
                )}
              </h3>
              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 border-l-4 border-teal-500 rounded-lg p-3 sm:p-5 space-y-2.5 sm:space-y-3 shadow-md">
                {/* Selected Product Card (if from catalog) */}
                {quote.selectedProduct?.productId && (
                  <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-teal-200 flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 shadow-sm">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {quote.selectedProduct?.image ? (
                        <img
                          src={quote.selectedProduct.image}
                          alt={quote.selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100">
                          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-teal-800 text-sm sm:text-base truncate">{quote.selectedProduct.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {quote.selectedProduct.sku && `SKU: ${quote.selectedProduct.sku}`}
                        {quote.selectedProduct.category && ` • ${quote.selectedProduct.category}`}
                      </p>
                      {quote.selectedProduct.price && (
                        <p className="text-xs sm:text-sm font-semibold text-teal-600 mt-0.5 sm:mt-1">Listed Price: ${quote.selectedProduct.price}</p>
                      )}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">Product Name</p>
                    <p className="font-bold text-gray-900 text-xs sm:text-base">{quote.productName}</p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">Category</p>
                    <p className="font-bold text-gray-900 text-xs sm:text-base">{quote.category}</p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">Quantity</p>
                    <p className="font-bold text-gray-900 text-xs sm:text-base">{quote.quantity} {quote.unit}</p>
                  </div>
                  {quote.targetPrice && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">Target Price</p>
                      <p className="font-bold text-teal-600 text-sm sm:text-lg">{formatCurrency(quote.targetPrice)}</p>
                    </div>
                  )}
                </div>
                {quote.description && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">Description</p>
                    <p className="text-gray-900 leading-relaxed text-xs sm:text-base">{quote.description}</p>
                  </div>
                )}
                {quote.specifications && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">Specifications</p>
                    <p className="text-gray-900 leading-relaxed text-xs sm:text-base">{quote.specifications}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                Delivery Information
              </h3>
              <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-l-4 border-emerald-500 rounded-lg p-3 sm:p-5 space-y-2.5 sm:space-y-3 shadow-md">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs font-semibold text-emerald-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Location
                    </p>
                    <p className="font-bold text-gray-900 text-xs sm:text-base">
                      {quote.deliveryLocation?.city}, {quote.deliveryLocation?.country}
                    </p>
                  </div>
                  {quote.expectedDeliveryDate && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs font-semibold text-emerald-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Delivery
                      </p>
                      <p className="font-bold text-emerald-600 text-sm sm:text-lg">{formatDate(quote.expectedDeliveryDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            {quote.customerInfo && (
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                  Contact Information
                </h3>
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-l-4 border-purple-500 rounded-lg p-3 sm:p-5 space-y-2 sm:space-y-3 shadow-md">
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs font-semibold text-purple-700 mb-0.5 sm:mb-1.5 uppercase tracking-wide">Name</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-lg">{quote.customerInfo.name}</p>
                  </div>
                  {quote.customerInfo.company && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs font-semibold text-purple-700 mb-0.5 sm:mb-1.5 uppercase tracking-wide">Company</p>
                      <p className="font-bold text-gray-900 text-xs sm:text-base">{quote.customerInfo.company}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3 flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-purple-700 font-semibold">Email</p>
                        <p className="text-xs sm:text-sm text-gray-900 font-medium truncate">{quote.customerInfo.email}</p>
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3 flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-purple-700 font-semibold">Phone</p>
                        <p className="text-xs sm:text-sm text-gray-900 font-medium">{quote.customerInfo.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Supplier Response */}
            {quote.supplierResponse && (
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                  Supplier Response
                </h3>
                <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-3 sm:p-5 space-y-2.5 sm:space-y-3 shadow-md">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {quote.supplierResponse.quotedPrice && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 sm:p-4 border-2 border-amber-200">
                        <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Quoted Price</p>
                        <p className="text-lg sm:text-2xl font-black text-amber-600">
                          {formatCurrency(quote.supplierResponse.quotedPrice)}
                        </p>
                      </div>
                    )}
                    {quote.supplierResponse.moq && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 sm:p-4 border-2 border-amber-200">
                        <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Min Order Qty</p>
                        <p className="text-lg sm:text-2xl font-black text-gray-900">
                          {quote.supplierResponse.moq} <span className="text-xs sm:text-base font-semibold text-gray-600">pcs</span>
                        </p>
                      </div>
                    )}
                    {quote.supplierResponse.leadTime?.value && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 sm:p-4">
                        <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Lead Time</p>
                        <p className="font-bold text-gray-900 text-sm sm:text-lg">
                          {quote.supplierResponse.leadTime.value} <span className="text-xs sm:text-sm text-gray-600">{quote.supplierResponse.leadTime.unit || 'days'}</span>
                        </p>
                      </div>
                    )}
                    {quote.supplierResponse.validUntil && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 sm:p-4">
                        <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Valid Until</p>
                        <p className="font-bold text-gray-900 text-sm sm:text-lg">
                          {formatDate(quote.supplierResponse.validUntil)}
                        </p>
                      </div>
                    )}
                  </div>
                  {quote.supplierResponse.paymentTerms && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 sm:p-4">
                      <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Payment Terms</p>
                      <p className="text-gray-900 font-medium leading-relaxed text-xs sm:text-base">{quote.supplierResponse.paymentTerms}</p>
                    </div>
                  )}
                  {quote.supplierResponse.shippingTerms && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 sm:p-4">
                      <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Shipping Terms</p>
                      <p className="text-gray-900 font-medium leading-relaxed text-xs sm:text-base">{quote.supplierResponse.shippingTerms}</p>
                    </div>
                  )}
                  {quote.supplierResponse.notes && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 sm:p-4 border-2 border-dashed border-amber-300">
                      <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Additional Notes</p>
                      <p className="text-gray-900 font-medium leading-relaxed italic text-xs sm:text-base">{quote.supplierResponse.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-3 sm:p-6 flex flex-wrap gap-2 sm:gap-3">
          {quote.status === 'quoted' && quote.supplierResponse && (
            <>
              <button 
                onClick={() => onAccept(quote._id)}
                disabled={actionLoading}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                Accept
              </button>
              <button 
                onClick={() => onReject(quote)}
                disabled={actionLoading}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Reject
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Quote Modal Component
const CreateQuoteModal = ({ onClose, onSuccess, preselectedProduct }) => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [productType, setProductType] = useState(preselectedProduct ? 'catalog' : 'catalog'); // 'catalog' or 'custom'
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(preselectedProduct ? {
    _id: preselectedProduct.productId,
    name: preselectedProduct.productName,
    images: preselectedProduct.productImage ? [{ url: preselectedProduct.productImage }] : [],
    price: preselectedProduct.productPrice
  } : null);
  const [formData, setFormData] = useState({
    productName: preselectedProduct?.productName || '',
    category: '',
    quantity: preselectedProduct?.quantity || '',
    unit: 'pieces',
    description: '',
    specifications: '',
    targetPrice: preselectedProduct?.productPrice || '',
    urgency: 'Medium',
    expectedDeliveryDate: '',
    deliveryCity: '',
    deliveryCountry: '',
    attachments: []
  });

  // Fetch products for dropdown - always fetch when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        // Fetch only approved products for quote creation
        const response = await apiconnector(
          'GET',
          '/api/products?limit=200&isApproved=approved',
          null,
          { Authorization: `Bearer ${token}` }
        );if (response.data.success) {
          const productsData = response.data.data || response.data.products || [];
          // Additional client-side filter to ensure only approved products
          const approvedProducts = productsData.filter(p => p.isApproved === 'approved');setProducts(approvedProducts);
        }
      } catch (error) {// Try without auth
        try {
          const publicResponse = await apiconnector(
            'GET',
            '/api/products?limit=200&isApproved=approved',
            null,
            null
          );
          if (publicResponse.data.success) {
            const productsData = publicResponse.data.data || publicResponse.data.products || [];
            const approvedProducts = productsData.filter(p => p.isApproved === 'approved');setProducts(approvedProducts);
          }
        } catch (publicError) {}
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProductDropdown && !event.target.closest('.product-dropdown-container')) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProductDropdown]);

  // Filter products based on search - search across name, SKU, category, description, specifications, tags
  const filteredProducts = products.filter(product => {
    if (!productSearch.trim()) return true; // Show all if no search
    const searchLower = productSearch.toLowerCase();
    
    // Check specifications array (can be objects with key/value)
    const specsMatch = product.specifications?.some(spec => {
      if (typeof spec === 'string') return spec.toLowerCase().includes(searchLower);
      if (typeof spec === 'object') {
        return spec.key?.toLowerCase().includes(searchLower) || 
               spec.value?.toLowerCase().includes(searchLower);
      }
      return false;
    });
    
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower) ||
      product.category?.name?.toLowerCase().includes(searchLower) ||
      (typeof product.category === 'string' && product.category.toLowerCase().includes(searchLower)) ||
      product.subCategory?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.shortDescription?.toLowerCase().includes(searchLower) ||
      product.material?.toLowerCase().includes(searchLower) ||
      product.brand?.name?.toLowerCase().includes(searchLower) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      specsMatch
    );
  });

  // Format specifications array to readable string
  const formatSpecifications = (specs) => {
    if (!specs) return '';
    if (typeof specs === 'string') return specs;
    if (Array.isArray(specs)) {
      return specs
        .map(spec => {
          if (typeof spec === 'string') return spec;
          if (typeof spec === 'object' && spec.key && spec.value) {
            return `${spec.key}: ${spec.value}`;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');
    }
    return '';
  };

  // Handle product selection from dropdown
  const handleProductSelect = (product) => {setSelectedProduct(product);
    
    // Get category name - handle both populated object and string/ObjectId
    let categoryName = '';
    if (product.category) {
      if (typeof product.category === 'object' && product.category.name) {
        categoryName = product.category.name;
      } else if (typeof product.category === 'string') {
        // If it's a 24-char hex string (ObjectId), it's not populated - use a fallback
        if (product.category.length === 24 && /^[0-9a-fA-F]+$/.test(product.category)) {
          categoryName = 'General'; // Fallback for unpopulated category
        } else {
          categoryName = product.category;
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      productName: product.name || '',
      category: categoryName,
      targetPrice: product.price || '',
      description: product.description || prev.description,
      specifications: formatSpecifications(product.specifications) || prev.specifications
    }));
    setShowProductDropdown(false);
    setProductSearch('');
  };

  // Clear selected product
  const clearSelectedProduct = () => {
    setSelectedProduct(null);
    setFormData(prev => ({
      ...prev,
      productName: '',
      category: '',
      targetPrice: '',
      description: '',
      specifications: ''
    }));
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check total attachments limit (max 5)
    if (formData.attachments.length + files.length > 5) {
      
      return;
    }

    setUploadingFile(true);

    try {
      for (const file of files) {
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          continue;
        }

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await apiconnector(
          'POST',
          quoteEndpoints.UPLOAD_ATTACHMENT_API,
          formDataUpload,
          {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        );

        if (response.data.success) {
          setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, response.data.data]
          }));
        }
      }
    } catch (error) {
    } finally {
      setUploadingFile(false);
      e.target.value = ''; // Reset input
    }
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate based on product type
      if (productType === 'catalog' && !selectedProduct) {
        
        setLoading(false);
        return;
      }

      // Client-side validation
      if (!formData.productName?.trim()) {
        
        setLoading(false);
        return;
      }
      if (!formData.category?.trim()) {
        
        setLoading(false);
        return;
      }
      if (!formData.quantity || parseInt(formData.quantity) < 1) {
        
        setLoading(false);
        return;
      }
      if (!formData.description?.trim()) {
        
        setLoading(false);
        return;
      }
      if (!formData.deliveryCountry?.trim()) {
        
        setLoading(false);
        return;
      }

      // Format data for backend
      const quoteData = {
        productName: formData.productName.trim(),
        category: formData.category.trim(),
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        description: formData.description.trim(),
        specifications: formData.specifications?.trim() || '',
        targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : undefined,
        urgency: formData.urgency,
        expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
        deliveryLocation: {
          city: formData.deliveryCity?.trim() || '',
          country: formData.deliveryCountry.trim()
        },
        attachments: formData.attachments,
        // New fields for product type
        isCustomProduct: productType === 'custom',
        // Include selected product details if from catalog
        ...(productType === 'catalog' && selectedProduct && {
          product: selectedProduct._id,
          selectedProduct: {
            productId: selectedProduct._id,
            name: selectedProduct.name,
            sku: selectedProduct.sku || '',
            image: selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || selectedProduct.image || '',
            price: selectedProduct.price,
            category: selectedProduct.category?.name || selectedProduct.category || ''
          }
        })
      };const response = await apiconnector(
        'POST',
        quoteEndpoints.CREATE_QUOTE_API,
        quoteData,
        {
          Authorization: `Bearer ${token}`,
        }
      );if (response.data.success) {
        
        onSuccess();
      } else {
        // Handle validation errors
        if (response.data.errors && response.data.errors.length > 0) {// Show all validation errors
          const errorMessages = response.data.errors.map(err => err.message).join(', ');
          
        } else {
          
        }
      }
    } catch (error) {const errorMessage = error.response?.data?.errors?.[0]?.message || 
                          error.response?.data?.message || 
                          'Failed to create quote request';
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-scaleIn transform transition-all duration-300">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 sm:p-6 text-white transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h2 className="text-lg sm:text-2xl font-black">New Quote Request</h2>
                <p className="text-teal-100 text-xs sm:text-sm">Fill in the details to request a quote</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-3 sm:p-6 overflow-y-auto max-h-[calc(92vh-160px)] sm:max-h-[calc(90vh-180px)] scrollbar-hide">
          <div className="space-y-3 sm:space-y-4">
            
            {/* Product Type Toggle */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-3 sm:p-4 rounded-xl border border-slate-200">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Product Selection *
              </label>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProductType('catalog');
                    clearSelectedProduct();
                  }}
                  className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                    productType === 'catalog'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-[1.02]'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Select from </span>Catalog
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProductType('custom');
                    setSelectedProduct(null);
                    setFormData(prev => ({
                      ...prev,
                      productName: '',
                      category: '',
                      targetPrice: '',
                      description: '',
                      specifications: ''
                    }));
                  }}
                  className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                    productType === 'custom'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg scale-[1.02]'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-violet-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Custom<span className="hidden sm:inline"> Product</span>
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">
                {productType === 'catalog' 
                  ? '📦 Select an existing product from our catalog'
                  : '✏️ Describe your custom product requirements'}
              </p>
            </div>

            {/* Product Selection Dropdown (for catalog) */}
            {productType === 'catalog' && (
              <div className="relative product-dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product *
                </label>
                
                {/* Selected Product Display */}
                {selectedProduct ? (
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      {(selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || selectedProduct.image) ? (
                        <img
                          src={selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                          <Package className="w-6 h-6 text-teal-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{selectedProduct.name}</p>
                      <p className="text-sm text-gray-500">{selectedProduct.category?.name || selectedProduct.category}</p>
                      {selectedProduct.price && (
                        <p className="text-sm font-semibold text-teal-600">${selectedProduct.price.toFixed(2)}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={clearSelectedProduct}
                      className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Dropdown Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setShowProductDropdown(!showProductDropdown)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white text-left flex items-center justify-between hover:border-teal-300"
                    >
                      <span className="text-gray-500 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {loadingProducts ? 'Loading products...' : `Choose from ${products.length} products`}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown */}
                    {showProductDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                        {/* Search Input Inside Dropdown */}
                        <div className="p-3 border-b border-gray-100 bg-gray-50 sticky top-0">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              placeholder="Search by name, SKU, category, description..."
                              autoFocus
                            />
                            {productSearch && (
                              <button
                                type="button"
                                onClick={() => setProductSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
                              >
                                <X className="w-3 h-3 text-gray-400" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {productSearch ? `${filteredProducts.length} results` : `${products.length} products available`}
                          </p>
                        </div>
                        
                        {/* Products List */}
                        <div className="max-h-64 overflow-y-auto">
                          {loadingProducts ? (
                            <div className="p-6 text-center text-gray-500">
                              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-teal-500" />
                              <p>Loading products...</p>
                            </div>
                          ) : filteredProducts.length > 0 ? (
                            filteredProducts.slice(0, 20).map((product) => (
                              <button
                                key={product._id}
                                type="button"
                                onClick={() => handleProductSelect(product)}
                                className="w-full p-3 flex items-center gap-3 hover:bg-teal-50 transition-colors border-b border-gray-50 last:border-b-0"
                              >
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  {(product.images?.[0]?.url || product.images?.[0] || product.image) ? (
                                    <img
                                      src={product.images?.[0]?.url || product.images?.[0] || product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                      <Package className="w-5 h-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {product.category?.name || product.category || 'General'}
                                    {product.sku && ` • SKU: ${product.sku}`}
                                  </p>
                                </div>
                                {product.price ? (
                                  <span className="text-sm font-bold text-teal-600">${product.price.toFixed(2)}</span>
                                ) : (
                                  <span className="text-xs text-gray-400">Request Quote</span>
                                )}
                              </button>
                            ))
                          ) : products.length > 0 && productSearch ? (
                            // Search returned no results
                            <div className="p-6 text-center text-gray-500">
                              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm font-medium">No products match "{productSearch}"</p>
                              <p className="text-xs text-gray-400 mt-1">Try different keywords or check spelling</p>
                              <button
                                type="button"
                                onClick={() => setProductSearch('')}
                                className="mt-3 px-4 py-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium border border-teal-200 rounded-lg hover:bg-teal-50"
                              >
                                Clear Search
                              </button>
                            </div>
                          ) : (
                            // No products in catalog at all
                            <div className="p-6 text-center text-gray-500">
                              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm font-medium">No products in catalog</p>
                              <p className="text-xs text-gray-400 mt-1">Request a quote for your custom product</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setProductType('custom');
                                  setShowProductDropdown(false);
                                }}
                                className="mt-3 px-4 py-2 text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 font-medium rounded-lg transition-colors"
                              >
                                Switch to Custom Product →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Custom Product Fields (shown when custom or after catalog selection) */}
            {(productType === 'custom' || selectedProduct) && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      disabled={productType === 'catalog' && selectedProduct}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-sm ${
                        productType === 'catalog' && selectedProduct ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      disabled={productType === 'catalog' && selectedProduct}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm ${
                        productType === 'catalog' && selectedProduct ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="e.g., Industrial Equipment"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Common fields - always shown */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Unit
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="tons">Tons</option>
                  <option value="units">Units</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Description *
              </label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                placeholder="Describe your requirements..."
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Specifications
              </label>
              <textarea
                rows={2}
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                placeholder="Technical specifications (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Target Price (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Urgency
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Delivery Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.deliveryCountry}
                  onChange={(e) => setFormData({ ...formData, deliveryCountry: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  placeholder="e.g., USA"
                />
              </div>
            </div>

            {/* Attachments Section */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Attachments <span className="text-gray-400 font-normal text-[10px] sm:text-sm">(Max 5 files, 10MB each)</span>
              </label>
              
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-500 transition-colors">
                <input
                  type="file"
                  id="quote-attachment"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingFile || formData.attachments.length >= 5}
                />
                <label
                  htmlFor="quote-attachment"
                  className={`flex flex-col items-center justify-center cursor-pointer ${
                    uploadingFile || formData.attachments.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingFile ? (
                    <>
                      <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-2" />
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Paperclip className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload files</span>
                      <span className="text-xs text-gray-400 mt-1">Images, PDF, Word, Excel</span>
                    </>
                  )}
                </label>
              </div>

              {/* Uploaded Files List */}
              {formData.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{file.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="border-t border-gray-200 p-3 sm:p-6 flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Reject Quote Modal Component
const RejectQuoteModal = ({ quote, reason, setReason, category, setCategory, categories, onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4 sm:p-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Reject Quote</h2>
              <p className="text-red-100 text-xs sm:text-sm">Quote {quote.quoteId}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-hide">
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Are you sure you want to reject this quote? Both you and the admin will receive email notifications.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-1">Quote Details</p>
            <p className="text-gray-900 font-medium text-sm sm:text-base">{quote.productName}</p>
            {quote.supplierResponse?.quotedPrice && (
              <p className="text-teal-600 font-bold mt-0.5 sm:mt-1 text-sm sm:text-base">
                ${quote.supplierResponse.quotedPrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* Rejection Category Dropdown */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-sm"
            >
              <option value="">Select a reason...</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Details Textarea */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Additional Details {category === 'other' ? <span className="text-red-500">*</span> : '(Optional)'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                category === 'other' 
                  ? "Please describe your reason..." 
                  : "Any additional feedback..."
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
              rows={3}
            />
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Your feedback helps improve future quotes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-6 flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || !category || (category === 'other' && !reason.trim())}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Confirm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardQuotes;
