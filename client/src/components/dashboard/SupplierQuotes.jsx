import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Filter,
  Loader2,
  MessageSquare,
  Package,
  Search,
  Send,
  User,
  X,
  XCircle
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSupplierQuotes, respondToSupplierQuote } from '../../services/operations/supplierDashboardAPI';

const SupplierQuotes = () => {
  const { token } = useSelector((state) => state.auth);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responding, setResponding] = useState(false);
  const [responseData, setResponseData] = useState({
    status: 'accepted',
    price: '',
    message: '',
    validUntil: ''
  });

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };

      const response = await getSupplierQuotes(token, params);
      if (response.success) {
        setQuotes(response.data || []);
        setPagination({
          currentPage: response.page || 1,
          totalPages: response.pages || 1,
          total: response.total || 0
        });
      }
    } catch (error) {
// Don't show error toast for empty quotes
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, statusFilter, token]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!selectedQuote) return;

    try {
      setResponding(true);
      const response = await respondToSupplierQuote(selectedQuote._id, responseData, token);
      if (response.success) {

        setShowResponseModal(false);
        setResponseData({
          status: 'accepted',
          price: '',
          message: '',
          validUntil: ''
        });
        fetchQuotes();
      }
    } catch (error) {

    } finally {
      setResponding(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quoteNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.buyer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.product?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200',
      converted: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'converted':
        return <FileText className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const openResponseModal = (quote) => {
    setSelectedQuote(quote);
    setResponseData({
      status: 'accepted',
      price: quote.requestedPrice || '',
      message: '',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowResponseModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Quote Requests</h1>
          <p className="text-gray-600">Manage quote requests from buyers</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No quotes yet</h3>
          <p className="text-gray-500">
            {statusFilter !== 'all'
              ? `No ${statusFilter} quotes found`
              : "You haven't received any quote requests yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Quote #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Requested Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">#{quote.quoteNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{quote.buyer?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{quote.buyer?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {quote.product?.images?.[0]?.url ? (
                          <img
                            src={quote.product.images[0].url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {quote.product?.name || 'Product'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{quote.quantity} {quote.unit || 'units'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">
                        {quote.requestedPrice ? formatCurrency(quote.requestedPrice) : 'Negotiable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{formatDate(quote.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(quote.status)}`}>
                        {getStatusIcon(quote.status)}
                        {quote.status?.charAt(0).toUpperCase() + quote.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedQuote(quote);
                            setShowDetailModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {quote.status === 'pending' && (
                          <button
                            onClick={() => openResponseModal(quote)}
                            className="p-2 hover:bg-orange-100 rounded-lg text-orange-600 transition-colors"
                            title="Respond"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {(pagination.currentPage - 1) * 10 + 1} to{' '}
                {Math.min(pagination.currentPage * 10, pagination.total)} of {pagination.total} quotes
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 font-semibold">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quote Detail Modal */}
      {showDetailModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quote #{selectedQuote.quoteNumber}</h2>
                <p className="text-gray-500 text-sm">{formatDate(selectedQuote.createdAt)}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border ${getStatusBadge(selectedQuote.status)}`}>
                  {getStatusIcon(selectedQuote.status)}
                  {selectedQuote.status?.charAt(0).toUpperCase() + selectedQuote.status?.slice(1)}
                </span>
              </div>

              {/* Buyer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Buyer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedQuote.buyer?.name}</span></p>
                  <p><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedQuote.buyer?.email}</span></p>
                  {selectedQuote.buyer?.phone && (
                    <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedQuote.buyer?.phone}</span></p>
                  )}
                  {selectedQuote.buyer?.company && (
                    <p><span className="text-gray-500">Company:</span> <span className="font-medium">{selectedQuote.buyer?.company}</span></p>
                  )}
                </div>
              </div>

              {/* Product */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  Product Details
                </h3>
                <div className="flex items-center gap-4">
                  {selectedQuote.product?.images?.[0]?.url ? (
                    <img
                      src={selectedQuote.product.images[0].url}
                      alt=""
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900">{selectedQuote.product?.name}</p>
                    <p className="text-sm text-gray-600">SKU: {selectedQuote.product?.sku || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Quote Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Quantity</p>
                  <p className="text-lg font-bold text-gray-900">{selectedQuote.quantity} {selectedQuote.unit || 'units'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Requested Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedQuote.requestedPrice ? formatCurrency(selectedQuote.requestedPrice) : 'Negotiable'}
                  </p>
                </div>
              </div>

              {/* Message */}
              {selectedQuote.message && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Buyer's Message</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedQuote.message}</p>
                  </div>
                </div>
              )}

              {/* Response */}
              {selectedQuote.response && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Your Response</h3>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedQuote.response.message}</p>
                    {selectedQuote.response.price && (
                      <p className="mt-2 font-bold text-orange-600">
                        Offered Price: {formatCurrency(selectedQuote.response.price)}
                      </p>
                    )}
                    {selectedQuote.response.validUntil && (
                      <p className="text-sm text-gray-500 mt-1">
                        Valid until: {formatDate(selectedQuote.response.validUntil)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedQuote.status === 'pending' && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openResponseModal(selectedQuote);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    <Send className="w-5 h-5" />
                    Respond to Quote
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Respond to Quote</h2>
              <p className="text-gray-500 text-sm">Quote #{selectedQuote.quoteNumber}</p>
            </div>

            <form onSubmit={handleRespond} className="p-6 space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Response Type</label>
                <div className="flex gap-3">
                  <label className={`flex-1 p-3 border-2 rounded-xl cursor-pointer text-center transition-all ${
                    responseData.status === 'accepted'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="accepted"
                      checked={responseData.status === 'accepted'}
                      onChange={(e) => setResponseData(prev => ({ ...prev, status: e.target.value }))}
                      className="sr-only"
                    />
                    <CheckCircle className={`w-6 h-6 mx-auto mb-1 ${
                      responseData.status === 'accepted' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <span className={`font-semibold ${
                      responseData.status === 'accepted' ? 'text-green-700' : 'text-gray-600'
                    }`}>Accept</span>
                  </label>
                  <label className={`flex-1 p-3 border-2 rounded-xl cursor-pointer text-center transition-all ${
                    responseData.status === 'rejected'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="rejected"
                      checked={responseData.status === 'rejected'}
                      onChange={(e) => setResponseData(prev => ({ ...prev, status: e.target.value }))}
                      className="sr-only"
                    />
                    <XCircle className={`w-6 h-6 mx-auto mb-1 ${
                      responseData.status === 'rejected' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <span className={`font-semibold ${
                      responseData.status === 'rejected' ? 'text-red-700' : 'text-gray-600'
                    }`}>Reject</span>
                  </label>
                </div>
              </div>

              {/* Price */}
              {responseData.status === 'accepted' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Your Price (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={responseData.price}
                      onChange={(e) => setResponseData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Valid Until */}
              {responseData.status === 'accepted' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Quote Valid Until
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={responseData.validUntil}
                      onChange={(e) => setResponseData(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Message to Buyer
                </label>
                <textarea
                  value={responseData.message}
                  onChange={(e) => setResponseData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={responseData.status === 'accepted'
                    ? "Thank you for your interest. We're happy to offer you..."
                    : "Thank you for your inquiry. Unfortunately..."
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowResponseModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={responding}
                  className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl transition-all disabled:opacity-50 ${
                    responseData.status === 'accepted'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {responding ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Response
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierQuotes;
