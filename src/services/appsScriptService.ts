import { Dish, CategoryId } from '../types';
import {
  getFoodImageAndTheme,
  fetchPublicAmanTradersExcelData,
  fetchPublicAmanTradeDishes,
} from './googleSheetsService';

export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycby7XmKgjM8K9bUM3o2w4wCCsJA_z9EMSEm098-cJoI6TtjkupXNG876f08xauO1ga8dZA/exec';

export function getAppsScriptUrl(): string {
  return (
    localStorage.getItem('aman_traders_apps_script_url') || DEFAULT_APPS_SCRIPT_URL
  );
}

export function setAppsScriptUrl(url: string) {
  if (url && url.trim()) {
    localStorage.setItem('aman_traders_apps_script_url', url.trim());
  } else {
    localStorage.removeItem('aman_traders_apps_script_url');
  }
}

export interface AppsScriptRawItem {
  bill_no?: string | number;
  name?: string;
  item_name?: string;
  price?: number | string;
  qty?: number | string;
  stock?: number | string;
  gst?: number | string;
  unit?: string;
  discount?: number | string;
}

export interface AppsScriptCatalogResponse {
  status: string;
  items?: AppsScriptRawItem[];
  message?: string;
}

/**
 * Fetches live catalog and current stock from the Google Apps Script web app.
 */
export async function fetchCatalogFromAppsScript(
  scriptUrl = getAppsScriptUrl()
): Promise<{ dishes: Dish[]; stockMap: Record<string, number> }> {
  const res = await fetch(scriptUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Apps Script responded with HTTP ${res.status}`);
  }

  const data: AppsScriptCatalogResponse = await res.json();
  const rawItems = data.items || [];

  // 1. Fetch catalog dishes from the NEW 'amantrade' sheet (1Fr_Jgu-wXR9hUGO1RK293XzKjVPT_7wBAaaSQBmZzvs)
  const amantradeDishes = await fetchPublicAmanTradeDishes().catch(() => []);

  // 2. Fetch media links map from amantrade sheet
  const excelMediaMap = await fetchPublicAmanTradersExcelData().catch(() => ({}));

  const dishes: Dish[] = [];
  const stockMap: Record<string, number> = {};

  // Filter out non-product rows (like order logs "ORD-...", blank rows, etc.)
  const validProducts = rawItems.filter((item) => {
    const rawName = String(item.name || item.item_name || '').trim();
    if (!rawName || rawName.length < 2) return false;
    if (rawName.startsWith('ORD-') || rawName.toLowerCase().startsWith('order-')) return false;
    // Price must not be a customer label
    if (typeof item.price === 'string' && item.price.toLowerCase().includes('customer')) {
      return false;
    }
    return true;
  });

  // Populate stockMap from Sheet 2 items
  validProducts.forEach((item, index) => {
    const itemName = String(item.name || item.item_name || '').trim();
    const cleanId =
      itemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      `item-${index + 1}`;
    const numStock = typeof item.stock === 'number' ? item.stock : parseInt(String(item.stock), 10);
    const safeStock = Number.isNaN(numStock) ? 50 : Math.max(0, numStock);

    stockMap[cleanId] = safeStock;
    stockMap[itemName.toLowerCase()] = safeStock;
    stockMap[itemName.toLowerCase().replace(/[^a-z0-9]/g, '')] = safeStock;
  });

  const addedDishNames = new Set<string>();

  // First, add all catalog dishes from the new 'amantrade' sheet
  amantradeDishes.forEach((d) => {
    const cleanName = d.name.toLowerCase().trim();
    const cleanKey = cleanName.replace(/[^a-z0-9]/g, '');
    const stockVal = stockMap[d.id] ?? stockMap[cleanName] ?? stockMap[cleanKey] ?? (cleanName.includes('coca') ? stockMap['coca cola'] : undefined);
    const finalStock = stockVal !== undefined ? stockVal : 50;

    stockMap[d.id] = finalStock;
    stockMap[cleanName] = finalStock;
    d.isAvailable = finalStock > 0;

    dishes.push(d);
    addedDishNames.add(cleanName);
    addedDishNames.add(cleanKey);
    if (cleanName === 'coca') {
      addedDishNames.add('coca cola');
    }
  });

  // Next, add any items from Sheet 2 inventory that are not yet in amantrade sheet
  validProducts.forEach((item, index) => {
    const itemName = String(item.name || item.item_name || '').trim();
    const lowerName = itemName.toLowerCase();
    const cleanKey = lowerName.replace(/[^a-z0-9]/g, '');

    if (addedDishNames.has(lowerName) || addedDishNames.has(cleanKey)) {
      return;
    }

    const cleanId =
      lowerName.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      `item-${index + 1}`;

    const numPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 50;
    const numStock = typeof item.stock === 'number' ? item.stock : parseInt(String(item.stock), 10);
    const safeStock = Number.isNaN(numStock) ? 50 : Math.max(0, numStock);

    const numDiscount =
      typeof item.discount === 'number'
        ? item.discount
        : parseFloat(String(item.discount)) || 0;

    const excelInfo = (excelMediaMap as any)[cleanKey] || (excelMediaMap as any)[lowerName];

    const category: CategoryId =
      excelInfo?.category?.toLowerCase().includes('bake') ||
      lowerName.includes('cake') ||
      lowerName.includes('biscuit') ||
      lowerName.includes('bread') ||
      lowerName.includes('pastry') ||
      lowerName.includes('bake')
        ? 'bakery'
        : 'confectionery';

    const theme = getFoodImageAndTheme(itemName, category);

    // Fetch real Image from Column J of amantrade sheet if available
    const imageUrl =
      excelInfo?.imageUrl ||
      (lowerName.includes('coca')
        ? 'https://i.ibb.co/Lz2SPs19/IMG-20261004-WA2752.jpg'
        : theme.imageUrl);

    const reelUrl = excelInfo?.reelUrl;
    const youtubeUrl = excelInfo?.youtubeUrl;
    const facebookUrl = excelInfo?.facebookUrl;

    dishes.push({
      id: cleanId,
      name: itemName,
      hindiName: itemName,
      category,
      price: numPrice > 0 ? numPrice : 50,
      originalPrice: numDiscount > 0 ? Math.round(numPrice * (1 + numDiscount / 100)) : undefined,
      discountBadge: numDiscount > 0 ? `${numDiscount}% OFF` : undefined,
      weightOrUnit: item.unit ? String(item.unit).trim() : 'Pcs / Pack',
      rating: 4.8,
      ratingCount: 25 + index * 5,
      isVeg: true,
      isSpecial: true,
      isRecommended: true,
      isAvailable: safeStock > 0,
      byOwnerSpecial: true,
      description: `Fresh ${itemName} directly from Aman Traders live inventory.`,
      imageUrl,
      reelUrl,
      facebookUrl,
      youtubeUrl,
      visualTheme: {
        bgGradient: theme.bgGradient,
        foodType: theme.foodType,
        accentColor: theme.accentColor,
      },
    });

    addedDishNames.add(lowerName);
  });

  return { dishes, stockMap };
}

export interface DeductOrderPayload {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  delivery_address?: string;
  items: {
    name: string;
    item_name: string;
    qty: number;
  }[];
}

/**
 * Deducts stock from Google Sheet via Apps Script by matching item names.
 * Uses text/plain to avoid CORS preflight issues on Google Apps Script Web App redirects.
 */
export async function deductStockViaAppsScript(
  payload: DeductOrderPayload,
  scriptUrl = getAppsScriptUrl()
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Apps Script responded with HTTP ${res.status}`);
    }

    const data = await res.json().catch(() => ({ status: 'success' }));
    return {
      success: true,
      message: data.message || 'Stock successfully deducted via Apps Script matching item name.',
    };
  } catch (err: any) {
    console.error('Failed to deduct stock via Apps Script:', err);
    throw err;
  }
}
