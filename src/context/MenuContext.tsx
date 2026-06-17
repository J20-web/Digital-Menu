import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CategoryInfo, RestaurantMetadata } from '../types';
import { MENU_ITEMS, CATEGORIES, RESTAURANT_INFO } from '../data';

interface MenuContextType {
  menuItems: MenuItem[];
  categories: CategoryInfo[];
  restaurantInfo: RestaurantMetadata;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addCategory: (category: CategoryInfo) => void;
  updateCategory: (id: string, category: Partial<CategoryInfo>) => void;
  deleteCategory: (id: string) => void;
  addItem: (item: MenuItem) => void;
  updateItem: (id: string, item: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  resetToDefaults: () => void;
  updateRestaurantInfo: (info: Partial<RestaurantMetadata>) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdminState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('wow_is_admin');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('wow_is_authenticated');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem('wow_categories');
      return saved ? JSON.parse(saved) : CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('wow_menu_items');
      return saved ? JSON.parse(saved) : MENU_ITEMS;
    } catch {
      return MENU_ITEMS;
    }
  });

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantMetadata>(() => {
    try {
      const saved = localStorage.getItem('wow_restaurant_info');
      return saved ? JSON.parse(saved) : RESTAURANT_INFO;
    } catch {
      return RESTAURANT_INFO;
    }
  });

  // Keep localStorage updated
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('wow_is_admin', JSON.stringify(isAdmin));
    } else {
      localStorage.removeItem('wow_is_admin');
    }
  }, [isAdmin, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('wow_is_authenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('wow_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('wow_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('wow_restaurant_info', JSON.stringify(restaurantInfo));
  }, [restaurantInfo]);

  const setIsAdmin = (value: boolean) => {
    setIsAdminState(value);
  };

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === '1234') {
      setIsAuthenticated(true);
      setIsAdminState(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdminState(true);
    localStorage.removeItem('wow_is_authenticated');
    localStorage.removeItem('wow_is_admin');
  };

  const addCategory = (category: CategoryInfo) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, updatedFields: Partial<CategoryInfo>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields } : cat))
    );
    // If id changed (slug was renamed), also update any items with the old category id!
    if (updatedFields.id && updatedFields.id !== id) {
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.category === id ? { ...item, category: updatedFields.id as string } : item
        )
      );
    }
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    // Cascade delete: also delete items under this category
    setMenuItems((prev) => prev.filter((item) => item.category !== id));
  };

  const addItem = (item: MenuItem) => {
    setMenuItems((prev) => [...prev, item]);
  };

  const updateItem = (id: string, updatedFields: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateRestaurantInfo = (info: Partial<RestaurantMetadata>) => {
    setRestaurantInfo((prev) => ({ ...prev, ...info }));
  };

  const resetToDefaults = () => {
    setCategories(CATEGORIES);
    setMenuItems(MENU_ITEMS);
    setRestaurantInfo(RESTAURANT_INFO);
    setIsAdminState(false);
    setIsAuthenticated(false);
    localStorage.removeItem('wow_categories');
    localStorage.removeItem('wow_menu_items');
    localStorage.removeItem('wow_restaurant_info');
    localStorage.removeItem('wow_is_admin');
    localStorage.removeItem('wow_is_authenticated');
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        categories,
        restaurantInfo,
        isAdmin,
        setIsAdmin,
        isAuthenticated,
        login,
        logout,
        addCategory,
        updateCategory,
        deleteCategory,
        addItem,
        updateItem,
        deleteItem,
        resetToDefaults,
        updateRestaurantInfo,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
