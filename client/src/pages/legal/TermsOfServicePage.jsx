import { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { SUPPORT_CONTACT_NUMBERS_TEXT } from '../../utils/whatsapp';
import { FileText, Users, ShoppingCart, Shield, AlertTriangle, Scale, Ban, RefreshCw, Mail, CheckCircle } from 'lucide-react';

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

const TermsOfServicePage = () => {
  const lastUpdated = "February 2026";

  const sections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement",
          text: "By accessing or using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
        },
        {
          subtitle: "Eligibility",
          text: "You must be at least 18 years old and capable of forming a binding contract to use our services. By using our platform, you represent that you meet these requirements."
        },
        {
          subtitle: "Account Responsibility",
          text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
        }
      ]
    },
    {
      icon: Users,
      title: "User Accounts",
      content: [
        {
          subtitle: "Registration",
          text: "To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during registration and keep your account information updated."
        },
        {
          subtitle: "Account Types",
          text: "We offer different account types including Buyer, Supplier, and Business accounts. Each type has specific features and responsibilities as outlined during registration."
        },
        {
          subtitle: "Account Security",
          text: "You are responsible for safeguarding your password and must notify us immediately of any unauthorized access to your account."
        }
      ]
    },
    {
      icon: ShoppingCart,
      title: "Transactions and Orders",
      content: [
        {
          subtitle: "Order Placement",
          text: "When you place an order, you are making an offer to purchase products. All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order."
        },
        {
          subtitle: "Pricing",
          text: "All prices are displayed in the selected currency and are subject to change without notice. We strive to ensure accurate pricing but errors may occur. In case of pricing errors, we will notify you and allow you to cancel or proceed with the correct price."
        },
        {
          subtitle: "Payment",
          text: "Payment must be made through our approved payment methods. You agree to pay all charges incurred through your account at the prices in effect when such charges are incurred."
        },
        {
          subtitle: "Shipping and Delivery",
          text: "Shipping times and costs are estimates and may vary. We are not responsible for delays caused by customs, shipping carriers, or circumstances beyond our control."
        }
      ]
    },
    {
      icon: Shield,
      title: "Supplier Terms",
      content: [
        {
          subtitle: "Supplier Obligations",
          text: "Suppliers agree to provide accurate product information, maintain product quality, fulfill orders promptly, and respond to buyer inquiries in a timely manner."
        },
        {
          subtitle: "Product Listings",
          text: "Suppliers are responsible for the accuracy of their product listings, including descriptions, images, pricing, and availability. Misleading or fraudulent listings are strictly prohibited."
        },
        {
          subtitle: "Verification",
          text: "Suppliers may be required to complete a verification process. We reserve the right to suspend or terminate supplier accounts that fail verification or violate our policies."
        }
      ]
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: [
        {
          subtitle: "General Prohibitions",
          text: "Users may not use our platform for any illegal purpose, to harass or harm others, to transmit malware, or to interfere with the proper functioning of the platform."
        },
        {
          subtitle: "Commercial Restrictions",
          text: "Users may not engage in unauthorized commercial activities, including spam, unauthorized advertising, or competing services that harm our platform."
        },
        {
          subtitle: "Content Restrictions",
          text: "Users may not post content that is defamatory, obscene, fraudulent, or infringes on intellectual property rights of others."
        }
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Our Content",
          text: "All content on our platform, including logos, designs, text, and software, is the property of Nexarion Global Exports and is protected by intellectual property laws."
        },
        {
          subtitle: "User Content",
          text: "By posting content on our platform, you grant us a non-exclusive license to use, modify, and display that content in connection with our services."
        },
        {
          subtitle: "Third-Party Content",
          text: "Product listings and supplier content remain the property of respective suppliers. We do not claim ownership of third-party content."
        }
      ]
    },
    {
      icon: AlertTriangle,
      title: "Disclaimers and Limitations",
      content: [
        {
          subtitle: "Service Availability",
          text: "We strive to maintain platform availability but do not guarantee uninterrupted service. We may modify, suspend, or discontinue any part of our services at any time."
        },
        {
          subtitle: "Third-Party Transactions",
          text: "We facilitate connections between buyers and suppliers but are not party to transactions between them. We are not responsible for the quality, safety, or legality of products sold by suppliers."
        },
        {
          subtitle: "Limitation of Liability",
          text: "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services."
        }
      ]
    },
    {
      icon: RefreshCw,
      title: "Dispute Resolution",
      content: [
        {
          subtitle: "Between Users",
          text: "We encourage buyers and suppliers to resolve disputes directly. We may provide dispute resolution assistance but are not obligated to do so."
        },
        {
          subtitle: "With Us",
          text: "Any disputes arising from these terms shall be governed by the laws of India. You agree to resolve disputes through negotiation before pursuing formal legal action."
        },
        {
          subtitle: "Refunds and Returns",
          text: "Refund and return policies vary by supplier. Please review supplier policies before making purchases. We may facilitate refunds in cases of verified fraud or non-delivery."
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
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full px-4 py-2 mb-6">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-semibold text-sm">Legal Agreement</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Terms of <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Service</span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-4">
              Please read these terms carefully before using the Nexarion Global Exports platform. These terms govern your use of our services.
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
              Welcome to Nexarion Global Exports. These Terms of Service ("Terms") constitute a legally binding agreement between you and Nexarion Global Exports regarding your access to and use of our website, mobile application, and services (collectively, the "Platform"). Please read these Terms carefully before using our Platform.
            </p>
          </div>
        </AnimatedSection>

        {/* Sections */}
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <AnimatedSection key={index} delay={index * 0.08} className="mb-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="pl-4 border-l-2 border-cyan-200">
                      <h3 className="font-semibold text-slate-700 mb-1">{item.subtitle}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          );
        })}

        {/* Termination */}
        <AnimatedSection delay={0.7}>
          <div className="bg-slate-800 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Ban className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Termination</h2>
            </div>
            <p className="text-white/90 mb-4">
              We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Platform will cease immediately. Provisions of this agreement that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </div>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection delay={0.8}>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Contact Us</h2>
            </div>
            <p className="text-white/90 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Email:</strong> nexarionglobalexports@gmail.com</p>
              <p><strong>Phone:</strong> {SUPPORT_CONTACT_NUMBERS_TEXT}</p>
              <p><strong>Address:</strong> Gujarat, India</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Agreement Notice */}
        <AnimatedSection delay={0.9} className="mt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Important Notice</h3>
              <p className="text-amber-700 text-sm">
                By using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. We reserve the right to update these Terms at any time. Continued use of the Platform after any changes constitutes your acceptance of the new Terms.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
