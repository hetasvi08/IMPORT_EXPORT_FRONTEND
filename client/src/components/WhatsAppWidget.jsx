import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { openSupportChat } from "../utils/whatsapp";

const WhatsAppWidget = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after 5 seconds
  useState(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    openSupportChat();
  };

  return (
    <div
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[40]"
      style={{
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {(showTooltip || isHovered) && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl p-4 min-w-[220px] border border-slate-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                <i className="fab fa-whatsapp text-white text-xl"></i>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Need Help?</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Chat with us on WhatsApp
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Usually replies in minutes
                </p>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-slate-200 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow relative group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25"></span>

        {/* Icon */}
        <i className="fab fa-whatsapp text-white text-3xl relative z-10"></i>
      </motion.button>
    </div>
  );
};

export default WhatsAppWidget;
