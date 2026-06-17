import React from 'react';
import { MenuItem } from '../types';
import { Flame, Star, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <motion.div
      whileHover={item.isAvailable ? { y: -4, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden border border-brand-light shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col group relative ${!item.isAvailable ? 'opacity-75' : ''}`}
      id={`menu-card-${item.id}`}
    >
      {/* Upper Thumbnail Section with Floating Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-light/30 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${item.isAvailable ? 'group-hover:scale-102' : ''}`}
          referrerPolicy="no-referrer"
        />
        
        {/* Shadow overlays for styling depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-transparent opacity-50" />

        {/* Sold Out Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className="px-3 py-1.5 bg-brand-dark/95 text-white border border-brand-light/20 text-xs font-black uppercase tracking-widest rounded-md shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* Floating Category/Status Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {!item.isAvailable && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold bg-brand-dark/90 text-white tracking-wider uppercase shadow-xs">
              🚫 Unavailable
            </span>
          )}
          {item.isPopular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold bg-brand-primary text-white tracking-wider uppercase shadow-xs">
              <Flame className="w-3 h-3" /> Popular
            </span>
          )}
          {item.isSpicy && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold bg-[#c62828] text-white tracking-wider uppercase shadow-xs">
              🌶️ Spicy
            </span>
          )}
          {item.isVegetarian && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold bg-[#2e7d32] text-white tracking-wider uppercase shadow-xs">
              🌱 Vegetarian
            </span>
          )}
        </div>

        {/* Floating Prep Time Over item image bottom right */}
        <div className="absolute bottom-3 right-3 bg-brand-dark/85 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-brand-cream font-mono flex items-center gap-1">
          <Clock className="w-3 h-3 text-brand-light" />
          <span>{item.prepTime || '10 mins'}</span>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-4 md:p-5 flex-grow flex flex-col justify-between gap-3">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-serif font-black text-brand-dark group-hover:text-brand-primary transition-colors leading-snug">
              {item.name}
            </h3>
          </div>
          
          <p className="text-xs text-brand-muted line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {item.description}
          </p>
        </div>

        {/* Ingredients Snippet */}
        <div className="border-t border-dashed border-brand-light pt-3">
          <span className="block text-[10px] uppercase tracking-wider text-brand-muted font-bold mb-1">
            Core Ingredients
          </span>
          <div className="flex flex-wrap gap-1">
            {item.ingredients.slice(0, 3).map((ing, i) => (
              <span 
                key={i} 
                className="text-[10px] px-2 py-0.5 rounded bg-brand-light/30 text-brand-primary border border-brand-light/60 font-medium"
              >
                {ing.split(' (')[0]}
              </span>
            ))}
            {item.ingredients.length > 3 && (
              <span className="text-[9px] px-1.5 py-0.5 text-brand-muted font-semibold">
                +{item.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Area with ETB Price and Detail Button */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-brand-light flex-shrink-0">
          <div className="text-left">
            <span className="block text-[9px] text-brand-muted uppercase tracking-widest font-bold leading-3">Price</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-brand-primary font-mono">{item.price}</span>
              <span className="text-xs font-semibold text-brand-muted font-serif">ETB</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary group-hover:text-brand-dark transition-colors">
            <span className="underline decoration-dotted underline-offset-4">Details</span>
            <Sparkles className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
