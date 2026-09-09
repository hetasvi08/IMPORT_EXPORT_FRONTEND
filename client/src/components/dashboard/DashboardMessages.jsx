import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  MessageCircle,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Send,
  Paperclip,
  ArrowLeft,
  User,
  RefreshCw,
  Star,
  MessageSquare,
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  Settings,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { 
  getMyTickets, 
  getTicketById, 
  createTicket, 
  replyToTicket, 
  closeTicket,
  rateTicket 
} from '../../services/operations/supportTicketAPI';

const DashboardMessages = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  
  // State
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    department: 'support',
    message: ''
  });
  
  // Rating state
  const [rating, setRating] = useState({
    score: 5,
    feedback: ''
  });
  
  const messagesEndRef = useRef(null);

  // Fetch tickets
  useEffect(() => {
    fetchTickets();
  }, [token, statusFilter, categoryFilter, currentPage]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter })
      };
      
      const response = await getMyTickets(token, params);
      setTickets(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  // Fetch single ticket
  const fetchTicketDetails = async (ticketId) => {
    try {
      setTicketLoading(true);
      const response = await getTicketById(ticketId, token);
      setSelectedTicket(response.data);
      // Scroll to bottom of messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {} finally {
      setTicketLoading(false);
    }
  };

  // Create new ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await createTicket(newTicket, token);
      setShowNewTicketModal(false);
      setNewTicket({
        subject: '',
        category: 'general',
        priority: 'medium',
        department: 'support',
        message: ''
      });
      fetchTickets();
      // Select the new ticket
      if (response.data) {
        setSelectedTicket(response.data);
      }
    } catch (error) {}
  };

  // Reply to ticket
  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    try {
      setSendingReply(true);
      const response = await replyToTicket(selectedTicket._id, replyMessage, token);
      setSelectedTicket(response.data);
      setReplyMessage('');
      fetchTickets(); // Refresh list
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {} finally {
      setSendingReply(false);
    }
  };

  // Close ticket - show confirmation modal
  const handleCloseTicket = () => {
    setShowCloseModal(true);
  };

  // Confirm close ticket
  const confirmCloseTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      await closeTicket(selectedTicket._id, token);
      setShowCloseModal(false);
      fetchTicketDetails(selectedTicket._id);
      fetchTickets();
    } catch (error) {}
  };

  // Rate ticket
  const handleRateTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      await rateTicket(selectedTicket._id, rating, token);
      setShowRatingModal(false);
      fetchTicketDetails(selectedTicket._id);
    } catch (error) {}
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      'open': { bg: 'bg-blue-100', text: 'text-blue-800', icon: MessageSquare, label: 'Open' },
      'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'In Progress' },
      'waiting-reply': { bg: 'bg-purple-100', text: 'text-purple-800', icon: AlertCircle, label: 'Awaiting Reply' },
      'resolved': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2, label: 'Resolved' },
      'closed': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle, label: 'Closed' }
    };
    
    const { bg, text, icon: Icon, label } = config[status] || config['open'];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  // Priority badge
  const PriorityBadge = ({ priority }) => {
    const config = {
      'low': { bg: 'bg-gray-100', text: 'text-gray-600' },
      'medium': { bg: 'bg-blue-100', text: 'text-blue-600' },
      'high': { bg: 'bg-orange-100', text: 'text-orange-600' },
      'urgent': { bg: 'bg-red-100', text: 'text-red-600' }
    };
    
    const { bg, text } = config[priority] || config['medium'];
    
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text} capitalize`}>
        {priority}
      </span>
    );
  };

  // Category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'general': HelpCircle,
      'order': Package,
      'payment': CreditCard,
      'shipping': Truck,
      'product': Package,
      'technical': Settings,
      'account': User,
      'other': FileText
    };
    return icons[category] || HelpCircle;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  // Filter tickets by search
  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ticket.ticketId?.toLowerCase().includes(query) ||
      ticket.subject?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Stats */}
      <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 rounded-2xl p-3 sm:p-6 relative overflow-hidden border border-teal-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900">Support Center</h1>
                  <p className="text-gray-600 text-xs sm:text-sm">Get help from our dedicated support team</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Create New Ticket</span>
              <span className="sm:hidden">New Ticket</span>
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-xl w-fit mb-2 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <p className="text-blue-500 font-semibold text-xs sm:text-sm mb-1">Total Tickets</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{tickets.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-2 bg-amber-100 text-amber-600 text-[10px] sm:text-xs font-semibold rounded-full">Action</span>
              <div className="p-2 sm:p-3 bg-amber-50 rounded-xl w-fit mb-2 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              </div>
              <p className="text-amber-500 font-semibold text-xs sm:text-sm mb-1">Open</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{tickets.filter(t => t.status === 'open').length}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-2 bg-blue-100 text-blue-600 text-[10px] sm:text-xs font-semibold rounded-full">New</span>
              <div className="p-2 sm:p-3 bg-blue-50 rounded-xl w-fit mb-2 sm:mb-4">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <p className="text-blue-500 font-semibold text-xs sm:text-sm mb-1">In Progress</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{tickets.filter(t => t.status === 'in-progress').length}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-2 bg-green-100 text-green-600 text-[10px] sm:text-xs font-semibold rounded-full">Done</span>
              <div className="p-2 sm:p-3 bg-green-50 rounded-xl w-fit mb-2 sm:mb-4">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <p className="text-green-500 font-semibold text-xs sm:text-sm mb-1">Resolved</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="p-2 sm:p-3 bg-red-50 rounded-xl w-fit mb-2 sm:mb-4">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <p className="text-red-500 font-semibold text-xs sm:text-sm mb-1">Closed</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{tickets.filter(t => t.status === 'closed').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Search & Filters Bar */}
        <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700 text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="waiting-reply">Awaiting Reply</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700 text-sm sm:text-base"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="order">Order</option>
                <option value="payment">Payment</option>
                <option value="shipping">Shipping</option>
                <option value="product">Product</option>
                <option value="technical">Technical</option>
                <option value="account">Account</option>
              </select>
              <button
                onClick={fetchTickets}
                className="px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tickets Display */}
        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-20">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-spin" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-12 sm:py-20 px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Tickets Found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">You haven't created any support tickets yet. Need help? We're here for you!</p>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create Your First Ticket
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tickets Grid */}
            <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filteredTickets.map((ticket) => {
                const CategoryIcon = getCategoryIcon(ticket.category);
                return (
                  <button
                    key={ticket._id}
                    onClick={() => fetchTicketDetails(ticket._id)}
                    className={`w-full p-3.5 sm:p-5 text-left transition-all rounded-2xl border-2 hover:shadow-lg group ${
                      selectedTicket?._id === ticket._id 
                        ? 'bg-blue-50 border-blue-500 shadow-lg' 
                        : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className={`p-2 sm:p-2.5 rounded-xl ${
                        ticket.status === 'open' ? 'bg-yellow-100' :
                        ticket.status === 'in-progress' ? 'bg-blue-100' :
                        ticket.status === 'waiting-reply' ? 'bg-orange-100' :
                        ticket.status === 'resolved' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <CategoryIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          ticket.status === 'open' ? 'text-yellow-600' :
                          ticket.status === 'in-progress' ? 'text-blue-600' :
                          ticket.status === 'waiting-reply' ? 'text-orange-600' :
                          ticket.status === 'resolved' ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex items-center gap-2">
                        {ticket.hasUnreadByUser && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                            New
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{formatRelativeTime(ticket.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Ticket ID */}
                    <span className="inline-block text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg mb-2">
                      {ticket.ticketId}
                    </span>

                    {/* Subject */}
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {ticket.subject}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-lg">
                        {ticket.category}
                      </span>
                    </div>

                    {/* Messages count indicator */}
                    <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {ticket.messages?.length || 1} message{(ticket.messages?.length || 1) !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                        View conversation →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-3 sm:p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white font-medium text-gray-700 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">← Previous</span>
                  <span className="sm:hidden">←</span>
                </button>
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-bold transition-colors text-xs sm:text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white font-medium text-gray-700 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Next →</span>
                  <span className="sm:hidden">→</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Selected Ticket Modal/Slide-over */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center p-0 sm:p-4 bg-black/50 overflow-y-auto" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-4xl shadow-2xl sm:my-8 flex flex-col max-h-[92vh] sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Conversation Header */}
            <div className="px-3 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-teal-50 rounded-t-2xl flex-shrink-0">
              <div className="flex items-start sm:items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-xl transition-colors flex-shrink-0"
                  title="Back to tickets"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-teal-600 bg-teal-100 px-1.5 sm:px-2 py-0.5 rounded">{selectedTicket.ticketId}</span>
                    <StatusBadge status={selectedTicket.status} />
                    <PriorityBadge priority={selectedTicket.priority} />
                  </div>
                  <h2 className="text-sm sm:text-lg font-bold text-gray-900 truncate">{selectedTicket.subject}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 capitalize">{selectedTicket.category} • {selectedTicket.department}</p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => fetchTicketDetails(selectedTicket._id)}
                    className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  {['resolved', 'closed'].includes(selectedTicket.status) && !selectedTicket.rating && (
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl text-xs sm:text-sm font-bold"
                    >
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Rate
                    </button>
                  )}
                  {!['resolved', 'closed'].includes(selectedTicket.status) && (
                    <button
                      onClick={handleCloseTicket}
                      className="px-2 py-1.5 sm:px-4 sm:py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs sm:text-sm font-medium text-gray-700"
                    >
                      <span className="hidden sm:inline">Close Ticket</span>
                      <span className="sm:hidden">Close</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-1.5 sm:p-2 hover:bg-red-100 rounded-xl text-gray-500 hover:text-red-600 transition-colors"
                    title="Close"
                  >
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              
              {/* Assigned To Info */}
              {selectedTicket.assignedTo && (
                <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Assigned to: <strong>{selectedTicket.assignedTo.name}</strong></span>
                  {selectedTicket.assignedTo.adminRole && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                      {selectedTicket.assignedTo.adminRole}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50">
              {ticketLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                selectedTicket.messages?.map((message, index) => {
                  const isUser = message.senderRole === 'user';
                  return (
                    <div
                      key={message._id || index}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                          {!isUser && (
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {message.sender?.name?.charAt(0) || 'S'}
                              </span>
                            </div>
                          )}
                          <span className="text-xs font-medium text-gray-700">
                            {isUser ? 'You' : (message.sender?.name || 'Support Team')}
                          </span>
                          {!isUser && message.senderRole !== 'user' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded capitalize">
                              {message.senderRole}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <div className={`p-4 rounded-2xl ${
                          isUser 
                            ? 'bg-blue-600 text-white rounded-br-md' 
                            : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            {!['closed'].includes(selectedTicket.status) ? (
              <div className="p-3 sm:p-4 border-t border-gray-100 bg-white rounded-b-2xl flex-shrink-0">
                <div className="flex items-end gap-2 sm:gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={2}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReply();
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleReply}
                    disabled={!replyMessage.trim() || sendingReply}
                    className="p-2.5 sm:p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                  >
                    {sendingReply ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">Press Enter to send, Shift+Enter for new line</p>
              </div>
            ) : (
              <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50 text-center rounded-b-2xl flex-shrink-0">
                <p className="text-sm sm:text-base text-gray-500">This ticket is closed. You can create a new ticket if you need further assistance.</p>
              </div>
            )}

            {/* Rating Display */}
            {selectedTicket.rating && (
              <div className="px-4 py-3 sm:px-6 sm:py-4 bg-green-50 border-t border-green-100 rounded-b-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-medium text-green-800">Your Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= selectedTicket.rating.score
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {selectedTicket.rating.feedback && (
                  <p className="text-sm text-green-700 italic">"{selectedTicket.rating.feedback}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Create New Ticket</h2>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateTicket} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 sm:px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Related</option>
                    <option value="payment">Payment Issue</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="product">Product Question</option>
                    <option value="technical">Technical Support</option>
                    <option value="account">Account Related</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={newTicket.department}
                  onChange={(e) => setNewTicket({ ...newTicket, department: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="support">Customer Support</option>
                  <option value="sales">Sales Team</option>
                  <option value="billing">Billing Department</option>
                  <option value="technical">Technical Team</option>
                  <option value="shipping">Shipping Department</option>
                  <option value="management">Management</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full px-3 py-2 sm:px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
                />
              </div>
              <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-3 py-2 sm:px-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm sm:text-base"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Rate Your Experience</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">How was our support?</p>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex justify-center gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating({ ...rating, score: star })}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                        star <= rating.score
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (Optional)</label>
                <textarea
                  rows={3}
                  value={rating.feedback}
                  onChange={(e) => setRating({ ...rating, feedback: e.target.value })}
                  placeholder="Tell us about your experience..."
                  className="w-full px-3 py-2 sm:px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
                />
              </div>
              <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="px-3 py-2 sm:px-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                  Skip
                </button>
                <button
                  onClick={handleRateTicket}
                  className="px-4 py-2 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm sm:text-base"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Ticket Confirmation Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Close Ticket</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Are you sure you want to close this support ticket?</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-amber-800">This action will close the ticket</p>
                    <p className="text-xs sm:text-sm text-amber-700 mt-1">You can still view the conversation but won't be able to send new messages.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="px-3 py-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCloseTicket}
                  className="px-4 py-2 sm:px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm sm:text-base"
                >
                  Close Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMessages;
