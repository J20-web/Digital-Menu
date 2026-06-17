import { MenuItem, CategoryInfo, RestaurantMetadata } from './types';
import menuData from './menu.json';

// Export restaurant metadata from menu.json
export const RESTAURANT_INFO: RestaurantMetadata = menuData.restaurant;

// Export categories from menu.json
export const CATEGORIES: CategoryInfo[] = menuData.categories as CategoryInfo[];

// Export menu items from menu.json
export const MENU_ITEMS: MenuItem[] = menuData.items as MenuItem[];
