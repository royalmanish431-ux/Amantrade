export type CategoryId = 
  | 'all'
  | 'confectionery'
  | 'bakery';

export interface Category {
  id: CategoryId;
  name: string;
  hindiName?: string;
  iconType: string;
  hasVideo?: boolean;
  imageUrl?: string;
}

export interface Dish {
  id: string;
  name: string;
  hindiName: string;
  category: CategoryId;
  price: number;
  halfPrice?: number;
  fullPrice?: number;
  originalPrice?: number;
  discountBadge?: string; // e.g. "50% OFF", "BUY 1 GET 1 FREE", "20% OFF"
  weightOrUnit: string; // e.g. "190 gram", "per piece", "300 milligram", "250 gram"
  rating: number;
  ratingCount: number;
  isVeg: boolean;
  isSpecial?: boolean;
  isRecommended?: boolean;
  isAvailable: boolean;
  description: string;
  imageUrl?: string;
  videoUrl?: string; // YouTube video ID or video preview
  videoTitle?: string;
  reelUrl?: string; // Instagram / Reel (from Sheet Column K, L, or M)
  facebookUrl?: string; // Facebook (from Sheet Column K, L, or M)
  youtubeUrl?: string; // YouTube (from Sheet Column K, L, or M)
  byOwnerSpecial?: boolean;
  visualTheme: {
    bgGradient: string;
    foodType: 'kheer' | 'gulab_jamun' | 'malai_roll' | 'rasgulla' | 'kaju_katli' | 'jalebi' | 'samosa' | 'chaat' | 'chowmein' | 'momos' | 'pizza' | 'burger' | 'pastry' | 'lassi' | 'colddrink' | 'chocolate' | 'generic';
    accentColor: string;
  };
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  selectedOption?: string;
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  flatDiscount?: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  taxes: number;
  couponDiscount: number;
  grandTotal: number;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'cod' | 'upi' | 'card';
  status: 'received' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  estimatedDeliveryTime: string;
  cookingInstructions?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  password: string; // 5-digit password
  registeredAt: string;
}
