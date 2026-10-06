export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7XmKgjM8K9bUM3o2w4wCCsJA_z9EMSEm098-cJoI6TtjkupXNG876f08xauO1ga8dZA/exec';

export const getFormattedCurrentDate = (): string => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export interface AppsScriptOrderPayload {
  date?: string;
  amount: number;
  total_amount?: number;
  order_id?: string;
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: string;
  items?: Array<{
    name: string;
    item_name?: string;
    qty: number;
    bill_no?: string;
    price?: number;
  }>;
}

export const triggerAppsScriptOrder = async (
  payload: AppsScriptOrderPayload
): Promise<{ success: boolean; message: string }> => {
  try {
    const formattedDate = payload.date || getFormattedCurrentDate();
    const primaryItem = payload.items?.[0];

    const data = {
      action: 'deduct',
      bill_no: primaryItem?.bill_no || '8901396324584',
      name: primaryItem?.name || primaryItem?.item_name || 'Item',
      item_name: primaryItem?.name || primaryItem?.item_name || 'Item',
      qty: primaryItem?.qty || 1,
      amount: payload.amount || payload.total_amount || 0,
      totalAmount: payload.amount || payload.total_amount || 0,
      coustomtotal: payload.amount || payload.total_amount || 0,
      total: payload.amount || payload.total_amount || 0,
      date: formattedDate,
      Date: formattedDate,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      delivery_address: payload.delivery_address,
      items: payload.items || [],
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn('Apps Script POST notice, using GET fallback', err);
      const params = new URLSearchParams({
        action: 'deduct',
        bill_no: String(data.bill_no),
        qty: String(data.qty),
        amount: String(data.amount),
        coustomtotal: String(data.coustomtotal),
        date: formattedDate,
      });
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, { mode: 'no-cors' });
    }

    return {
      success: true,
      message: 'Order triggered to Apps Script (Stock Deduct & Amount Add)',
    };
  } catch (error: any) {
    console.error('Failed to trigger Apps Script order:', error);
    return {
      success: false,
      message: error?.message || 'Apps Script sync failed',
    };
  }
};
