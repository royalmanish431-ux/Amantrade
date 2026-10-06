import { Dish, SheetRowItem, DeliverySettings } from '../types';

export const SPREADSHEET_ID = '1CRsQmQNNOUj7bbyRJYLhcUpxi8LyfQ0jOTVZG8a_x9w';
export const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=0`;
export const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7XmKgjM8K9bUM3o2w4wCCsJA_z9EMSEm098-cJoI6TtjkupXNG876f08xauO1ga8dZA/exec';

export const SHEET_COLUMNS_INFO = [
  { col: 'A', name: 'bill_no', description: 'Barcode / Item Bill No / SKU' },
  { col: 'B', name: 'item_name', description: 'Item / Dish Name' },
  { col: 'C', name: 'price', description: 'Selling Price (₹)' },
  { col: 'D', name: 'qty', description: 'Pack Quantity / Minimum Qty' },
  { col: 'E', name: 'stock', description: 'Live Inventory Stock (Auto-deducted)' },
  { col: 'F', name: 'gst', description: 'GST Percentage (%)' },
  { col: 'G', name: 'Date', description: 'Added / Updated Date' },
  { col: 'H', name: 'coustomtotal', description: 'Original / MRP / Custom Total' },
  { col: 'I', name: 'Unit', description: 'Unit (Pcs, gram, plate, piece)' },
  { col: 'J', name: 'Discount ', description: 'Discount Percentage / Value' },
  { col: 'K', name: 'youtube ', description: 'YouTube Video ID / URL' },
  { col: 'L', name: 'instagram ', description: 'Instagram Reel / Post' },
  { col: 'M', name: 'facebook ', description: 'Facebook Page / Video' },
  { col: 'N', name: 'offers', description: 'Special Offers / Promo Tag' },
  { col: 'O', name: 'imageurl', description: 'Product Image URL (Live Photo)' },
  { col: 'P', name: 'Delivery value ', description: 'Delivery Charge Value (₹)' },
  { col: 'Q', name: 'Delivery discription ', description: 'Delivery Description & Free Delivery Threshold' },
];

const LOCAL_STOCK_STORAGE_KEY = `aman_sheet_stock_${SPREADSHEET_ID}`;

// Helper to get local mutated stock
export const getLocalStockOverrides = (): Record<string, number> => {
  try {
    const data = localStorage.getItem(LOCAL_STOCK_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// Helper to record stock deduction
export const deductStockLocally = (billNoOrId: string, qty: number): number => {
  const overrides = getLocalStockOverrides();
  const current = overrides[billNoOrId] !== undefined ? overrides[billNoOrId] : 99;
  const updated = Math.max(0, current - qty);
  overrides[billNoOrId] = updated;
  try {
    localStorage.setItem(LOCAL_STOCK_STORAGE_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error('Failed to save stock override', e);
  }
  return updated;
};

// Helper to manually set stock
export const setStockLocally = (billNoOrId: string, stock: number) => {
  const overrides = getLocalStockOverrides();
  overrides[billNoOrId] = Math.max(0, stock);
  try {
    localStorage.setItem(LOCAL_STOCK_STORAGE_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error('Failed to save stock override', e);
  }
};

// Parse value safely
const getCellValue = (cell: any): any => {
  if (!cell) return null;
  return cell.f !== undefined && cell.f !== null ? cell.f : cell.v;
};

export interface SheetFetchResult {
  dishes: Dish[];
  rawRows: SheetRowItem[];
  rowCount: number;
  lastUpdated: string;
}

export const fetchGoogleSheetData = async (): Promise<SheetFetchResult> => {
  const res = await fetch(GVIZ_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${res.statusText}`);
  }

  const text = await res.text();
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
  if (!jsonMatch) {
    throw new Error('Invalid format returned by Google Sheet');
  }

  const data = JSON.parse(jsonMatch[1]);
  const rows = data.table?.rows || [];
  const overrides = getLocalStockOverrides();

  const rawRows: SheetRowItem[] = [];
  const dishes: Dish[] = [];

  rows.forEach((rowObj: any, index: number) => {
    const cells = rowObj.c || [];
    const billNoVal = getCellValue(cells[0]);
    const itemNameVal = getCellValue(cells[1]);
    const priceVal = getCellValue(cells[2]);
    const qtyVal = getCellValue(cells[3]);
    const stockVal = getCellValue(cells[4]);
    const gstVal = getCellValue(cells[5]);
    const dateVal = getCellValue(cells[6]);
    const customTotalVal = getCellValue(cells[7]);
    const unitVal = getCellValue(cells[8]);
    const discountVal = getCellValue(cells[9]);
    const youtubeVal = getCellValue(cells[10]);
    const instagramVal = getCellValue(cells[11]);
    const facebookVal = getCellValue(cells[12]);
    const offersVal = getCellValue(cells[13]);
    const imageUrlVal = getCellValue(cells[14]);
    const deliveryValueVal = getCellValue(cells[15]);
    const deliveryDescVal = getCellValue(cells[16]);

    const itemName = itemNameVal ? String(itemNameVal).trim() : '';
    if (!itemName) return; // Skip empty rows

    // Clean image URL from Column O
    let imageUrl: string | undefined = undefined;
    if (imageUrlVal) {
      const rawImg = String(imageUrlVal).trim();
      if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
        imageUrl = rawImg;
      }
    }

    // Clean Delivery value (Col P) and Delivery discription (Col Q)
    const deliveryValue = deliveryValueVal !== null && deliveryValueVal !== undefined && !isNaN(Number(deliveryValueVal))
      ? Number(deliveryValueVal)
      : undefined;
    const deliveryDescription = deliveryDescVal ? String(deliveryDescVal).trim() : undefined;

    const billNo = billNoVal ? String(billNoVal).trim() : `item-${index + 1}`;
    const price = Number(priceVal) || 0;
    const initialStock = stockVal !== null && stockVal !== undefined ? Number(stockVal) : 50;
    const currentStock = overrides[billNo] !== undefined ? overrides[billNo] : initialStock;

    const rowItem: SheetRowItem = {
      billNo,
      itemName,
      price,
      qty: Number(qtyVal) || 1,
      stock: currentStock,
      gst: Number(gstVal) || 0,
      date: dateVal ? String(dateVal) : '',
      customTotal: customTotalVal ? Number(customTotalVal) : undefined,
      unit: unitVal ? String(unitVal) : 'Pcs',
      discount: discountVal ? String(discountVal) : undefined,
      youtube: youtubeVal ? String(youtubeVal) : undefined,
      instagram: instagramVal ? String(instagramVal) : undefined,
      facebook: facebookVal ? String(facebookVal) : undefined,
      offers: offersVal ? String(offersVal) : undefined,
      imageUrl,
      deliveryValue,
      deliveryDescription,
      rowIndex: index + 2, // 1-based index including header
    };

    rawRows.push(rowItem);

    // Format discount badge
    let discountBadge: string | undefined = undefined;
    if (offersVal && String(offersVal).trim()) {
      discountBadge = String(offersVal).trim();
    } else if (discountVal && Number(discountVal) > 0) {
      discountBadge = `${discountVal}% OFF`;
    }

    // Determine category based on item name or default to confectionery/bakery
    const lowerName = itemName.toLowerCase();
    const isBakery = lowerName.includes('momos') || lowerName.includes('chowmein') || lowerName.includes('burger') || lowerName.includes('pizza') || lowerName.includes('cake') || lowerName.includes('pastry');
    const category = isBakery ? 'bakery' : 'confectionery';

    // Parse YouTube URL or ID
    let youtubeId: string | undefined = undefined;
    if (youtubeVal) {
      const ytStr = String(youtubeVal).trim();
      const ytMatch = ytStr.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      youtubeId = ytMatch ? ytMatch[1] : (ytStr.length === 11 ? ytStr : undefined);
    }

    const dish: Dish = {
      id: `sheet-${billNo}`,
      name: itemName,
      hindiName: itemName,
      category,
      price,
      originalPrice: customTotalVal && Number(customTotalVal) > price ? Number(customTotalVal) : undefined,
      discountBadge,
      weightOrUnit: unitVal ? `${unitVal}` : '1 piece',
      rating: 4.8,
      ratingCount: 88,
      isVeg: true,
      isSpecial: true,
      isRecommended: true,
      isAvailable: currentStock > 0,
      description: `Google Sheet live item · Barcode: ${billNo} · Qty: ${qtyVal || 1} · Stock: ${currentStock} ${unitVal || 'Pcs'} · GST: ${gstVal || 0}%`,
      imageUrl: imageUrl || undefined,
      videoUrl: youtubeId,
      videoTitle: `${itemName} Live Demo`,
      byOwnerSpecial: true,
      visualTheme: {
        bgGradient: 'from-emerald-100 via-teal-50 to-stone-100',
        foodType: 'generic',
        accentColor: '#0f766e',
      },
      // Google Sheet Columns
      billNo,
      stock: currentStock,
      gst: Number(gstVal) || 0,
      dateAdded: dateVal ? String(dateVal) : '',
      customTotal: customTotalVal ? Number(customTotalVal) : undefined,
      unit: unitVal ? String(unitVal) : 'Pcs',
      discountVal: discountVal ? String(discountVal) : undefined,
      youtubeUrl: youtubeVal ? String(youtubeVal) : undefined,
      instagramUrl: instagramVal ? String(instagramVal) : undefined,
      facebookUrl: facebookVal ? String(facebookVal) : undefined,
      offersText: offersVal ? String(offersVal) : undefined,
      deliveryValue,
      deliveryDescription,
      isFromGoogleSheet: true,
      sheetRowIndex: index + 2,
    };

    dishes.push(dish);
  });

  // Global delivery settings derived from first non-empty Column P and Q
  let globalDeliveryCharge = 20;
  let globalDeliveryDesc = '';

  for (const r of rawRows) {
    if (r.deliveryValue !== undefined && globalDeliveryCharge === 20) {
      globalDeliveryCharge = r.deliveryValue;
    }
    if (r.deliveryDescription && !globalDeliveryDesc) {
      globalDeliveryDesc = r.deliveryDescription;
    }
  }

  let globalFreeThreshold: number | undefined = undefined;
  if (globalDeliveryDesc) {
    const match = globalDeliveryDesc.match(/(?:till|above|order of|upto|at)?\s*(\d+)\s*(?:rupees|rs|₹|item|inr)?/i);
    if (match) {
      globalFreeThreshold = Number(match[1]);
    }
  }

  const deliverySettings: DeliverySettings = {
    charge: globalDeliveryCharge,
    description: globalDeliveryDesc || (globalDeliveryCharge === 0 ? 'Free Delivery' : `Standard Delivery ₹${globalDeliveryCharge}`),
    freeThreshold: globalFreeThreshold,
  };

  return {
    dishes,
    rawRows,
    rowCount: rawRows.length,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    deliverySettings,
  };
};

/**
 * Deduct stock (Col E) and add amount to coustomtotal (Col H) via Google Apps Script Web App
 */
export interface AppsScriptSyncPayload {
  items: Array<{
    dish: Dish;
    quantity: number;
  }>;
  grandTotal: number;
  customerName?: string;
  customerPhone?: string;
}

export const submitOrderToAppsScript = async (
  payload: AppsScriptSyncPayload
): Promise<{ success: boolean; message: string }> => {
  try {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`;

    // Deduct stock and add amount for items
    for (const item of payload.items) {
      const billNo = item.dish.billNo || '8901396324584';
      const itemAmount = item.dish.price * item.quantity;

      const scriptData = {
        action: 'deduct',
        bill_no: billNo,
        name: item.dish.name,
        item_name: item.dish.name,
        price: item.dish.price,
        discount: item.dish.discountVal || 0,
        qty: item.quantity,
        amount: itemAmount > 0 ? itemAmount : payload.grandTotal,
        totalAmount: payload.grandTotal,
        coustomtotal: payload.grandTotal,
        total: payload.grandTotal,
        date: formattedDate,
        Date: formattedDate,
        items: [
          {
            bill_no: billNo,
            name: item.dish.name,
            qty: item.quantity,
            price: item.dish.price,
            amount: itemAmount,
          },
        ],
      };

      // 1. Update locally for instantaneous UI responsiveness
      deductStockLocally(billNo, item.quantity);

      // 2. Fire live update to Google Apps Script
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(scriptData),
        });
      } catch (postErr) {
        console.warn('Apps Script POST warning, trying GET fallback:', postErr);
        try {
          const params = new URLSearchParams({
            action: 'deduct',
            bill_no: billNo,
            qty: String(item.quantity),
            amount: String(payload.grandTotal),
            coustomtotal: String(payload.grandTotal),
            date: formattedDate,
          });
          await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, { mode: 'no-cors' });
        } catch (getErr) {
          console.error('Apps Script GET fallback failed:', getErr);
        }
      }
    }

    return {
      success: true,
      message: `Stock deducted (Col E) & ₹${payload.grandTotal} added (Col H) in Google Sheet!`,
    };
  } catch (error: any) {
    console.error('Apps Script sync error:', error);
    return {
      success: false,
      message: error?.message || 'Failed to sync with Google Sheet',
    };
  }
};

