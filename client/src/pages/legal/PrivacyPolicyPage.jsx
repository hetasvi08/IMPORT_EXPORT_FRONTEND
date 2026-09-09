import { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { SUPPORT_CONTACT_NUMBERS_TEXT } from '../../utils/whatsapp';
import { Shield, Lock, Eye, Database, Mail, Globe, Users, FileText, AlertCircle } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const PrivacyPolicyPage = () => {
  const lastUpdated = "February 2026";

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping address, billing information, and company details."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you interact with our platform, including IP address, browser type, pages visited, time spent on pages, and referring URLs."
        },
        {
          subtitle: "Transaction Information",
          text: "We collect details about your purchases, quotes, and business transactions conducted through our platform."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "To process orders, manage your account, provide customer support, and facilitate transactions between buyers and suppliers."
        },
        {
          subtitle: "Communication",
          text: "To send order confirmations, shipping updates, respond to inquiries, and provide important platform notifications."
        },
        {
          subtitle: "Platform Improvement",
          text: "To analyze usage patterns, improve our services, develop new features, and enhance user experience."
        },
        {
          subtitle: "Security",
          text: "To detect, prevent, and address fraud, unauthorized access, and other illegal activities."
        }
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        {
          subtitle: "With Suppliers and Buyers",
          text: "We share necessary information between trading parties to facilitate transactions, including contact details and order information."
        },
        {
          subtitle: "Service Providers",
          text: "We may share information with trusted third-party service providers who assist in payment processing, shipping, and platform operations."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law, legal process, or government request, or to protect our rights and safety."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Protection Measures",
          text: "We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your data."
        },
        {
          subtitle: "Access Controls",
          text: "Access to personal information is restricted to authorized employees and contractors who need it to perform their duties."
        },
        {
          subtitle: "Data Retention",
          text: "We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes."
        }
      ]
    },
    {
      icon: Globe,
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Update",
          text: "You can access, update, or correct your personal information through your account settings or by contacting us directly."
        },
        {
          subtitle: "Data Deletion",
          text: "You may request deletion of your account and associated data, subject to legal and business requirements."
        },
        {
          subtitle: "Marketing Opt-out",
          text: "You can opt out of promotional communications at any time through email preferences or by contacting us."
        }
      ]
    },
    {
      icon: FileText,
      title: "Cookies and Tracking",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "We use cookies necessary for website functionality, including session management and security features."
        },
        {
          subtitle: "Analytics",
          text: "We may use analytics tools to understand how visitors use our platform and improve our services."
        },
        {
          subtitle: "Your Choices",
          text: "You can manage cookie preferences through your browser settings, though some features may not function properly without cookies."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-sm">Your Privacy Matters</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Privacy <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Policy</span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-4">
              At Nexarion Global Exports, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            
            <p className="text-sm text-slate-400">
              Last Updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <AnimatedSection className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <p className="text-slate-600 leading-relaxed">
              This Privacy Policy describes how Nexarion Global Exports ("we," "us," or "our") collects, uses, and shares information about you when you use our website and services. By using our platform, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>
        </AnimatedSection>

        {/* Sections */}
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <AnimatedSection key={index} delay={index * 0.1} className="mb-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="pl-4 border-l-2 border-emerald-200">
                      <h3 className="font-semibold text-slate-700 mb-1">{item.subtitle}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          );
        })}

        {/* Contact Section */}
        <AnimatedSection delay={0.6}>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Contact Us</h2>
            </div>
            <p className="text-white/90 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Email:</strong> nexarionglobalexports@gmail.com</p>
              <p><strong>Phone:</strong> {SUPPORT_CONTACT_NUMBERS_TEXT}</p>
              <p><strong>Address:</strong> Gujarat, India</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Notice */}
        <AnimatedSection delay={0.7} className="mt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Policy Updates</h3>
              <p className="text-amber-700 text-sm">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
