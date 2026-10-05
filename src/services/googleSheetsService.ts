import { Dish, CategoryId } from '../types';

// 1. New Menu & Catalog Spreadsheet (user's new sheet for amantrade catalog)
export const AMAN_TRADE_SPREADSHEET_ID = '1Fr_Jgu-wXR9hUGO1RK293XzKjVPT_7wBAaaSQBmZzvs';
export const AMAN_TRADE_SHEET_NAME = 'amantrade';
export const AMAN_TRADE_SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${AMAN_TRADE_SPREADSHEET_ID}/edit`;

// 2. Stock Spreadsheet (Sheet2 exclusively for live stock management & deduction)
export const STOCK_SPREADSHEET_ID = '1CRsQmQNNOUj7bbyRJYLhcUpxi8LyfQ0jOTVZG8a_x9w';
export const DEFAULT_SHEET_NAME = 'Sheet2';
export const STOCK_SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${STOCK_SPREADSHEET_ID}/edit`;

// Backwards-compatible aliases
export const AMAN_TRADERS_SPREADSHEET_ID = STOCK_SPREADSHEET_ID;
export const AMANTRADERS_SHEET_NAME = AMAN_TRADE_SHEET_NAME;
export const SPREADSHEET_URL = AMAN_TRADE_SPREADSHEET_URL;

export interface SheetRowData {
  rowIndex: number; // 1-based index (e.g. row 2 for first data row)
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number; // Column E
  status?: string;
  lastUpdated?: string;
}

export interface SheetDeductionResult {
  dishId: string;
  dishName: string;
  rowNumber: number;
  previousStock: number;
  deductedQuantity: number;
  newStock: number;
}

/**
 * Formats and URL-encodes a range string safely for Google Sheets REST API v4.
 * When the sheet name contains spaces or special characters, single quotes are required.
 * encodeURIComponent does not encode single quotes ('), which are replaced with %27.
 */
export function encodeRangeForUrl(sheetTitle: string, cellRange: string): string {
  const needsQuotes = /[\s\-\.\,\!\@\#\$\%\^\&\*\(\)\+]/.test(sheetTitle);
  const a1Notation = needsQuotes ? `'${sheetTitle}'!${cellRange}` : `${sheetTitle}!${cellRange}`;
  return encodeURIComponent(a1Notation).replace(/'/g, '%27');
}

/**
 * Fetches spreadsheet metadata to inspect title and available sheet tabs
 */
export async function fetchSpreadsheetMetadata(
  accessToken: string,
  spreadsheetId = AMAN_TRADERS_SPREADSHEET_ID
) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,sheets.properties`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to fetch spreadsheet (${res.status})`);
  }

  const data = await res.json();
  const sheetNames = (data.sheets || []).map((s: any) => s.properties?.title as string);
  return {
    title: data.properties?.title || 'amantraders',
    sheetNames,
  };
}

/**
 * Theme & image mapper for items in 'amantraders' sheet
 */
export function getFoodImageAndTheme(name: string, category: string) {
  const lower = name.toLowerCase();
  if (
    lower.includes('cola') ||
    lower.includes('coke') ||
    lower.includes('pepsi') ||
    lower.includes('drink') ||
    lower.includes('juice') ||
    lower.includes('soda') ||
    lower.includes('sprite') ||
    lower.includes('thums')
  ) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=640&q=80',
      foodType: 'colddrink' as const,
      bgGradient: 'from-red-100 via-rose-50 to-stone-100',
      accentColor: '#dc2626',
    };
  }
  if (
    lower.includes('choc') ||
    lower.includes('dairy milk') ||
    lower.includes('kitkat') ||
    lower.includes('cadbury') ||
    lower.includes('candy')
  ) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=640&q=80',
      foodType: 'chocolate' as const,
      bgGradient: 'from-amber-100 via-stone-100 to-amber-50',
      accentColor: '#78350f',
    };
  }
  if (
    lower.includes('cake') ||
    lower.includes('pastry') ||
    lower.includes('muffin') ||
    lower.includes('cupcake')
  ) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=640&q=80',
      foodType: 'pastry' as const,
      bgGradient: 'from-pink-100 via-rose-50 to-stone-100',
      accentColor: '#db2777',
    };
  }
  if (
    lower.includes('bread') ||
    lower.includes('bun') ||
    lower.includes('toast') ||
    lower.includes('rusk') ||
    lower.includes('biscuit') ||
    lower.includes('cookie') ||
    category === 'bakery'
  ) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=80',
      foodType: 'generic' as const,
      bgGradient: 'from-amber-100 via-orange-50 to-stone-100',
      accentColor: '#d97706',
    };
  }
  return {
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=640&q=80',
    foodType: 'generic' as const,
    bgGradient: 'from-emerald-100 via-teal-50 to-stone-100',
    accentColor: '#059669',
  };
}

/**
 * Publicly fetches the new 'amantrade' sheet data (no OAuth token required) to extract
 * exact images, Reels (Col J/L), YouTube (Col K), and Facebook (Col M) links.
 */
export async function fetchPublicAmanTradersExcelData(
  spreadsheetId = AMAN_TRADE_SPREADSHEET_ID
): Promise<
  Record<
    string,
    {
      imageUrl?: string;
      reelUrl?: string;
      youtubeUrl?: string;
      facebookUrl?: string;
      category?: string;
      price?: number;
      unit?: string;
      discount?: string;
    }
  >
> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${AMAN_TRADE_SHEET_NAME}`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const text = await res.text();
    const json = JSON.parse(text.replace(/^[^{]*/, '').replace(/[^}]*$/, ''));
    const rows = json.table?.rows || [];
    const map: Record<
      string,
      {
        imageUrl?: string;
        reelUrl?: string;
        youtubeUrl?: string;
        facebookUrl?: string;
        category?: string;
        price?: number;
        unit?: string;
        discount?: string;
      }
    > = {};

    for (const r of rows) {
      const vals = (r.c || []).map((c: any) =>
        c ? (c.f !== undefined ? c.f : c.v) : ''
      );
      const rawCategory = String(vals[0] || '').trim();
      const itemName = String(vals[1] || '').trim();
      if (!itemName) continue;

      const halfPrice = parseFloat(vals[2]) || 0;
      const fullPrice = parseFloat(vals[3]) || 0;
      const price = fullPrice > 0 ? fullPrice : halfPrice > 0 ? halfPrice : 50;
      const unit = String(vals[4] || '').trim();
      const offers = String(vals[5] || '').trim();
      const rawDiscount = String(vals[7] || '').trim();
      const discount = offers || rawDiscount;

      // Check Column J (index 9), Column K (index 10), Column L (index 11), Column M (index 12)
      const candidates = [vals[9], vals[10], vals[11], vals[12]].filter(Boolean);
      let reelUrl: string | undefined;
      let youtubeUrl: string | undefined;
      let facebookUrl: string | undefined;
      let imageUrl: string | undefined;

      for (const raw of candidates) {
        const u = String(raw).trim();
        if (!u.startsWith('http://') && !u.startsWith('https://')) continue;

        const lower = u.toLowerCase();
        if (
          lower.includes('instagram.com') ||
          lower.includes('/reel/') ||
          lower.includes('/reels/')
        ) {
          reelUrl = u;
        } else if (
          lower.includes('youtube.com') ||
          lower.includes('youtu.be')
        ) {
          youtubeUrl = u;
        } else if (
          lower.includes('facebook.com') ||
          lower.includes('fb.watch') ||
          lower.includes('fb.me') ||
          lower.includes('fb.com')
        ) {
          facebookUrl = u;
        } else if (
          lower.includes('ibb.co') ||
          lower.includes('.jpg') ||
          lower.includes('.png') ||
          lower.includes('.jpeg') ||
          lower.includes('.webp') ||
          lower.includes('images.unsplash.com')
        ) {
          imageUrl = u;
        }
      }

      const entry = {
        imageUrl,
        reelUrl,
        youtubeUrl,
        facebookUrl,
        category: rawCategory,
        price,
        unit,
        discount,
      };

      const cleanKey = itemName.toLowerCase().replace(/[^a-z0-9]/g, '');
      map[cleanKey] = entry;
      map[itemName.toLowerCase()] = entry;
    }
    return map;
  } catch (err) {
    console.warn('Failed to fetch public amantrade gviz data:', err);
    return {};
  }
}

/**
 * Publicly fetches full dishes list from the new 'amantrade' sheet.
 */
export async function fetchPublicAmanTradeDishes(
  spreadsheetId = AMAN_TRADE_SPREADSHEET_ID
): Promise<Dish[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${AMAN_TRADE_SHEET_NAME}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const json = JSON.parse(text.replace(/^[^{]*/, '').replace(/[^}]*$/, ''));
    const rows = json.table?.rows || [];
    const dishes: Dish[] = [];

    for (let i = 0; i < rows.length; i++) {
      const vals = (rows[i].c || []).map((c: any) =>
        c ? (c.f !== undefined ? c.f : c.v) : ''
      );
      const rawCategory = String(vals[0] || '').trim();
      const itemName = String(vals[1] || '').trim();
      if (!itemName) continue;

      const halfPrice = parseFloat(vals[2]) || 0;
      const fullPrice = parseFloat(vals[3]) || 0;
      const price = fullPrice > 0 ? fullPrice : halfPrice > 0 ? halfPrice : 50;
      const unit = String(vals[4] || '').trim() || 'Pcs / Pack';
      const offers = String(vals[5] || '').trim();
      const rawDiscount = String(vals[7] || '').trim();
      const numDiscount = parseFloat(rawDiscount) || 0;
      const discountBadge = offers || (numDiscount > 0 ? `${numDiscount}% OFF` : undefined);

      const category: CategoryId = rawCategory.toLowerCase().includes('bake')
        ? 'bakery'
        : 'confectionery';

      const theme = getFoodImageAndTheme(itemName, category);

      // Check media columns J, K, L, M
      const candidates = [vals[9], vals[10], vals[11], vals[12]].filter(Boolean);
      let reelUrl: string | undefined;
      let youtubeUrl: string | undefined;
      let facebookUrl: string | undefined;
      let imageUrl: string | undefined;

      for (const raw of candidates) {
        const u = String(raw).trim();
        if (!u.startsWith('http://') && !u.startsWith('https://')) continue;

        const lower = u.toLowerCase();
        if (
          lower.includes('instagram.com') ||
          lower.includes('/reel/') ||
          lower.includes('/reels/')
        ) {
          reelUrl = u;
        } else if (
          lower.includes('youtube.com') ||
          lower.includes('youtu.be')
        ) {
          youtubeUrl = u;
        } else if (
          lower.includes('facebook.com') ||
          lower.includes('fb.watch') ||
          lower.includes('fb.me') ||
          lower.includes('fb.com')
        ) {
          facebookUrl = u;
        } else if (
          lower.includes('ibb.co') ||
          lower.includes('.jpg') ||
          lower.includes('.png') ||
          lower.includes('.jpeg') ||
          lower.includes('.webp') ||
          lower.includes('images.unsplash.com')
        ) {
          imageUrl = u;
        }
      }

      const slugId =
        itemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
        `item-${i + 1}`;

      dishes.push({
        id: slugId,
        name: itemName,
        hindiName: itemName,
        category,
        price,
        halfPrice: halfPrice > 0 ? halfPrice : undefined,
        fullPrice: fullPrice > 0 ? fullPrice : undefined,
        weightOrUnit: unit,
        rating: 4.8,
        ratingCount: 30 + i * 5,
        isVeg: true,
        isSpecial: true,
        isRecommended: true,
        isAvailable: true,
        byOwnerSpecial: true,
        discountBadge,
        description: `Fresh ${itemName} from Aman Traders live catalog.`,
        imageUrl: imageUrl || theme.imageUrl,
        reelUrl,
        facebookUrl,
        youtubeUrl,
        visualTheme: {
          bgGradient: theme.bgGradient,
          foodType: theme.foodType,
          accentColor: theme.accentColor,
        },
      });
    }

    return dishes;
  } catch (err) {
    console.warn('Failed to fetch public amantrade dishes:', err);
    return [];
  }
}

/**
 * Fetches real menu items directly from the 'amantrade' sheet tab in the new spreadsheet.
 * Columns: A: Category, B: itemname, C: Half price, D: Full price, J: image, K: youtube, L: reel
 */
export async function fetchAmanTradersMenu(
  accessToken?: string,
  spreadsheetId = AMAN_TRADE_SPREADSHEET_ID
): Promise<{ dishes: Dish[]; rawRows: any[][] }> {
  // If no access token, immediately use public gviz fetch
  if (!accessToken) {
    const publicDishes = await fetchPublicAmanTradeDishes(spreadsheetId);
    return { dishes: publicDishes, rawRows: [] };
  }

  try {
    const meta = await fetchSpreadsheetMetadata(accessToken, spreadsheetId).catch(() => ({ sheetNames: [] }));
    const sheetNames = meta.sheetNames || [];

    // Match sheet tab named 'amantrade'
    const targetSheet =
      sheetNames.find((n: string) => n.trim().toLowerCase() === 'amantrade') ||
      AMAN_TRADE_SHEET_NAME;

    // Fetch all columns A to Z so Column J (imageurl) and Column K (youtube) are read
    const encodedRange = encodeRangeForUrl(targetSheet, 'A1:Z100');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const publicDishes = await fetchPublicAmanTradeDishes(spreadsheetId);
      return { dishes: publicDishes, rawRows: [] };
    }

    const data = await res.json();
    const rawValues: any[][] = data.values || [];
    if (rawValues.length <= 1) {
      const publicDishes = await fetchPublicAmanTradeDishes(spreadsheetId);
      return { dishes: publicDishes, rawRows: [] };
    }

    const dishes: Dish[] = [];
    const headerRow = rawValues[0] || [];

    let imageColIndex = headerRow.findIndex((h: any) => {
      const name = String(h || '').trim().toLowerCase().replace(/[\s_]+/g, '');
      return name.includes('image') || name.includes('img') || name.includes('photo') || name.includes('pic');
    });
    if (imageColIndex === -1) {
      imageColIndex = 9; // Column J is index 9
    }

    let videoColIndex = headerRow.findIndex((h: any) => {
      const name = String(h || '').trim().toLowerCase().replace(/[\s_]+/g, '');
      return name.includes('video') || name.includes('youtube');
    });
    if (videoColIndex === -1) {
      videoColIndex = 10; // Column K is index 10
    }

    for (let i = 1; i < rawValues.length; i++) {
      const row = rawValues[i];
      if (!row || row.length === 0) continue;

      const rawCategory = String(row[0] || '').trim().toLowerCase();
      const itemName = String(row[1] || '').trim();
      if (!itemName) continue;

      const category: CategoryId = rawCategory.includes('bake') ? 'bakery' : 'confectionery';
      const halfPrice = parseFloat(row[2]) || undefined;
      const fullPrice = parseFloat(row[3]) || undefined;
      const activePrice = (fullPrice && fullPrice > 0)
        ? fullPrice
        : (halfPrice && halfPrice > 0)
        ? halfPrice
        : 50;

      const slugId =
        itemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `item-${i}`;
      const theme = getFoodImageAndTheme(itemName, category);

      const rawImageVal = String(row[imageColIndex] || row[9] || '').trim();
      const finalImageUrl =
        (rawImageVal.startsWith('http://') || rawImageVal.startsWith('https://'))
          ? rawImageVal
          : theme.imageUrl;

      const valK = String(row[10] || '').trim();
      const valL = String(row[11] || '').trim();
      const valM = String(row[12] || '').trim();

      const candidates = [valK, valL, valM].filter(Boolean);
      let reelUrl: string | undefined;
      let facebookUrl: string | undefined;
      let youtubeUrl: string | undefined;

      for (const raw of candidates) {
        const u = String(raw).trim();
        if (!u.startsWith('http://') && !u.startsWith('https://')) continue;
        const lower = u.toLowerCase();
        if (lower.includes('instagram.com') || lower.includes('/reel/')) {
          reelUrl = u;
        } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
          youtubeUrl = u;
        } else if (lower.includes('facebook.com') || lower.includes('fb.')) {
          facebookUrl = u;
        }
      }

      dishes.push({
        id: slugId,
        name: itemName,
        hindiName: itemName,
        category,
        price: activePrice,
        halfPrice,
        fullPrice,
        weightOrUnit: category === 'bakery' ? 'Fresh Pack' : 'Cold Beverage / Sweet',
        rating: 4.8,
        ratingCount: 42 + i * 3,
        isVeg: true,
        isSpecial: true,
        isRecommended: true,
        isAvailable: true,
        byOwnerSpecial: true,
        description: `Fresh ${itemName} from Aman Traders live catalog.`,
        imageUrl: finalImageUrl,
        reelUrl,
        facebookUrl,
        youtubeUrl,
        visualTheme: {
          bgGradient: theme.bgGradient,
          foodType: theme.foodType,
          accentColor: theme.accentColor,
        },
      });
    }

    return { dishes, rawRows: rawValues };
  } catch (err) {
    console.warn('fetchAmanTradersMenu failed, using public fallback:', err);
    const publicDishes = await fetchPublicAmanTradeDishes(spreadsheetId);
    return { dishes: publicDishes, rawRows: [] };
  }
}

/**
 * Ensures "Sheet2" or "Sheet 2" exists in the workbook for stock tracking.
 */
export async function ensureSheet2Exists(
  accessToken: string,
  spreadsheetId = AMAN_TRADERS_SPREADSHEET_ID
): Promise<string> {
  try {
    const meta = await fetchSpreadsheetMetadata(accessToken, spreadsheetId);
    const existingNames = meta.sheetNames || [];

    // 1. Check if "Sheet2" or "Sheet 2" exists
    const match = existingNames.find(
      (n: string) => n.trim().toLowerCase() === 'sheet2' || n.trim().toLowerCase() === 'sheet 2'
    );
    if (match) {
      return match;
    }

    // 2. If workbook does not have "Sheet2", create it via batchUpdate
    const addRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Sheet2',
                },
              },
            },
          ],
        }),
      }
    );

    if (addRes.ok) {
      return 'Sheet2';
    }

    if (existingNames.length >= 2) {
      return existingNames[1];
    }
    if (existingNames.length >= 1) {
      return existingNames[0];
    }
  } catch (err) {
    console.warn('ensureSheet2Exists fallback check:', err);
  }

  return 'Sheet2';
}

/**
 * Reads all rows from Sheet2 where Column E contains stock
 */
export async function fetchSheet2StockData(
  accessToken: string,
  spreadsheetId = AMAN_TRADERS_SPREADSHEET_ID,
  sheetName = DEFAULT_SHEET_NAME
): Promise<{
  rows: SheetRowData[];
  stockMap: Record<string, number>;
  rawData: any[][];
  resolvedSheetName: string;
}> {
  const targetSheet = await ensureSheet2Exists(accessToken, spreadsheetId);

  const encodedRange = encodeRangeForUrl(targetSheet, 'A1:G100');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to read ${targetSheet} (${res.status})`);
  }

  const data = await res.json();
  const rawValues: any[][] = data.values || [];

  const rows: SheetRowData[] = [];
  const stockMap: Record<string, number> = {};

  if (rawValues.length <= 1) {
    return { rows, stockMap, rawData: rawValues, resolvedSheetName: targetSheet };
  }

  for (let i = 1; i < rawValues.length; i++) {
    const r = rawValues[i];
    if (!r || r.length === 0) continue;

    const rowNumber = i + 1;
    const itemId = String(r[0] || '').trim();
    const itemName = String(r[1] || '').trim();
    const category = String(r[2] || '').trim();
    const price = parseFloat(r[3]) || 0;
    // Column E is index 4 (Stock)
    const stockVal = parseInt(r[4], 10);
    const stock = Number.isNaN(stockVal) ? 0 : Math.max(0, stockVal);
    const status = String(r[5] || '').trim();
    const lastUpdated = String(r[6] || '').trim();

    const rowObj: SheetRowData = {
      rowIndex: rowNumber,
      id: itemId,
      name: itemName,
      category,
      price,
      stock,
      status,
      lastUpdated,
    };

    rows.push(rowObj);

    if (itemId) {
      stockMap[itemId] = stock;
    }
    if (itemName) {
      stockMap[itemName.toLowerCase()] = stock;
    }
  }

  return { rows, stockMap, rawData: rawValues, resolvedSheetName: targetSheet };
}

/**
 * Syncs menu items into Sheet2 format for stock tracking
 */
export async function initializeSheet2WithCatalog(
  accessToken: string,
  dishes: Dish[],
  spreadsheetId = AMAN_TRADERS_SPREADSHEET_ID,
  sheetName = DEFAULT_SHEET_NAME
) {
  const targetSheet = await ensureSheet2Exists(accessToken, spreadsheetId);

  const headerRow = [
    'Item ID (Col A)',
    'Item Name (Col B)',
    'Category (Col C)',
    'Price ₹ (Col D)',
    'Stock Qty (Col E)', // Targeted column E for stock
    'Availability Status (Col F)',
    'Last Deducted / Updated (Col G)',
  ];

  const dataRows = dishes.map((dish) => [
    dish.id,
    dish.name,
    dish.category,
    dish.price,
    50, // Default 50 units initial stock in Column E
    'In Stock',
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  ]);

  const allRows = [headerRow, ...dataRows];
  const encodedRange = encodeRangeForUrl(targetSheet, `A1:G${allRows.length}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: allRows }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to initialize ${targetSheet}`);
  }

  return await res.json();
}

/**
 * Deducts stock from Column E in Sheet2 for ordered items
 */
export async function deductStockFromSheet2(
  accessToken: string,
  orderItems: { dishId: string; dishName: string; quantity: number }[],
  spreadsheetId = AMAN_TRADERS_SPREADSHEET_ID,
  sheetName = DEFAULT_SHEET_NAME
): Promise<{ results: SheetDeductionResult[]; message: string }> {
  const { rows, rawData, resolvedSheetName } = await fetchSheet2StockData(
    accessToken,
    spreadsheetId,
    sheetName
  );

  const targetSheet = resolvedSheetName || sheetName;
  const needsQuotes = /[\s\-\.\,\!\@\#\$\%\^\&\*\(\)\+]/.test(targetSheet);
  const sheetPrefix = needsQuotes ? `'${targetSheet}'` : targetSheet;

  // If Sheet2 has no rows yet, auto-write header
  if (rawData.length === 0) {
    try {
      const headerRow = [
        'Item ID (Col A)',
        'Item Name (Col B)',
        'Category (Col C)',
        'Price ₹ (Col D)',
        'Stock Qty (Col E)',
        'Availability Status (Col F)',
        'Last Deducted / Updated (Col G)',
      ];
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeRangeForUrl(
          targetSheet,
          'A1:G1'
        )}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: [headerRow] }),
        }
      );
    } catch (e) {
      console.warn('Could not auto-write Sheet2 header:', e);
    }
  }

  const updates: { range: string; values: any[][] }[] = [];
  const results: SheetDeductionResult[] = [];
  const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const clean = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  let appendedCount = 0;

  for (const item of orderItems) {
    // Match item name from amantraders with Sheet2 rows (Column B is item name)
    let matchingRow = rows.find(
      (r) => clean(r.name) === clean(item.dishName)
    );

    if (!matchingRow) {
      matchingRow = rows.find(
        (r) =>
          r.name.trim().toLowerCase() === item.dishName.trim().toLowerCase() ||
          r.id.toLowerCase() === item.dishId.toLowerCase() ||
          clean(r.name).includes(clean(item.dishName)) ||
          clean(item.dishName).includes(clean(r.name))
      );
    }

    if (matchingRow) {
      const prevStock = matchingRow.stock;
      const newStock = Math.max(0, prevStock - item.quantity);
      matchingRow.stock = newStock;

      const newStatus = newStock === 0 ? 'Out of Stock' : newStock < 5 ? 'Low Stock' : 'In Stock';

      // Update Column E (Stock)
      updates.push({
        range: `${sheetPrefix}!E${matchingRow.rowIndex}`,
        values: [[newStock]],
      });

      // Update Column F (Status)
      updates.push({
        range: `${sheetPrefix}!F${matchingRow.rowIndex}`,
        values: [[newStatus]],
      });

      // Update Column G (Last Updated)
      updates.push({
        range: `${sheetPrefix}!G${matchingRow.rowIndex}`,
        values: [[`Deducted -${item.quantity} via WhatsApp at ${nowStr}`]],
      });

      results.push({
        dishId: item.dishId,
        dishName: matchingRow.name || item.dishName,
        rowNumber: matchingRow.rowIndex,
        previousStock: prevStock,
        deductedQuantity: item.quantity,
        newStock,
      });
    } else {
      appendedCount++;
      const nextRow = Math.max(2, rawData.length + appendedCount);
      const newStock = Math.max(0, 50 - item.quantity);
      updates.push({
        range: `${sheetPrefix}!A${nextRow}:G${nextRow}`,
        values: [
          [
            item.dishId,
            item.dishName, // Exact item name from amantraders
            'Confectionery',
            0,
            newStock, // Column E Stock
            newStock > 0 ? 'In Stock' : 'Out of Stock',
            `Deducted -${item.quantity} via WhatsApp on ${nowStr}`,
          ],
        ],
      });

      results.push({
        dishId: item.dishId,
        dishName: item.dishName,
        rowNumber: nextRow,
        previousStock: 50,
        deductedQuantity: item.quantity,
        newStock,
      });
    }
  }

  const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`;
  const res = await fetch(batchUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: updates,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to update Column E in ${targetSheet}`);
  }

  return {
    results,
    message: `Successfully deducted ${orderItems.length} item(s) from Column E in ${targetSheet} of Aman Traders spreadsheet!`,
  };
}
