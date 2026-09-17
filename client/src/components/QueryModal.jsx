import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Tag,
  MessageCircle,
  Send,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { raiseQuery } from '../services/operations/contactAPI';

const QueryModal = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.auth?.user || state.profile?.user);
  const [submitting, setSubmitting] = useState(false);
  const [queryData, setQueryData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (user) {
      setQueryData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      setQueryData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        subject: '',
        message: ''
      }));
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQueryData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await raiseQuery(queryData);
      onClose();
      setQueryData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: user?.company || '',
        subject: '',
        message: ''
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 99998,
            }}
          />

          {/* Centering wrapper */}
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 99999,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="scrollbar-hide"
              style={{
                pointerEvents: 'auto',
                width: '100%',
                maxWidth: '672px',
                maxHeight: '85vh',
                overflowY: 'auto',
                backgroundColor: '#fff',
                borderRadius: '24px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-3xl p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="text-white" size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <HelpCircle className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Raise a Query</h2>
                    <p className="text-white/90 text-sm">Submit your question and we'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <User size={16} className="text-indigo-500" /> Full Name *
                    </label>
                    <input type="text" name="name" value={queryData.name} onChange={handleChange} required placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Mail size={16} className="text-indigo-500" /> Email Address *
                    </label>
                    <input type="email" name="email" value={queryData.email} onChange={handleChange} required placeholder="Enter your email address"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Phone size={16} className="text-indigo-500" /> Phone Number *
                    </label>
                    <input type="tel" name="phone" value={queryData.phone} onChange={handleChange} required placeholder="+91 9XXXXXXXXX"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Building2 size={16} className="text-indigo-500" /> Company Name
                    </label>
                    <input type="text" name="company" value={queryData.company} onChange={handleChange} placeholder="Enter your company name"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Tag size={16} className="text-indigo-500" /> Subject *
                  </label>
                  <select name="subject" value={queryData.subject} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all">
                    <option value="">Select a subject</option>
                    <option value="Service Inquiry">Service Inquiry</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Supplier Verification">Supplier Verification</option>
                    <option value="Quality Inspection">Quality Inspection</option>
                    <option value="Logistics & Shipping">Logistics & Shipping</option>
                    <option value="Pricing & Quotes">Pricing & Quotes</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership Inquiry">Partnership Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <MessageCircle size={16} className="text-indigo-500" /> Your Query *
                  </label>
                  <textarea name="message" value={queryData.message} onChange={handleChange} required rows="4" placeholder="Describe your query in detail..."
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all resize-none"></textarea>
                  <p className="text-xs text-slate-500 mt-2">💡 Tip: Include specific details for a faster and more accurate response</p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">⚡</span>
                  </div>
                  <div>
                    <p className="font-bold text-indigo-800">Quick Response Guaranteed</p>
                    <p className="text-sm text-indigo-700">We'll respond to your query within 24 hours via email</p>
                  </div>
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-black text-base hover:shadow-2xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {submitting ? (
                    <><Loader2 size={20} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Send size={20} /> Submit Query</>
                  )}
                </button>
                <p className="text-xs text-center text-slate-500">📧 You'll receive a confirmation email once your query is submitted</p>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // ✅ Portal: renders directly into document.body, bypasses ALL parent CSS transforms
  return createPortal(modalContent, document.body);
};

export default QueryModal;
