import React from 'react';
import { Phone, MapPin, Clock, Share2, Award, ShieldAlert, User, ShieldCheck, LayoutGrid } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { motion } from 'motion/react';

export default function Header() {
  const { restaurantInfo: RESTAURANT_INFO, isAdmin, setIsAdmin } = useMenu();
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Wow Burger Digital Menu',
        text: 'Check out the delicious menu at Wow Burger in Sabiyan, Dire Dawa!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback direct copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Menu link copied to clipboard!');
    }
  };

  return (
    <header className="relative w-full bg-white border-b border-brand-light" id="header-section">
      {/* Visual Top Decorative Accent */}
      <div className="h-1 w-full bg-brand-primary opacity-90" />

      {/* Main Brand and Information Area */}
      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          
          {/* Logo & Slogan */}
          <div className="flex items-start gap-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-brand-primary rounded-lg flex items-center justify-center border border-brand-light shadow-sm relative overflow-hidden"
              id="brand-emblem"
            >
              <div className="absolute inset-0 bg-brand-dark opacity-10 transform -skew-y-12" />
              <span className="text-2xl md:text-3xl font-serif text-white font-black">W</span>
            </motion.div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2.5xl font-serif font-black text-brand-dark tracking-tight">
                  {RESTAURANT_INFO.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider font-semibold bg-brand-light text-brand-primary">
                  <Award className="w-3 h-3" /> Sabiyan Choice
                </span>
              </div>
              <p className="text-xs font-semibold text-brand-muted italic">
                "{RESTAURANT_INFO.tagline}"
              </p>
              
              {/* Working Hours Label for Quick Read */}
              <div className="flex items-center gap-1.5 text-xs text-brand-muted pt-0.5">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                <span>{RESTAURANT_INFO.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Location Pill Grid */}
          <div className="flex flex-wrap md:flex-nowrap gap-2.5 md:self-center">
            
            {/* Phone Dial Button */}
            <motion.a 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2.5 px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-brand-dark transition-colors shadow-sm cursor-pointer"
              id="phone-call-action"
            >
              <Phone className="w-4 h-4 text-brand-light" />
              <div className="text-left">
                <span className="block text-[8px] text-brand-light font-normal leading-3 uppercase tracking-wider">Tap to Call</span>
                <span className="block font-mono text-xs leading-4">{RESTAURANT_INFO.phone}</span>
              </div>
            </motion.a>

            {/* Location Pill */}
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white text-brand-dark rounded-lg text-xs font-semibold border border-brand-light max-w-xs">
              <MapPin className="w-4 h-4 text-brand-muted flex-shrink-0" />
              <div>
                <span className="block text-[8px] text-brand-muted font-normal uppercase tracking-wider">Address</span>
                <span className="block text-xs font-medium truncate">{RESTAURANT_INFO.location}</span>
              </div>
            </div>

            {/* Share Menu Icon Button */}
            <button 
              onClick={handleShare}
              className="p-2.5 bg-white hover:bg-brand-light text-brand-primary rounded-lg border border-brand-light transition-colors flex items-center justify-center cursor-pointer"
              title="Share Digital Menu"
              id="share-menu-button"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Admin Portal Toggle Button */}
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                isAdmin 
                  ? 'bg-brand-primary text-white border-brand-primary shadow-xs' 
                  : 'bg-white hover:bg-brand-light text-brand-dark border-brand-light'
              }`}
              title={isAdmin ? "Switch to Customer Mode" : "Manage Digital Menu"}
              id="admin-mode-toggle"
            >
              {isAdmin ? <User className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4 animate-pulse-subtle" />}
            </button>
          </div>
        </div>

        {/* Localized Sabiyan, Dire Dawa Spot Details */}
        <div className="mt-4 p-3 bg-brand-light/40 border border-brand-light rounded-xl flex items-start gap-2.5 text-xs text-brand-muted leading-relaxed">
          <div className="mt-0.5 flex-shrink-0 p-1 bg-brand-light rounded text-brand-primary">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <p>
            <span className="font-semibold text-brand-dark">Locate us:</span> {RESTAURANT_INFO.placeDetail}
          </p>
        </div>

        {/* Display Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-brand-light flex items-center justify-between gap-4 flex-wrap" id="header-navigation-tabs">
          <div className="flex gap-2.5">
            <button
              onClick={() => setIsAdmin(false)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                !isAdmin
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-brand-light/35 text-brand-dark hover:bg-brand-light/70 border border-brand-light'
              }`}
              id="nav-customer-menu"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Customer Menu</span>
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-brand-light/35 text-brand-dark hover:bg-brand-light/70 border border-brand-light'
              }`}
              id="nav-admin-dashboard"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          </div>
          
          {isAdmin && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md uppercase tracking-wider animate-pulse">
              🛡️ Admin Terminal Connected
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
