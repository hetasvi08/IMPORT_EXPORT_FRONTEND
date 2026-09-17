import { useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import {
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  FileText,
  GraduationCap,
  Headphones,
  Languages,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Truck
} from 'lucide-react';
import MeetingModal from '../../components/MeetingModal';
import QueryModal from '../../components/QueryModal';
import { SUPPORT_CONTACT_NUMBERS_TEXT, WHATSAPP_API_URL } from '../../utils/whatsapp';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AnimatedSection = ({ children, variants = fadeInUp, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const ServicesPage = () => {
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const handleContactSupport = () => {
    window.open(`${WHATSAPP_API_URL}&text=Hi, I need support with your services.`, '_blank');
  };

  const handleRaiseQuery = () => {
    setShowQueryModal(true);
  };

  const handleScheduleCall = () => {
    setShowMeetingModal(true);
  };

  const mainServices = [
    {
      title: 'Export Partner Assessment',
      description: 'Comprehensive partner assessment process ensuring export readiness, quality standards, and business legitimacy.',
      icon: ShieldCheck,
      gradient: 'from-indigo-500 via-purple-500 to-purple-600',
      bg: 'from-indigo-50 via-purple-50 to-indigo-100/50',
      border: 'border-indigo-200 hover:border-indigo-400',
      checkColor: 'text-indigo-600',
      btnGradient: 'from-indigo-500 to-purple-600',
      features: [
        'Business license verification',
        'Factory readiness audit',
        'Product sample testing',
        'Export document validation'
      ]
    },
    {
      title: 'Payment Protection',
      description: 'Secure escrow service with $10M insurance coverage protecting every transaction.',
      icon: Lock,
      gradient: 'from-purple-500 via-pink-500 to-rose-600',
      bg: 'from-purple-50 via-pink-50 to-purple-100/50',
      border: 'border-purple-200 hover:border-purple-400',
      checkColor: 'text-purple-600',
      btnGradient: 'from-purple-500 to-pink-600',
      features: [
        'Escrow payment holding',
        'PCI DSS compliant security',
        'Dispute resolution support',
        '100% money-back guarantee'
      ]
    },
    {
      title: 'Trade Intelligence Hub',
      description: 'Get curated market and import-export insights to make faster, smarter sourcing decisions.',
      icon: Brain,
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
      bg: 'from-cyan-50 via-blue-50 to-cyan-100/50',
      border: 'border-cyan-200 hover:border-cyan-400',
      checkColor: 'text-cyan-600',
      btnGradient: 'from-cyan-500 to-blue-600',
      features: [
        'Verified market insights',
        'Detailed product intelligence',
        'Category-wise demand trends',
        'Trade route comparison tools'
      ]
    },
    {
      title: 'Logistics Management',
      description: 'End-to-end logistics planning and shipment coordination for smooth international deliveries.',
      icon: Truck,
      gradient: 'from-amber-500 via-orange-500 to-red-600',
      bg: 'from-amber-50 via-orange-50 to-amber-100/50',
      border: 'border-amber-200 hover:border-amber-400',
      checkColor: 'text-amber-600',
      btnGradient: 'from-amber-500 to-orange-600',
      features: [
        'Shipment planning and coordination',
        'Real-time shipment tracking',
        'Customs documentation support',
        'Delivery milestone monitoring'
      ]
    },
    {
      title: 'Quality Inspection',
      description: 'Professional third-party inspection services ensuring products meet your specifications.',
      icon: ClipboardCheck,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      bg: 'from-emerald-50 via-teal-50 to-emerald-100/50',
      border: 'border-emerald-200 hover:border-emerald-400',
      checkColor: 'text-emerald-600',
      btnGradient: 'from-emerald-500 to-teal-600',
      features: [
        'Pre-shipment inspection',
        'Quality control reports',
        'Product testing & certification',
        'Factory compliance audit'
      ]
    },
    {
      title: 'Dispute Resolution',
      description: 'Professional mediation and dispute resolution services for smooth business transactions.',
      icon: DollarSign,
      gradient: 'from-violet-500 via-fuchsia-500 to-pink-600',
      bg: 'from-violet-50 via-fuchsia-50 to-violet-100/50',
      border: 'border-violet-200 hover:border-violet-400',
      checkColor: 'text-violet-600',
      btnGradient: 'from-violet-500 to-fuchsia-600',
      features: [
        'Neutral dispute mediation',
        'Fair settlement negotiations',
        'Documented agreements',
        'Quick resolution process'
      ]
    }
  ];

  const additionalServices = [
    {
      title: 'Effective Communication Support',
      description: 'Fast, reliable communication support to ensure clear understanding between clients and trade partners',
      icon: Languages,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 to-indigo-100/60',
      border: 'border-blue-200 hover:border-blue-400'
    },
    {
      title: 'Legal Support',
      description: 'Contract review and legal consultation for international trade',
      icon: FileText,
      gradient: 'from-purple-500 to-pink-600',
      bg: 'from-purple-50 to-pink-100/60',
      border: 'border-purple-200 hover:border-purple-400'
    },
    {
      title: 'Market Intelligence',
      description: 'Real-time market trends, pricing data, and competitor analysis',
      icon: BarChart3,
      gradient: 'from-amber-500 to-orange-600',
      bg: 'from-amber-50 to-orange-100/60',
      border: 'border-amber-200 hover:border-amber-400'
    },
    {
      title: 'Training & Webinars',
      description: 'Educational resources to master international trade practices',
      icon: GraduationCap,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-50 to-teal-100/60',
      border: 'border-emerald-200 hover:border-emerald-400'
    }
  ];

  const contactMethods = [
    {
      title: 'Email Us',
      value: 'contact@nexarionimpex.com',
      icon: Mail,
      gradient: 'from-indigo-500 to-purple-600',
      bg: 'from-indigo-50 to-purple-100/60',
      border: 'border-indigo-200 hover:border-indigo-400'
    },
    {
      title: 'Call Us',
      value: SUPPORT_CONTACT_NUMBERS_TEXT,
      icon: Phone,
      gradient: 'from-purple-500 to-pink-600',
      bg: 'from-purple-50 to-pink-100/60',
      border: 'border-purple-200 hover:border-purple-400'
    },
    {
      title: 'WhatsApp',
      value: SUPPORT_CONTACT_NUMBERS_TEXT,
      icon: MessageSquare,
      gradient: 'from-green-500 to-emerald-600',
      bg: 'from-green-50 to-emerald-100/60',
      border: 'border-green-200 hover:border-green-400'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 pt-24 pb-8 md:pt-28 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-5 py-2 mb-5">
              <p className="font-bold text-xs uppercase tracking-wide">Our Services</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Comprehensive Import-Export <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Solutions</span>
            </h1>
            <p className="text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to succeed in international trade - from export readiness checks to logistics management
            </p>
          </div>
        </div>
      </div>

      {/* Main Services Grid */}
      <div className="py-6 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <AnimatedSection variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Core Services</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">Powerful tools designed to streamline your global trading operations</p>
          </AnimatedSection>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {mainServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div key={index} className="group relative h-full" variants={fadeInUp}>
                  <div className={`absolute -top-3 -left-3 w-24 h-24 bg-gradient-to-br ${service.gradient.replace('via-', 'to-')} rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}></div>

                  <div className={`relative bg-gradient-to-br ${service.bg} rounded-[30px] p-5 border-2 ${service.border} hover:shadow-2xl hover:-translate-y-2 transition-all h-full flex flex-col`}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      <IconComponent className="text-white" size={28} />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-5">{service.description}</p>

                    <ul className="space-y-2 mb-5 flex-grow">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className={`${service.checkColor} mt-0.5 flex-shrink-0`} size={14} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full bg-gradient-to-r ${service.btnGradient} text-white font-bold text-sm py-3 rounded-xl hover:shadow-lg transition-all mt-auto`}>
                      Learn More →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="py-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variants={scaleIn} className="relative">
            {/* Decorative circles */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-sm rounded-[30px] p-6 border-2 border-indigo-200 shadow-2xl text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6">
                <Headphones className="text-white" size={36} />
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Need Help Choosing?</h2>
              <p className="text-sm text-slate-700 leading-relaxed mb-5 max-w-2xl mx-auto">
                Our expert team is here to help you find the perfect service package for your business needs. Get personalized recommendations and answers to all your questions.
              </p>

              {/* 3 Buttons */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={handleContactSupport}
                  className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 text-white px-6 py-4 rounded-xl font-black text-sm hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <Phone size={18} />
                  Contact Support
                </button>

                <button
                  onClick={handleRaiseQuery}
                  className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-white px-6 py-4 rounded-xl font-black text-sm hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <MessageSquare size={18} />
                  Raise a Query
                </button>

                <button
                  onClick={handleScheduleCall}
                  className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white px-6 py-4 rounded-xl font-black text-sm hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <Calendar size={18} />
                  Schedule Call
                </button>
              </div>

              {/* Contact Info */}
              <motion.div
                className="grid md:grid-cols-3 gap-4 pt-5 border-t border-indigo-200"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <motion.div
                      key={index}
                      className={`bg-gradient-to-br ${method.bg} rounded-xl p-4 border-2 ${method.border} hover:shadow-lg transition-all group`}
                      variants={fadeInUp}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${method.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <p className="text-sm font-black text-slate-900 mb-2">{method.title}</p>
                      <p className="text-xs text-slate-700 font-semibold">{method.value}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Additional Services Section */}
      <div className="py-6 bg-gradient-to-r from-slate-50 to-indigo-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Additional Services</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">Supporting services to enhance your trading experience</p>
          </AnimatedSection>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {additionalServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${service.bg} rounded-[20px] p-4 border-2 ${service.border} hover:shadow-lg hover:scale-105 transition-all group text-center`}
                  variants={fadeInUp}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{service.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Query Modal */}
      <QueryModal
        isOpen={showQueryModal}
        onClose={() => setShowQueryModal(false)}
      />

      {/* Meeting Modal */}
      <MeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
      />
    </div>
  );
};

export default ServicesPage;
