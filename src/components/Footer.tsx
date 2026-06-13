import React from 'react';
import { Phone, MapPin, Clock, Heart } from 'lucide-react';
import { RESTAURANT_INFO } from '../data';

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-brand-light py-10 px-4 mt-16 border-t-2 border-brand-dark" id="footer-section">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-brand-dark flex items-center justify-center font-serif font-black text-white text-sm">W</span>
            <span className="font-serif text-xl font-bold text-white tracking-tight">{RESTAURANT_INFO.name}</span>
          </div>
          <p className="text-xs text-brand-cream/80 italic leading-relaxed max-w-sm mx-auto md:mx-0">
            "{RESTAURANT_INFO.tagline}"
          </p>
          <p className="text-[10px] text-brand-cream/60 tracking-wider uppercase">
            © {new Date().getFullYear()} Wow Burger. All rights reserved.
          </p>
        </div>

        {/* Coords Col */}
        <div className="space-y-3">
          <h4 className="text-xs text-white uppercase tracking-widest font-bold">Location & Contact</h4>
          <ul className="space-y-2 text-xs text-brand-light/90">
            <li className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-light flex-shrink-0" />
              <span>{RESTAURANT_INFO.location}</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-light flex-shrink-0" />
              <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:underline">{RESTAURANT_INFO.phone}</a>
            </li>
          </ul>
        </div>

        {/* Schedule Col */}
        <div className="space-y-3">
          <h4 className="text-xs text-white uppercase tracking-widest font-bold">Hours & Spot</h4>
          <ul className="space-y-2 text-xs text-brand-light/90">
            <li className="flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-3.5 h-3.5 text-brand-light flex-shrink-0" />
              <span>{RESTAURANT_INFO.workingHours}</span>
            </li>
            <li className="text-[11px] text-brand-cream/70 leading-normal">
              Across from the main Sabiyan Terminal building. Drop in for hot takeaway and cold local juices!
            </li>
          </ul>
        </div>

      </div>

      {/* Love/Crafting Footnote */}
      <div className="max-w-6xl mx-auto border-t border-brand-dark/40 mt-8 pt-6 text-center text-xs text-brand-light/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Handcrafted in Sabiyan, Dire Dawa - Land of the Sun ☀️</span>
        <span className="flex items-center gap-1">
          Made for burger lovers with <Heart className="w-3 h-3 text-[#ffcdd2] fill-[#ffcdd2]" /> in Ethiopia
        </span>
      </div>
    </footer>
  );
}
