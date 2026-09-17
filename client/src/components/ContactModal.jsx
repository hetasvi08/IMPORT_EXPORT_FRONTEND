import {
  AlertCircle,
  Building2,
  CheckCircle,
  Lightbulb,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Tag,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { submitContact } from '../services/operations/contactAPI';


const ContactModal = ({ isOpen, onClose, product, supplier }) => {
  const { user } = useSelector((state) => state.auth);
  const canViewSupplierIdentity = user?.role === 'admin' || user?.role === 'supplier';
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    company: user?.companyName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: product ? 'quote' : 'general',
    message: product ? `I'm interested in "${product.name}". Please provide more information about pricing, availability, and bulk order options.` : '',
    subscribeUpdates: false
  });
  const [errors, setErrors] = useState({});
  const modalRoot = typeof document !== 'undefined' ? document.body : null;

  if (!isOpen || !modalRoot) return null;

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'quote', label: 'Request a Quote' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Business Partnership' },
    { value: 'complaint', label: 'Complaint' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message?.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare message with product/supplier context
      let enrichedMessage = formData.message;
      if (product) {
        enrichedMessage = `[Product Inquiry: ${product.name}]\n\n${formData.message}`;
        if (canViewSupplierIdentity && (supplier || product.supplier)) {
          const supplierName = supplier?.companyName || product.supplier?.companyName || product.supplier?.name;
          enrichedMessage = `[Supplier: ${supplierName}]\n${enrichedMessage}`;
        }
      }

      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company?.trim() || '',
        subject: subjectOptions.find(s => s.value === formData.subject)?.label || formData.subject,
        message: enrichedMessage,
        type: formData.subject
      });

      setSuccess(true);
    } catch (error) {
} finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setErrors({});
    onClose();
  };

  // Success state
  if (success) {
    return createPortal(
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-600 mb-6">
              You'll receive a confirmation email and we'll respond within 2-4 hours.
            </p>
            <button
              onClick={handleClose}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Done
            </button>
          </div>
        </div>
      </div>,
      modalRoot
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fadeIn border border-slate-200">
        {/* Header - Sticky */}
        <div className="flex-shrink-0 relative p-6 pb-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl z-10">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <h2 className="text-2xl font-black text-white">Send Us a Message</h2>
          <p className="text-purple-100 mt-1">
            Fill out the form and we'll respond within 24 hours. Fields marked with * are required.
          </p>

          {product && (
            <div className="mt-3 p-3 bg-white/15 rounded-lg border border-white/20 flex items-center gap-3">
              {product.images?.[0]?.url && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Inquiry about: {product.name}
                </p>
                {canViewSupplierIdentity && (supplier || product.supplier) && (
                  <p className="text-xs text-purple-200 truncate">
                    Supplier: {supplier?.companyName || product.supplier?.companyName || product.supplier?.name}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form - Scrollable content with hidden scrollbar */}
        <form onSubmit={handleSubmit} className="contact-modal-scroll p-6 pt-2 space-y-4 overflow-y-auto flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.contact-modal-scroll::-webkit-scrollbar { display: none; }`}</style>
          {/* Name and Company Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 text-slate-400" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                } focus:border-purple-500 focus:outline-none transition-colors`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                Company Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company Ltd."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                } focus:border-purple-500 focus:outline-none transition-colors`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Phone className="w-4 h-4 text-slate-400" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your number"
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                } focus:border-purple-500 focus:outline-none transition-colors`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Tag className="w-4 h-4 text-slate-400" />
              How can we help you? *
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.subject ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
              } focus:border-purple-500 focus:outline-none transition-colors appearance-none cursor-pointer`}
            >
              <option value="">Select a subject</option>
              {subjectOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Your Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us more about your inquiry or how we can help you..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.message ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
              } focus:border-purple-500 focus:outline-none transition-colors resize-none`}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
            <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">Tip: Include as much detail as possible for a faster response</p>
          </div>

          {/* Subscribe Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="subscribeUpdates"
              checked={formData.subscribeUpdates}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
              I'd like to receive updates, news, and special offers from Nexarion via email
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>

          {/* Footer Note */}
          <p className="text-center text-sm text-slate-500 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            You'll receive a confirmation email and we'll respond within 2-4 hours
          </p>
        </form>
      </div>
    </div>,
    modalRoot
  );
};

export default ContactModal;
