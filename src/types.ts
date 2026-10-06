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
  byOwnerSpecial?: boolean;
  visualTheme: {
    bgGradient: string;
    foodType: 'kheer' | 'gulab_jamun' | 'malai_roll' | 'rasgulla' | 'kaju_katli' | 'jalebi' | 'samosa' | 'chaat' | 'chowmein' | 'momos' | 'pizza' | 'burger' | 'pastry' | 'lassi' | 'colddrink' | 'chocolate' | 'generic';
    accentColor: string;
  };
  // Connected Google Sheet Columns (1CRsQmQNNOUj7bbyRJYLhcUpxi8LyfQ0jOTVZG8a_x9w)
  billNo?: string;        // Col A: bill_no
  stock?: number;         // Col E: stock
  gst?: number;           // Col F: gst
  dateAdded?: string;     // Col G: Date
  customTotal?: number;   // Col H: coustomtotal
  unit?: string;          // Col I: Unit
  discountVal?: number | string; // Col J: Discount
  youtubeUrl?: string;    // Col K: youtube
  instagramUrl?: string;  // Col L: instagram
  facebookUrl?: string;   // Col M: facebook
  offersText?: string;    // Col N: offers
  deliveryValue?: number; // Col P: Delivery value
  deliveryDescription?: string; // Col Q: Delivery discription
  isFromGoogleSheet?: boolean;
  sheetRowIndex?: number;
}

export interface SheetRowItem {
  billNo: string;        // Col A: bill_no
  itemName: string;      // Col B: item_name
  price: number;         // Col C: price
  qty: number;           // Col D: qty
  stock: number;         // Col E: stock
  gst: number;           // Col F: gst
  date: string;          // Col G: Date
  customTotal?: number;  // Col H: coustomtotal
  unit: string;          // Col I: Unit
  discount?: string;     // Col J: Discount
  youtube?: string;      // Col K: youtube
  instagram?: string;    // Col L: instagram
  facebook?: string;     // Col M: facebook
  offers?: string;       // Col N: offers
  imageUrl?: string;     // Col O: imageurl
  deliveryValue?: number; // Col P: Delivery value
  deliveryDescription?: string; // Col Q: Delivery discription
  rowIndex: number;
}

export interface DeliverySettings {
  charge: number;
  description: string;
  freeThreshold?: number;
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
  email?: string;
  address?: string;
  password?: string;
  createdAt?: string;
}

