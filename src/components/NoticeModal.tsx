import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

export default function NoticeModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('studyfex-notice-seen');
    if (!hasSeenNotice) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('studyfex-notice-seen', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative max-w-md w-full bg-[#121212] border border-white/10 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-emerald-500" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">System Notice</h2>
                <p className="text-white/60 leading-relaxed">
                  Welcome to the portal! Please note that some games may experience extended loading times or occasional performance issues depending on your connection and device.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleDismiss}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                >
                  Got it, let's play!
                </button>
              </div>
            </div>

            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
