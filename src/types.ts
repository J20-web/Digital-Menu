export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  ingredients: string[];
  price: number; // in ETB
  image: string;
  isPopular?: boolean;
  calories?: string;
  prepTime?: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
}

export type Category = 'burgers' | 'sides' | 'drinks' | 'desserts';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
}

export interface RestaurantMetadata {
  name: string;
  tagline: string;
  location: string;
  placeDetail: string;
  phone: string;
  workingHours: string;
}
