import { Category, Dish } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'confectionery',
    name: 'General Store',
    hindiName: 'दुकान सामान',
    iconType: 'store',
  },
  {
    id: 'bakery',
    name: 'Packaged Goods',
    hindiName: 'पैकेज्ड उत्पाद',
    iconType: 'package',
  },
];

// No demo dishes or demo images - live data is fetched directly from Google Sheet
export const INITIAL_DISHES: Dish[] = [];

export const AVAILABLE_COUPONS: { code: string; discountPercent?: number; flatDiscount?: number; minOrder: number; description: string }[] = [
  { code: 'AMAN50', discountPercent: 50, minOrder: 99, description: '50% OFF up to ₹80 on orders above ₹99' },
  { code: 'AMANTRADERS', flatDiscount: 20, minOrder: 99, description: 'Flat ₹20 OFF on orders above ₹99' },
];
