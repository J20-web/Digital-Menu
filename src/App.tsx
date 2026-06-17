import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ItemCard from './components/ItemCard';
import ItemDetail from './components/ItemDetail';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { useMenu } from './context/MenuContext';
import { MenuItem, Category } from './types';
import { Search, RotateCcw, Sparkles, SlidersHorizontal, MapPin, Grid, Flame, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { menuItems: MENU_ITEMS, categories: CATEGORIES, restaurantInfo: RESTAURANT_INFO, isAdmin, isAuthenticated } = useMenu();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Dietary Filter States
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [onlyVegetarian, setOnlyVegetarian] = useState(false);
  const [onlyPopular, setOnlyPopular] = useState(false);

  // Clear all filters easily
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlySpicy(false);
    setOnlyVegetarian(false);
    setOnlyPopular(false);
  };

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      
      // Diet Spicy
      if (onlySpicy && !item.isSpicy) {
        return false;
      }

      // Diet Veggie
      if (onlyVegetarian && !item.isVegetarian) {
        return false;
      }

      // Diet Popular
      if (onlyPopular && !item.isPopular) {
        return false;
      }

      // Live search queries
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIngredients = item.ingredients.some((ing) => 
          ing.toLowerCase().includes(query)
        );
        return matchesName || matchesDesc || matchesIngredients;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, onlySpicy, onlyVegetarian, onlyPopular]);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col justify-between" id="root-layout">
      
      {/* Brand Header Section */}
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 flex-grow w-full space-y-8" id="menu-lobby">
        {isAdmin ? (
          isAuthenticated ? (
            <AdminPanel />
          ) : (
            <AdminLogin />
          )
        ) : (
          <>
            {/* Editorial Splash Poster Hero Area */}
        <div className="relative rounded-3xl overflow-hidden shadow-xs border border-brand-light bg-brand-dark text-white" id="hero-banner">
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/src/assets/images/wow_hero_burger_1781365083360.jpg" 
              alt="Wow Hero Burger Banner" 
              className="w-full h-full object-cover opacity-25"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-transparent" />
          </div>

          {/* Interactive content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-lg space-y-4 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Now Live in Sabiyan
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight leading-tight">
              Crafted Burgers, Cold Spriis.
            </h2>
            <p className="text-xs sm:text-sm text-brand-light opacity-90 leading-relaxed">
              Experience the finest gourmet burgers in Dire Dawa. From our seared beef patties to freshly blended traditional layered juices, every single item tells our story of local passion.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-xs font-semibold text-brand-light flex items-center gap-1">
                <MapPin className="w-4 h-4 text-brand-primary" /> Sabiyan Main Terminal Area
              </span>
              <span className="hidden sm:inline text-brand-light/50">•</span>
              <span className="text-xs bg-brand-light/20 text-white px-3 py-1 rounded-md font-mono font-semibold">
                Pricing in ETB (Ethiopian Birr)
              </span>
            </div>
          </div>
        </div>

        {/* Live Search and Quick Filtering Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-light shadow-xs space-y-4" id="filters-panel">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-brand-muted w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Search specialty burgers, fresh sides, or ingredients (e.g. Avocado, Jalapeño)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-cream border border-brand-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-brand-dark placeholder-brand-muted transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-primary hover:text-brand-dark cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Core Dietary Toggles */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
              <span className="text-xs uppercase tracking-wider text-brand-muted font-bold mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Quick Filters
              </span>
              
              {/* Popular Checkbox Tag */}
              <button
                onClick={() => setOnlyPopular(!onlyPopular)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
                  onlyPopular 
                  ? 'bg-brand-primary text-white border-brand-primary shadow-xs' 
                  : 'bg-brand-cream text-brand-dark border-brand-light hover:bg-brand-light/30'
                }`}
              >
                🔥 Most Popular
              </button>

              {/* Spicy Checkbox Tag */}
              <button
                onClick={() => setOnlySpicy(!onlySpicy)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
                  onlySpicy 
                  ? 'bg-[#c62828] text-white border-[#c62828] shadow-xs' 
                  : 'bg-brand-cream text-brand-dark border-brand-light hover:bg-brand-light/30'
                }`}
              >
                🌶️ Spicy Only
              </button>

              {/* Vegetarian Checkbox Tag */}
              <button
                onClick={() => setOnlyVegetarian(!onlyVegetarian)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
                  onlyVegetarian 
                  ? 'bg-[#2e7d32] text-white border-[#2e7d32] shadow-xs' 
                  : 'bg-brand-cream text-brand-dark border-brand-light hover:bg-brand-light/30'
                }`}
              >
                🌱 Vegetarian
              </button>

              {/* Reset Filters icon */}
              {(selectedCategory !== 'all' || searchQuery || onlySpicy || onlyVegetarian || onlyPopular) && (
                <button
                  onClick={resetFilters}
                  className="p-2 rounded-xl bg-brand-light/40 text-brand-primary hover:bg-brand-light transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 border border-dotted border-brand-light"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Tabbed Navigation */}
        <div className="space-y-4" id="categories-tabs-navigation">
          <div className="flex items-center gap-1.5 pb-1">
            <Grid className="w-4.5 h-4.5 text-brand-primary" />
            <h3 className="font-serif text-lg font-bold text-brand-dark">Browse Categories</h3>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* "All" Category Tab */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-2 border cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-brand-primary text-white border-brand-primary shadow-xs scale-102 font-heavy'
                  : 'bg-white text-brand-dark border-brand-light hover:bg-brand-light/40'
              }`}
            >
              🥞 All Delights
            </button>

            {/* Categorized Tabs */}
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-2 border cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-brand-primary text-white border-brand-primary shadow-xs scale-102'
                    : 'bg-white text-brand-dark border-brand-light hover:bg-brand-light/40'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          
          {/* Quick descriptive blurb of the selected category */}
          {selectedCategory !== 'all' && (
            <motion.p 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-brand-muted italic pl-2 border-l-2 border-brand-primary"
            >
              {CATEGORIES.find(c => c.id === selectedCategory)?.description}
            </motion.p>
          )}
        </div>

        {/* Current Items Catalog List */}
        <div className="space-y-4" id="items-grid-section">
          <div className="flex items-center justify-between border-b border-brand-light pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </span>
            {searchQuery && (
              <span className="text-[11px] text-brand-muted">
                Filtered by keyword: "<b>{searchQuery}</b>"
              </span>
            )}
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ItemCard
                      item={item}
                      onClick={() => setSelectedItem(item)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Elegant Empty State Block */
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-brand-light border-dashed rounded-3xl p-10 md:p-14 text-center space-y-4"
              id="empty-filters-alert"
            >
              <div className="w-16 h-16 bg-brand-light text-brand-primary rounded-full flex items-center justify-center mx-auto text-xl">
                🔎
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="font-serif text-lg font-bold text-brand-dark">No gourmet items found</h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  We couldn't find any menu items matches your currently selected filters. Try broadening your keywords or resetting the dietary toggles.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition-transform cursor-pointer"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </div>
          </>
        )}
      </main>

      {/* Pop-up detailed item overlay sheet */}
      <ItemDetail
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
