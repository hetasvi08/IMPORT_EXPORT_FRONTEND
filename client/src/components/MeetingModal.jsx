import { AnimatePresence } from 'framer-motion';
import {
  Building2,
  Calendar,
  CalendarDays,
  Clock,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  User,
  Video,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { bookMeeting } from '../services/operations/contactAPI';

const MeetingModal = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.auth?.user || state.profile?.user);
  const [bookingMeeting, setBookingMeeting] = useState(false);
  const [meetingData, setMeetingData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    meetingType: 'demo',
    preferredDate: '',
    preferredTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notes: ''
  });

  useEffect(() => {
    if (user) {
      setMeetingData(prev => ({
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
      setMeetingData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        meetingType: 'demo',
        preferredDate: '',
        preferredTime: '',
        notes: ''
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

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setBookingMeeting(true);
      await bookMeeting(meetingData);
      onClose();
      setMeetingData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: user?.company || '',
        meetingType: 'demo',
        preferredDate: '',
        preferredTime: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notes: ''
      });
    } catch (error) {
    } finally {
      setBookingMeeting(false);
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
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-t-3xl p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="text-white" size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Video className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Book a Free Meeting</h2>
                    <p className="text-white/90 text-sm">Schedule a personalized demo or consultation</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <User size={16} className="text-amber-500" /> Full Name *
                    </label>
                    <input type="text" name="name" value={meetingData.name} onChange={handleChange} required placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Mail size={16} className="text-amber-500" /> Email Address *
                    </label>
                    <input type="email" name="email" value={meetingData.email} onChange={handleChange} required placeholder="Enter your email address"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Phone size={16} className="text-amber-500" /> Phone Number
                    </label>
                    <input type="tel" name="phone" value={meetingData.phone} onChange={handleChange} placeholder="+91 9XXXXXXXXX"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Building2 size={16} className="text-amber-500" /> Company Name
                    </label>
                    <input type="text" name="company" value={meetingData.company} onChange={handleChange} placeholder="Enter your company name"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Video size={16} className="text-amber-500" /> Meeting Type *
                  </label>
                  <select name="meetingType" value={meetingData.meetingType} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all">
                    <option value="demo">Product Demo</option>
                    <option value="consultation">Business Consultation</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Discussion</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <CalendarDays size={16} className="text-amber-500" /> Preferred Date *
                    </label>
                    <input type="date" name="preferredDate" value={meetingData.preferredDate} onChange={handleChange} required min={getMinDate()}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Clock size={16} className="text-amber-500" /> Preferred Time *
                    </label>
                    <select name="preferredTime" value={meetingData.preferredTime} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all">
                      <option value="">Select a time slot</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-2 text-sm text-amber-800">
                  <Globe size={16} />
                  <span>Your timezone: <strong>{meetingData.timezone}</strong></span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <MessageCircle size={16} className="text-amber-500" /> Additional Notes
                  </label>
                  <textarea name="notes" value={meetingData.notes} onChange={handleChange} rows="3" placeholder="Tell us what you'd like to discuss in the meeting..."
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all resize-none"></textarea>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-green-800">100% Free - No Obligation</p>
                    <p className="text-sm text-green-700">This meeting is completely free. No credit card required.</p>
                  </div>
                </div>

                <button type="submit" disabled={bookingMeeting}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-black text-base hover:shadow-2xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {bookingMeeting ? (
                    <><Loader2 size={20} className="animate-spin" /> Booking...</>
                  ) : (
                    <><Calendar size={20} /> Book Meeting</>
                  )}
                </button>
                <p className="text-xs text-center text-slate-500">📧 You'll receive a confirmation email with meeting details</p>
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

export default MeetingModal;
