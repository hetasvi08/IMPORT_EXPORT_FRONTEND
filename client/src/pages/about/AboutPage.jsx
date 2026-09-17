import { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import {
  Award,
  BookOpen,
  Brain,
  Globe,
  Handshake,
  Headphones,
  Leaf,
  Lightbulb,
  LineChart,
  Lock,
  MapPin,
  MessageCircle,
  Rocket,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  Truck,
  UserCircle,
  Users
} from 'lucide-react';
import useSiteStats from '../../hooks/useSiteStats';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
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

const AboutPage = () => {
  const { getStatValue } = useSiteStats();

  const stats = [
    { value: getStatValue('activeUsers') || '450+', label: 'Active Users', gradient: 'from-emerald-600 to-teal-600', bg: 'from-emerald-50 to-teal-100/70', border: 'border-emerald-200 group-hover:border-emerald-400' },
    { value: getStatValue('verifiedSuppliers') || '45+', label: 'Verified Trade Partners', gradient: 'from-amber-600 to-orange-600', bg: 'from-amber-50 to-orange-100/70', border: 'border-amber-200 group-hover:border-amber-400' },
    { value: getStatValue('countries') || '7+', label: 'Countries Served', gradient: 'from-cyan-600 to-blue-600', bg: 'from-cyan-50 to-blue-100/70', border: 'border-cyan-200 group-hover:border-cyan-400' },
    { value: getStatValue('satisfactionRate') || '98%', label: 'Customer Satisfaction', gradient: 'from-purple-600 to-pink-600', bg: 'from-purple-50 to-pink-100/70', border: 'border-purple-200 group-hover:border-purple-400' }
  ];

  const storyPoints = [
    {
      icon: MapPin,
      text: 'Founded in 2024 in Gujarat, India, Nexarion Global Exports emerged from a simple observation: businesses need reliable partners for international trade.',
      gradient: 'from-indigo-500 to-purple-600',
      highlight: 'Founded in 2024',
      color: 'indigo'
    },
    {
      icon: Lightbulb,
      text: 'Our team, passionate about connecting businesses globally, built a platform that prioritizes trust, transparency, and efficiency in every transaction.',
      gradient: 'from-purple-500 to-pink-600',
      highlight: 'trust, transparency, and efficiency',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      text: 'We help businesses source high-quality export products with dependable processes, clear communication, and timely delivery support.',
      gradient: 'from-cyan-500 to-blue-600',
      highlight: 'high-quality export products',
      color: 'blue'
    },
    {
      icon: Globe,
      text: 'Based in Gujarat, India, we serve clients across multiple countries and continue to expand our global import-export network.',
      gradient: 'from-amber-500 to-orange-600',
      highlight: 'Gujarat, India',
      color: 'amber'
    }
  ];

  const certifications = [
    { title: 'Quality Assured Products', subtitle: 'High-quality products with strict standards', icon: Award, gradient: 'from-indigo-500 via-purple-500 to-purple-600' },
    { title: 'Secure Payment Options', subtitle: 'Safe and reliable payment processing', icon: Shield, gradient: 'from-purple-500 via-pink-500 to-rose-600' },
    { title: '24/7 Customer Support', subtitle: 'Our team is always ready to assist you', icon: Headphones, gradient: 'from-cyan-500 via-blue-500 to-indigo-600' },
    { title: 'Reliable Logistics', subtitle: 'Trusted shipping partners worldwide', icon: Truck, gradient: 'from-amber-500 via-orange-500 to-red-600' },
    { title: 'Buyer Protection', subtitle: 'Secure transactions with dispute support', icon: Lock, gradient: 'from-emerald-500 via-teal-500 to-cyan-600' },
    { title: 'Smart Product Matching', subtitle: 'Find the right products for your business goals', icon: Brain, gradient: 'from-violet-500 via-fuchsia-500 to-pink-600' }
  ];

  const missionPoints = [
    { icon: Target, text: 'Quality products at competitive prices', gradient: 'from-blue-500 to-indigo-600' },
    { icon: Shield, text: 'Transparent & trustworthy trading', gradient: 'from-indigo-500 to-purple-600' },
    { icon: Handshake, text: 'Long-term business relationships', gradient: 'from-purple-500 to-pink-600' }
  ];

  const visionPoints = [
    { icon: Globe, text: 'Expand to more countries worldwide', gradient: 'from-orange-500 to-amber-600' },
    { icon: Brain, text: 'Build a trusted global trade network', gradient: 'from-amber-500 to-yellow-600' },
    { icon: Leaf, text: 'Promote sustainable trade practices', gradient: 'from-yellow-500 to-orange-600' }
  ];

  const values = [
    { title: 'Trust & Integrity', description: 'Every export process follows strict quality and compliance checks', icon: Award, gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-100/60', border: 'border-emerald-200 hover:border-emerald-400' },
    { title: 'Innovation', description: 'Modern platform with easy-to-use tools for traders', icon: Lightbulb, gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-100/60', border: 'border-amber-200 hover:border-amber-400' },
    { title: 'Customer Success', description: 'Dedicated support to ensure your satisfaction', icon: Users, gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-100/60', border: 'border-cyan-200 hover:border-cyan-400' },
    { title: 'Sustainability', description: 'Supporting eco-friendly products and practices', icon: Leaf, gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-100/60', border: 'border-purple-200 hover:border-purple-400' }
  ];

  const team = [
    { name: 'Our Team', role: 'Export Specialists', bio: 'Experienced in international trade', gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-100/60', border: 'border-emerald-200 hover:border-emerald-400', roleColor: 'text-emerald-600', hoverColor: 'hover:bg-emerald-500' },
    { name: 'Quality Team', role: 'Product Verification', bio: 'Ensuring quality standards', gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-100/60', border: 'border-amber-200 hover:border-amber-400', roleColor: 'text-amber-600', hoverColor: 'hover:bg-amber-500' },
    { name: 'Support Team', role: 'Customer Success', bio: '24/7 assistance for clients', gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-100/60', border: 'border-cyan-200 hover:border-cyan-400', roleColor: 'text-cyan-600', hoverColor: 'hover:bg-cyan-500' },
    { name: 'Logistics Team', role: 'Shipping & Delivery', bio: 'Reliable worldwide delivery', gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-100/60', border: 'border-purple-200 hover:border-purple-400', roleColor: 'text-purple-600', hoverColor: 'hover:bg-purple-500' }
  ];

  const features = [
    { title: 'Export Readiness Checks', description: 'Business verification, product sample review, and documentation checks for smooth international shipments', icon: ShieldCheck, gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-100/60', border: 'border-emerald-200' },
    { title: 'Secure Payments', description: 'Your payment is processed securely with multiple payment options and buyer protection', icon: Lock, gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-100/60', border: 'border-amber-200' },
    { title: 'Dedicated Support', description: 'Our support team is available to help you with any queries via WhatsApp, email, or phone', icon: MessageCircle, gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-100/60', border: 'border-cyan-200' },
    { title: 'Market Insights', description: 'Get information about products, pricing trends, and import-export opportunities from our experienced team', icon: LineChart, gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-100/60', border: 'border-purple-200' },
    { title: 'Reliable Logistics', description: 'Partnered with trusted shipping providers for real-time tracking and customs clearance assistance', icon: Truck, gradient: 'from-pink-500 to-rose-600', bg: 'from-pink-50 to-rose-100/60', border: 'border-pink-200' },
    { title: 'Trade Assurance', description: 'We support every order with dispute resolution assistance if products do not match agreement terms', icon: Handshake, gradient: 'from-indigo-500 to-blue-600', bg: 'from-indigo-50 to-blue-100/60', border: 'border-indigo-200' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 pt-24 pb-8 md:pt-28 md:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-5">
              <p className="font-bold text-xs uppercase tracking-wide">About Nexarion</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Connecting Global <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Trade Partners</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={fadeInUp}
              >
                <div className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm rounded-xl p-3 shadow-md hover:shadow-lg transition-all border-2 ${stat.border} flex flex-col items-center justify-center min-h-[90px]`}>
                  <div className={`text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-600 text-center leading-tight">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <AnimatedSection variants={fadeInUp} className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-5 py-2 mb-4 shadow-lg">
              <p className="font-bold text-xs uppercase tracking-wide">Our Journey</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">The Nexarion Story</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">From a simple idea to a trusted global import-export company</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-5 items-center">
            {/* Left Side - Story Content */}
            <AnimatedSection variants={slideInLeft} className="relative group">
              {/* Decorative Background */}
              <div className="absolute -top-4 -left-4 w-28 h-28 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>

              <div className="relative bg-gradient-to-br from-white/90 via-indigo-50/40 to-purple-50/30 backdrop-blur-sm rounded-[30px] p-5 border-2 border-indigo-200/60 shadow-2xl hover:shadow-3xl transition-all">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all flex-shrink-0">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">Our Story</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                      <p className="text-xs text-indigo-600 font-bold">Since 2024</p>
                    </div>
                  </div>
                </div>

                {/* Story Content */}
                <div className="space-y-4">
                  {storyPoints.map((point, index) => {
                    const IconComponent = point.icon;
                    return (
                      <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 hover:border-indigo-300 transition-all">
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 bg-gradient-to-br ${point.gradient} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <IconComponent className="text-white" size={14} />
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {point.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-indigo-200">
                  <div className="text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{getStatValue('activeUsers') || '450+'}</div>
                    <p className="text-xs text-slate-600 font-semibold">Users</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{getStatValue('verifiedSuppliers') || '45+'}</div>
                    <p className="text-xs text-slate-600 font-semibold">Trade Partners</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{getStatValue('countries') || '7+'}</div>
                    <p className="text-xs text-slate-600 font-semibold">Countries</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right Side - Certifications */}
            <motion.div
              className="grid grid-cols-1 gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {certifications.map((cert, index) => {
                const IconComponent = cert.icon;
                return (
                  <motion.div
                    key={index}
                    className={`group relative overflow-hidden bg-gradient-to-br ${cert.gradient} rounded-[25px] p-4 shadow-xl hover:shadow-2xl transition-all`}
                    variants={fadeInUp}
                  >
                    <div className="relative flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <IconComponent className="text-white" size={28} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white mb-1">{cert.title}</h3>
                        <p className="text-xs text-white/90">{cert.subtitle}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-6 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <AnimatedSection variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Mission & Vision</h2>
            <p className="text-sm text-slate-600">Our purpose and future direction</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Mission Card */}
            <AnimatedSection variants={slideInLeft} className="relative group">
              <div className="absolute -top-3 -left-3 w-24 h-24 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -bottom-3 -right-3 w-28 h-28 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>

              <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50/50 rounded-[30px] p-5 shadow-xl border-2 border-blue-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-40"></div>

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all flex-shrink-0">
                      <Target className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1">Our Mission</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        <p className="text-xs text-indigo-600 font-bold">What drives us</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed mb-6">
                    To help businesses source high-quality products at competitive prices through dependable import-export operations. We aim to simplify international trade, build long-term relationships, and deliver transparent service where businesses can grow confidently.
                  </p>

                  <div className="space-y-3">
                    {missionPoints.map((point, index) => {
                      const IconComponent = point.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-blue-200/50 hover:border-blue-400 transition-all group/item">
                          <div className={`w-8 h-8 bg-gradient-to-br ${point.gradient} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:scale-110 transition-transform`}>
                            <IconComponent className="text-white" size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{point.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Vision Card */}
            <AnimatedSection variants={slideInRight} className="relative group">
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -bottom-3 -left-3 w-28 h-28 bg-gradient-to-br from-amber-300 to-yellow-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>

              <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50/50 rounded-[30px] p-5 shadow-xl border-2 border-orange-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-40"></div>

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all flex-shrink-0">
                      <Rocket className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1">Our Vision</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                        <p className="text-xs text-amber-600 font-bold">Where we're heading</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed mb-6">
                    To become a trusted global import-export brand, expanding our international network across more countries. We envision a future where businesses can trade confidently with reliable quality assurance, clear documentation, and efficient logistics.
                  </p>

                  <div className="space-y-3">
                    {visionPoints.map((point, index) => {
                      const IconComponent = point.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-orange-200/50 hover:border-orange-400 transition-all group/item">
                          <div className={`w-8 h-8 bg-gradient-to-br ${point.gradient} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:scale-110 transition-transform`}>
                            <IconComponent className="text-white" size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{point.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-6 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">The principles that guide every decision we make</p>
          </AnimatedSection>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${value.bg} backdrop-blur-sm rounded-[20px] p-4 shadow-lg border-2 ${value.border} hover:shadow-xl hover:scale-105 transition-all group text-center`}
                  variants={fadeInUp}
                >
                  <div className="relative inline-block mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="py-6 bg-gradient-to-r from-slate-50 to-emerald-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Teams</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">Dedicated professionals working to serve you better</p>
          </AnimatedSection>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${member.bg} backdrop-blur-sm rounded-[20px] p-5 shadow-lg border-2 ${member.border} hover:shadow-xl hover:scale-105 transition-all group text-center`}
                variants={fadeInUp}
              >
                <div className={`w-24 h-24 bg-gradient-to-br ${member.gradient} rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <UserCircle className="text-white" size={48} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">{member.name}</h3>
                <p className={`text-xs font-bold ${member.roleColor} mb-2`}>{member.role}</p>
                <p className="text-xs text-slate-600">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-6 bg-gradient-to-br from-blue-50/50 via-emerald-50/40 to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Why Choose Nexarion</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">Real advantages backed by real numbers</p>
          </AnimatedSection>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${feature.bg} rounded-[20px] p-6 border-2 ${feature.border} hover:shadow-xl hover:scale-105 transition-all group`}
                  variants={fadeInUp}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
