import React, { useEffect } from 'react';
import { MenuItem } from '../types';
import { X, Phone, Clock, Flame, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMenu } from '../context/MenuContext';

interface ItemDetailProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function ItemDetail({ item, onClose }: ItemDetailProps) {
  const { restaurantInfo } = useMenu();

  // Prevent body scrolling when the overlay is active
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-0 sm:p-4 md:p-6" id="item-detail-portal">
        
        {/* Backdrop overlay blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-dark/80 backdrop-blur-xs z-40 transition-opacity"
        />

        {/* Outer content container */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0.5 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-white sm:rounded-3xl shadow-xl z-50 overflow-hidden flex flex-col h-full sm:h-auto max-h-[100dvh] sm:max-h-[85vh] border border-brand-light"
          id="detail-window"
        >
          {/* Top Floating Close Button */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-brand-primary/95 text-white hover:bg-brand-dark shadow-md transition-all border border-brand-light/20 cursor-pointer"
              aria-label="Close details"
              id="close-detail-button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div className="overflow-y-auto w-full h-full pb-8">
            
            {/* Grand Photographic Banner Header */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-brand-light/30 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Image Shadow Edge Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              
              {/* Sold Out Banner Over Image detail block */}
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-xs flex flex-col items-center justify-center z-10 p-4">
                  <span className="px-4 py-2 bg-brand-dark/95 text-white border border-[#c62828]/30 text-xs font-black uppercase tracking-widest rounded-lg shadow-md">
                    Temporarily Sold Out
                  </span>
                  <p className="text-[10px] text-brand-cream/90 font-semibold mt-1">Coming back fresh soon!</p>
                </div>
              )}

              {/* Mini Dietary Tags inside Banner */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                {!item.isAvailable && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-brand-dark text-white rounded-md text-xs font-bold shadow-xs uppercase tracking-wider">
                    🚫 Sold Out
                  </span>
                )}
                {item.isPopular && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-brand-primary text-white rounded-md text-xs font-bold shadow-xs uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5" /> Popular Choice
                  </span>
                )}
                {item.isSpicy && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#c62828] text-white rounded-md text-xs font-bold shadow-xs uppercase tracking-wider">
                    🌶️ Red Spicy
                  </span>
                )}
                {item.isVegetarian && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#2e7d32] text-white rounded-md text-xs font-bold shadow-xs uppercase tracking-wider">
                    🌱 Vegetarian
                  </span>
                )}
              </div>
            </div>

            {/* Content Details Block */}
            <div className="px-5 sm:px-8 pt-4 space-y-6">
              
              {/* Title & Price Header */}
              <div className="border-b border-brand-light pb-4">
                {!item.isAvailable && (
                  <span className="inline-flex px-2 py-0.5 rounded bg-[#c62828]/10 text-[#c62828] border border-[#c62828]/20 text-[9px] font-extrabold uppercase tracking-widest mb-2">
                    Item Unavailable Today
                  </span>
                )}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-brand-dark leading-tight">
                    {item.name}
                  </h2>
                  <div className="flex items-baseline gap-1 mt-1 sm:mt-0">
                    <span className="text-3xl font-bold font-mono text-brand-primary tracking-tight">{item.price}</span>
                    <span className="text-sm font-semibold text-brand-muted font-serif uppercase">ETB</span>
                  </div>
                </div>
                
                {/* Secondary quick specifications bar */}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-brand-muted border-t border-brand-light pt-2.5">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-4 h-4 text-brand-primary" />
                    <span>Prep Time: <b>{item.prepTime || '10 mins'}</b></span>
                  </div>
                  {item.calories && (
                    <div className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle className="w-4 h-4 text-brand-primary" />
                      <span>Caloric Value: <b>{item.calories}</b></span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Info className="w-4 h-4 text-brand-primary" />
                    <span>Serving: <b>1 Portion</b></span>
                  </div>
                </div>
              </div>

              {/* Narrative Food Culinary Description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-widest text-brand-muted font-bold">
                  Culinary Profile
                </h4>
                <p className="text-brand-dark leading-relaxed text-sm md:text-base font-normal">
                  {item.description}
                </p>
              </div>

              {/* Ingredients List */}
              <div className="space-y-3 bg-brand-light/30 p-5 rounded-2xl border border-brand-light">
                <h4 className="text-xs uppercase tracking-widest text-brand-muted font-bold pb-2 border-b border-brand-light/60 flex items-center gap-2">
                  <span>📜 Complete Ingredients List</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {item.ingredients.map((ingredient, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-brand-dark">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-primary" />
                      <span className="font-semibold leading-relaxed">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Local Dining Information & Call-to-order banner */}
              <div className="p-4 bg-white border border-brand-light rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <ShieldAlert className="w-4 h-4 text-brand-primary" />
                    <span className="font-bold text-brand-dark">
                      {item.isAvailable ? 'Ready to Savor?' : 'Daily Batch Sold Out'}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-muted leading-normal max-w-md">
                    {item.isAvailable 
                      ? 'This is a digital menu showcase. Feel free to call directly to order for pickup or quick delivery at Sabiyan!'
                      : 'This item is temporarily unavailable today. Our organic ingredients are delivered fresh daily and we have run out of stock for this recipe. We apologize for the inconvenience!'}
                  </p>
                </div>
                
                {/* Phone Link Call Button or Sold Out indicator */}
                {item.isAvailable ? (
                  <a
                    href={`tel:${restaurantInfo.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-dark text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-light" />
                    <span>Call {restaurantInfo.phone}</span>
                  </a>
                ) : (
                  <div
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-xs font-bold cursor-not-allowed select-none"
                  >
                    <span>Temporarily Out</span>
                  </div>
                )}
              </div>

              {/* Close Button at bottom of details for fluent scrolling */}
              <div className="pt-3 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-brand-light hover:bg-brand-light/30 text-brand-primary text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Go Back to Menu
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
