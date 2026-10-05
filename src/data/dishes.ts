import { Category, Dish, Coupon } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'confectionery',
    name: 'Confectionery',
    hindiName: 'कन्फेक्शनरी',
    iconType: 'confectionery',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'bakery',
    name: 'Bakery',
    hindiName: 'बेकरी',
    iconType: 'bakery',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=80',
  },
];

/**
 * Initial real item from the user's 'amantraders' sheet.
 * All dummy data (kheer, samosa, pizza, etc.) has been completely removed.
 * Live items are fetched directly from the 'amantraders' sheet tab.
 */
export const INITIAL_DISHES: Dish[] = [
  {
    id: 'coca-cola',
    name: 'Coca cola',
    hindiName: 'कोका कोला',
    category: 'confectionery',
    price: 50,
    halfPrice: 50,
    weightOrUnit: 'Cold Beverage',
    rating: 4.8,
    ratingCount: 38,
    isVeg: true,
    isSpecial: true,
    isRecommended: true,
    isAvailable: true,
    byOwnerSpecial: true,
    description: 'Refreshing chilled Coca cola directly from Aman Traders confectionery.',
    imageUrl: 'https://i.ibb.co/Lz2SPs19/IMG-20261004-WA2752.jpg',
    reelUrl: 'https://www.instagram.com/reels/',
    facebookUrl: 'https://www.facebook.com/',
    youtubeUrl: 'https://www.youtube.com/',
    visualTheme: {
      bgGradient: 'from-red-100 via-rose-50 to-stone-100',
      foodType: 'colddrink',
      accentColor: '#dc2626',
    },
  },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'AMAN50',
    discountPercentage: 50,
    minOrder: 99,
    maxDiscount: 80,
    description: '50% OFF up to ₹80 on orders above ₹99',
  },
  {
    code: 'FREEDEL',
    flatDiscount: 30,
    minOrder: 150,
    description: 'Free Delivery on orders above ₹150',
  },
  {
    code: 'AMANTRADERS',
    flatDiscount: 20,
    minOrder: 99,
    description: 'Flat ₹20 OFF on orders above ₹99',
  },
];
