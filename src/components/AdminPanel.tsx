import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { MenuItem, CategoryInfo } from '../types';
import { 
  Plus, Trash2, Edit, Save, X, Check, Store, RotateCcw, 
  Layers, Utensils, Flame, ChevronRight, Image, DollarSign, Clock, AlertTriangle, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPanel() {
  const { 
    menuItems, categories, restaurantInfo, 
    addCategory, updateCategory, deleteCategory,
    addItem, updateItem, deleteItem, updateRestaurantInfo, 
    resetToDefaults, setIsAdmin, logout
  } = useMenu();

  // Selected sub-tab in Administration panel
  const [activeTab, setActiveTab] = useState<'items' | 'categories' | 'settings'>('items');

  // Creation and Editing States
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // --- ITEM FORM STATES ---
  const [itemForm, setItemForm] = useState<{
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
    isPopular: boolean;
    isSpicy: boolean;
    isVegetarian: boolean;
    calories: string;
    prepTime: string;
    ingredientsString: string; // comma-separated for simple edits
  }>({
    id: '',
    name: '',
    category: categories[0]?.id || 'food',
    description: '',
    price: 0,
    image: '',
    isAvailable: true,
    isPopular: false,
    isSpicy: false,
    isVegetarian: false,
    calories: '',
    prepTime: '',
    ingredientsString: '',
  });

  // --- CATEGORY FORM STATES ---
  const [categoryForm, setCategoryForm] = useState<CategoryInfo>({
    id: '',
    name: '',
    icon: '🍔',
    description: '',
  });

  // --- RESTAURANT CONFIG STATE ---
  const [settingsForm, setSettingsForm] = useState(restaurantInfo);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Open item form for editing
  const handleEditItem = (item: MenuItem) => {
    setEditingItemId(item.id);
    setIsAddingItem(false);
    setItemForm({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image,
      isAvailable: item.isAvailable,
      isPopular: !!item.isPopular,
      isSpicy: !!item.isSpicy,
      isVegetarian: !!item.isVegetarian,
      calories: item.calories || '',
      prepTime: item.prepTime || '',
      ingredientsString: item.ingredients.join(', '),
    });
  };

  // Open empty item form for creating
  const handleOpenCreateItem = () => {
    setIsAddingItem(true);
    setEditingItemId(null);
    setItemForm({
      id: `item-${Date.now()}`,
      name: '',
      category: categories[0]?.id || 'food',
      description: '',
      price: 150,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
      isAvailable: true,
      isPopular: false,
      isSpicy: false,
      isVegetarian: false,
      calories: '450 kcal',
      prepTime: '12 mins',
      ingredientsString: 'Fresh Ingredients',
    });
  };

  // Save changes to menu item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.id.trim()) {
      alert('Please fill out Name and unique ID of the item.');
      return;
    }

    const ingredients = itemForm.ingredientsString
      .split(',')
      .map(i => i.trim())
      .filter(i => i !== '');

    const itemData: MenuItem = {
      id: itemForm.id,
      name: itemForm.name,
      category: itemForm.category,
      description: itemForm.description,
      price: Number(itemForm.price),
      image: itemForm.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
      isAvailable: itemForm.isAvailable,
      isPopular: itemForm.isPopular,
      isSpicy: itemForm.isSpicy,
      isVegetarian: itemForm.isVegetarian,
      calories: itemForm.calories,
      prepTime: itemForm.prepTime,
      ingredients: ingredients,
    };

    if (isAddingItem) {
      // Check for duplicate ID
      if (menuItems.some(i => i.id === itemData.id)) {
        alert('A menu item with this ID already exists. Please make it unique.');
        return;
      }
      addItem(itemData);
      setIsAddingItem(false);
    } else if (editingItemId) {
      updateItem(editingItemId, itemData);
      setEditingItemId(null);
    }
  };

  // Open category form for editing
  const handleEditCategory = (cat: CategoryInfo) => {
    setEditingCategoryId(cat.id);
    setIsAddingCategory(false);
    setCategoryForm({ ...cat });
  };

  // Open empty category form for creating
  const handleOpenCreateCategory = () => {
    setIsAddingCategory(true);
    setEditingCategoryId(null);
    setCategoryForm({
      id: '',
      name: '',
      icon: '🍉',
      description: '',
    });
  };

  // Save changes to Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.id.trim() || !categoryForm.name.trim()) {
      alert('Please enter a Unique Slug ID and Category name.');
      return;
    }

    // Format ID to clean slug form (lowercase, hyphens instead of spaces)
    const normalizedId = categoryForm.id.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const catData = {
      ...categoryForm,
      id: normalizedId
    };

    if (isAddingCategory) {
      if (categories.some(c => c.id === catData.id)) {
        alert('A category with this ID/Slug already exists. Please choose another slug.');
        return;
      }
      addCategory(catData);
      setIsAddingCategory(false);
    } else if (editingCategoryId) {
      updateCategory(editingCategoryId, catData);
      setEditingCategoryId(null);
    }
  };

  // Save overall store configurations
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantInfo(settingsForm);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  // Confirm and cascade delete category
  const handleDeleteCategoryWithConfirm = (id: string, name: string) => {
    const itemCount = menuItems.filter(item => item.category === id).length;
    let message = `Are you sure you want to delete the category "${name}"?`;
    if (itemCount > 0) {
      message += `\n\n⚠️ CRITICAL WARNING: This category currently contains ${itemCount} item(s).\nDeleting this category will IMMEDIATELY DELETE ALL associated dishes under cascade rules!`;
    }
    if (window.confirm(message)) {
      deleteCategory(id);
    }
  };

  const handleResetWithConfirm = () => {
    if (window.confirm('⚠️ Reset all menu listings, categories, and settings back to factory default? Any custom menu changes or items you added will be permanently wiped.')) {
      resetToDefaults();
      setSettingsForm(restaurantInfo);
      alert('Digital menu has been restored to native Sabiyan default catalog.');
    }
  };

  return (
    <div className="bg-brand-cream/40 border-t border-brand-light pt-4 pb-20 px-4 min-h-[90vh]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Management Board Portal Indicator Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
                <Store className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-brand-dark">
                Control Hub & Admin Panel
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-muted">
              Dynamically manipulate items, categories, and location details of **{restaurantInfo.name}** in Sabiyan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Factory Reset button */}
            <button
              onClick={handleResetWithConfirm}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 hover:text-pink-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-pink-200/50"
              title="Reset configuration template back to default presets"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Full Factory Reset</span>
            </button>

            {/* Turn off Admin Mode */}
            <button
              onClick={() => setIsAdmin(false)}
              className="px-5 py-2.5 bg-brand-dark hover:bg-brand-primary text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Exit Portal & View Menu
            </button>

            {/* Log Out button */}
            <button
              onClick={() => {
                logout();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-red-200/50"
              title="Log out from superuser session"
              id="admin-logout-button"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Toggles */}
        <div className="flex gap-2.5 border-b border-brand-light pb-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 border ${
              activeTab === 'items'
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-white text-brand-dark border-brand-light hover:bg-brand-light/30'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Articles & Recipes ({menuItems.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 border ${
              activeTab === 'categories'
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-white text-brand-dark border-brand-light hover:bg-brand-light/30'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tab Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 border ${
              activeTab === 'settings'
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-white text-brand-dark border-brand-light hover:bg-brand-light/30'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store Profile</span>
          </button>
        </div>

        {/* TAB 1: ARTICLES & RECIPES WORKSPACE */}
        {activeTab === 'items' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-brand-dark">Menu Catalog Master File</h3>
              {!isAddingItem && !editingItemId && (
                <button
                  onClick={handleOpenCreateItem}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary hover:bg-brand-dark text-white text-xs font-black rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Draft New Item</span>
                </button>
              )}
            </div>

            {/* Expandable Form: Add/Edit Item */}
            {(isAddingItem || editingItemId) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between border-b border-brand-light pb-3">
                  <h4 className="font-serif text-md font-extrabold text-brand-dark flex items-center gap-2">
                    <span className="p-1 rounded bg-brand-primary/10 text-brand-primary">⚙️</span>
                    <span>{isAddingItem ? 'Drafting New Menu Item' : `Editing Recipe: ${itemForm.name}`}</span>
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddingItem(false);
                      setEditingItemId(null);
                    }}
                    className="p-1.5 rounded-lg border border-brand-light text-brand-muted hover:bg-brand-light/40 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                  
                  {/* Item ID / Static unique URL handle */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Unique ID Key (Alpha-Numeric slug)</label>
                    <input
                      type="text"
                      disabled={!!editingItemId}
                      placeholder="e.g. delicious-awaze-wings"
                      value={itemForm.id}
                      onChange={(e) => setItemForm({ ...itemForm, id: e.target.value })}
                      className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
                      required
                    />
                  </div>

                  {/* Item Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Article/Item Printed Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Awaze Honey Glazed Chicken Wings"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                      required
                    />
                  </div>

                  {/* Category Link Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Assigned Menu Category Tab</label>
                    <select
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price in ETB */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Price in Ethiopian Birr (ETB)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 250"
                      value={itemForm.price}
                      min="0"
                      onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl font-mono text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                      required
                    />
                  </div>

                  {/* Image URL Asset */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                      <Image className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Photography / Image URL Asset Option</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. https://images.unsplash.com/... or relative address path"
                        value={itemForm.image}
                        onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                        className="w-full flex-grow px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                      />
                      {itemForm.image && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-brand-light bg-brand-cream/60">
                          <img src={itemForm.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Descriptive Culinary Profile</label>
                    <textarea
                      placeholder="Provide an appetizing and rich narrative of the dish ingredients, spice grades, and texture."
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary min-h-[90px]"
                      required
                    />
                  </div>

                  {/* ingredients String */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Core Raw Ingredients (Comma separated items)</label>
                    <input
                      type="text"
                      placeholder="e.g. Seasoned chicken skin, Awaze sweet glaze, Roasted garlic infusion, Blue sheep cheese dip"
                      value={itemForm.ingredientsString}
                      onChange={(e) => setItemForm({ ...itemForm, ingredientsString: e.target.value })}
                      className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                    <span className="block text-[10px] text-brand-muted">
                      Items will split into formatted bullet details automatically on the visual card pages.
                    </span>
                  </div>

                  {/* prepTime and Calories */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Prep Time / Cooking Duration</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10-12 mins"
                      value={itemForm.prepTime}
                      onChange={(e) => setItemForm({ ...itemForm, prepTime: e.target.value })}
                      className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Caloric Value estimate</label>
                    <input
                      type="text"
                      placeholder="e.g. 520 kcal"
                      value={itemForm.calories}
                      onChange={(e) => setItemForm({ ...itemForm, calories: e.target.value })}
                      className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  {/* Dietary & Stock Toggles Row */}
                  <div className="bg-brand-light/35 border border-brand-light/40 rounded-2xl p-4 md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={itemForm.isAvailable}
                        onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                        className="rounded border-brand-light text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-black text-brand-dark leading-3">Available</span>
                        <span className="block text-[8px] text-brand-muted">Is currently in stock</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={itemForm.isPopular}
                        onChange={(e) => setItemForm({ ...itemForm, isPopular: e.target.checked })}
                        className="rounded border-brand-light text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-black text-brand-dark leading-3">🔥 Popular</span>
                        <span className="block text-[8px] text-brand-muted">Featured Choice badge</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={itemForm.isSpicy}
                        onChange={(e) => setItemForm({ ...itemForm, isSpicy: e.target.checked })}
                        className="rounded border-brand-light text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-black text-brand-dark leading-3">🌶️ Spicy</span>
                        <span className="block text-[8px] text-brand-muted">Red hot warning indicator</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={itemForm.isVegetarian}
                        onChange={(e) => setItemForm({ ...itemForm, isVegetarian: e.target.checked })}
                        className="rounded border-brand-light text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-black text-brand-dark leading-3">🌱 Veggie</span>
                        <span className="block text-[8px] text-brand-muted">Green earth symbol</span>
                      </div>
                    </label>
                  </div>

                  {/* Actions buttons */}
                  <div className="md:col-span-2 pt-4 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingItem(false);
                        setEditingItemId(null);
                      }}
                      className="px-5 py-2.5 border border-brand-light hover:bg-brand-cream/60 text-brand-dark text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand-primary hover:bg-brand-dark text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer animate-pulse-subtle"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAddingItem ? 'Draft & Publish Item' : 'Save Recipe Updates'}</span>
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

            {/* List Table of Items */}
            <div className="bg-white rounded-3xl border border-brand-light shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-light/35 text-[10px] font-black uppercase tracking-wider text-brand-muted border-b border-brand-light">
                      <th className="py-4 px-5">Dish Description / Identity</th>
                      <th className="py-4 px-4">Menu Section</th>
                      <th className="py-4 px-4 font-mono text-center">Cost (ETB)</th>
                      <th className="py-4 px-4 text-center">Features</th>
                      <th className="py-4 px-4 text-center">In Stock</th>
                      <th className="py-4 px-5 text-center">Operational Flags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-light/75 text-xs text-brand-dark">
                    {menuItems.map((item) => (
                      <tr key={item.id} className={`hover:bg-brand-cream/20 transition-colors ${!item.isAvailable ? 'bg-gray-50/50' : ''}`}>
                        
                        {/* Avatar name description */}
                        <td className="py-4 px-5 max-w-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-brand-cream/60 flex-shrink-0 border border-brand-light/50 relative">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              {!item.isAvailable && <div className="absolute inset-0 bg-brand-dark/45 backdrop-blur-[0.5px] whitespace-nowrap overflow-hidden flex items-center justify-center text-[7px] text-white font-bold tracking-widest uppercase">OUT</div>}
                            </div>
                            <div className="min-w-0">
                              <span className="block font-serif font-black text-brand-dark text-sm truncate">{item.name}</span>
                              <span className="block text-[10px] text-brand-muted tracking-tight font-mono">ID: {item.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category badge */}
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded bg-brand-light/30 text-brand-primary border border-brand-light text-[9px] font-bold uppercase tracking-wider">
                            {categories.find(c => c.id === item.category)?.icon || '⭐'} {categories.find(c => c.id === item.category)?.name || item.category}
                          </span>
                        </td>

                        {/* Price formatted */}
                        <td className="py-4 px-4 text-center font-mono font-bold text-brand-primary focus:text-brand-dark">
                          {item.price} ETB
                        </td>

                        {/* Nutritional and details metrics */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap max-w-[120px] mx-auto">
                            {item.isPopular && <span className="text-[10px]" title="Popular feature flag">🔥</span>}
                            {item.isSpicy && <span className="text-[10px]" title="Spicy scale flag">🌶️</span>}
                            {item.isVegetarian && <span className="text-[10px]" title="Pure organic vegetarian">🌱</span>}
                            {!item.isPopular && !item.isSpicy && !item.isVegetarian && <span className="text-[10px] text-brand-muted">—</span>}
                          </div>
                        </td>

                        {/* Availability Toggle Switch */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => updateItem(item.id, { isAvailable: !item.isAvailable })}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              item.isAvailable ? 'bg-brand-primary' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                item.isAvailable ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Actions buttons */}
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-1.5 hover:bg-brand-light/40 rounded-lg text-brand-primary transition-colors cursor-pointer"
                              title="Edit item information"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${item.name}" from your digital menu?`)) {
                                  deleteItem(item.id);
                                }
                              }}
                              className="p-1.5 hover:bg-pink-50 rounded-lg text-pink-700 transition-colors cursor-pointer"
                              title="Delete menu item permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                    {menuItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-brand-muted">
                          No menu items found. Get started by drafting a new recipe!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TAB CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-brand-dark">Menu Tab Sections configuration</h3>
              {!isAddingCategory && !editingCategoryId && (
                <button
                  onClick={handleOpenCreateCategory}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary hover:bg-brand-dark text-white text-xs font-black rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Draft New Category</span>
                </button>
              )}
            </div>

            {/* Expandable Form: Add/Edit Category */}
            {(isAddingCategory || editingCategoryId) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-xs space-y-6 max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-between border-b border-brand-light pb-3">
                  <h4 className="font-serif text-md font-extrabold text-brand-dark">
                    {isAddingCategory ? 'Drafting New Tab Category' : `Editing Tab Section: ${categoryForm.name}`}
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddingCategory(false);
                      setEditingCategoryId(null);
                    }}
                    className="p-1.5 rounded-lg border border-brand-light text-brand-muted hover:bg-brand-light/40 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Unique Slug Handle */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Unique slug handle ID</label>
                      <input
                        type="text"
                        disabled={!!editingCategoryId}
                        placeholder="e.g. coffee, fastfood"
                        value={categoryForm.id}
                        onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                        className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
                        required
                      />
                    </div>

                    {/* Category Title */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Readable Tab Label title</label>
                      <input
                        type="text"
                        placeholder="e.g. Premium Espresso & Brews"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        required
                      />
                    </div>

                    {/* Category Icon Emoji */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Visual Icon Emoji</label>
                      <input
                        type="text"
                        placeholder="Single Emoji, e.g. 🥧, 🥤"
                        maxLength={4}
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                        className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary text-center font-mono"
                        required
                      />
                    </div>

                    {/* Category Description text */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Lobby Sub-header blurb description</label>
                      <input
                        type="text"
                        placeholder="Explain the delights of this section (e.g., Traditional single-origin roasts...)"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="pt-4 flex justify-end gap-2.5 border-t border-brand-light">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setEditingCategoryId(null);
                      }}
                      className="px-5 py-2 border border-brand-light hover:bg-brand-cream/60 text-brand-dark text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand-primary hover:bg-brand-dark text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAddingCategory ? 'Publish Category Section' : 'Save Section Profile'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* List Grid of Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const itemCount = menuItems.filter(item => item.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 bg-white border border-brand-light rounded-2xl shadow-xs relative flex flex-col justify-between"
                  >
                    <div className="space-y-2.5 text-left">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-1 bg-brand-cream border border-brand-light/30 rounded-xl w-12 h-12 flex items-center justify-center">
                            {cat.icon}
                          </span>
                          <div>
                            <span className="block font-serif font-black text-brand-dark text-md leading-tight">{cat.name}</span>
                            <span className="block text-[9px] font-mono text-brand-primary tracking-wider uppercase font-bold">Slug: {cat.id}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-light text-brand-primary rounded-md">
                          {itemCount} item(s)
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                        {cat.description}
                      </p>
                    </div>

                    <div className="border-t border-brand-light/60 mt-4 pt-3 flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary border border-brand-light px-3 py-1.5 rounded-lg hover:bg-brand-cream/40 transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Section</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategoryWithConfirm(cat.id, cat.name)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-pink-700 border border-pink-200/50 bg-pink-50/55 px-3 py-1.5 rounded-lg hover:bg-pink-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Tab</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STORE PROFILE */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn text-left">
            <h3 className="font-serif text-lg font-bold text-brand-dark">Brand Settings / Operational metadata</h3>
            
            <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-xs space-y-5">
              
              {settingsSuccess && (
                <div className="p-3 bg-[#e8f5e9] border border-[#2e7d32]/20 text-[#2e7d32] text-xs font-bold rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Restaurant profiles updated successfully to system database context!</span>
                </div>
              )}

              {/* Restaurant Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Brand / Organization name</label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Marketing slogan / tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              {/* Location Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Store Location / Address summary</label>
                <input
                  type="text"
                  value={settingsForm.location}
                  onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              {/* Detailed Location address */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Precise Coordinates description</label>
                <textarea
                  value={settingsForm.placeDetail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, placeDetail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary min-h-[70px]"
                  required
                />
              </div>

              {/* Phone Line */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Contact Hotline Phone</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-bold tracking-wide font-mono focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              {/* Working Hours */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">Working hours agenda</label>
                <input
                  type="text"
                  value={settingsForm.workingHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                  className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              {/* Submit Settings option */}
              <div className="pt-3 border-t border-brand-light/70 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-primary hover:bg-brand-dark text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Store Metadata</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
