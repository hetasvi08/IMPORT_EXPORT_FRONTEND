import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Linkedin, Instagram, Twitter } from 'lucide-react';
import nexarionLogo from '../../assets/nexarion_logo.png';
import { SUPPORT_CONTACT_NUMBERS, WHATSAPP_API_URL } from '../../utils/whatsapp';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white pt-12 pb-6 relative overflow-hidden">
      {/* Decorative gradient overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
                <img src={nexarionLogo} alt="Nexarion" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Nexarion</h3>
                <p className="text-xs text-emerald-400 font-semibold">Global Exports</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              Your trusted partner in global import-export solutions. Connecting businesses worldwide.
            </p>
            <div className="flex gap-3">
                <a href={WHATSAPP_API_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:scale-110">
                <MessageCircle size={18} />
              </a>
              <a href="https://www.instagram.com/nexarion_global_exports?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="https://x.com/exports95435" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gradient-to-br from-sky-400 to-sky-500 rounded-lg flex items-center justify-center hover:from-sky-500 hover:to-sky-600 transition-all duration-300 shadow-lg hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="https://www.linkedin.com/in/nexarion-global-exports-2828773a6/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:scale-110">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-300 hover:text-emerald-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-emerald-400 group-hover:w-4 transition-all duration-300"></span>Home</Link></li>
              <li><Link to="/products" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-cyan-400 group-hover:w-4 transition-all duration-300"></span>Products</Link></li>
              <li><Link to="/categories" className="text-slate-300 hover:text-purple-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-purple-400 group-hover:w-4 transition-all duration-300"></span>Categories</Link></li>
              <li><Link to="/about" className="text-slate-300 hover:text-amber-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-amber-400 group-hover:w-4 transition-all duration-300"></span>About Us</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-pink-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-pink-400 group-hover:w-4 transition-all duration-300"></span>Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
              Services
            </h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-slate-300 hover:text-emerald-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-emerald-400 group-hover:w-4 transition-all duration-300"></span>Import Solutions</Link></li>
              <li><Link to="/services" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-cyan-400 group-hover:w-4 transition-all duration-300"></span>Export Solutions</Link></li>
              <li><Link to="/services" className="text-slate-300 hover:text-purple-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-purple-400 group-hover:w-4 transition-all duration-300"></span>Logistics</Link></li>
              <li><Link to="/services" className="text-slate-300 hover:text-amber-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-amber-400 group-hover:w-4 transition-all duration-300"></span>Customs Clearance</Link></li>
              <li><Link to="/services" className="text-slate-300 hover:text-pink-400 transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-pink-400 group-hover:w-4 transition-all duration-300"></span>Documentation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm group hover:text-white transition-colors duration-300">
                <MapPin size={18} className="text-emerald-400 group-hover:text-emerald-300 flex-shrink-0 mt-0.5 transition-colors duration-300" />
                <span>Gujarat, India</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm group hover:text-white transition-colors duration-300">
                <Phone size={18} className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                <div className="flex flex-col">
                  {SUPPORT_CONTACT_NUMBERS.map((number) => (
                    <a key={number} href={`tel:${number.replace(/\D/g, '')}`} className="hover:text-cyan-400">
                      {number}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm group hover:text-white transition-colors duration-300">
                <Mail size={18} className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <a href="mailto:contact@nexarionimpex.com" className="hover:text-purple-400">contact@nexarionimpex.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} Nexarion Global Exports. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:scale-105">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 text-sm hover:scale-105">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
