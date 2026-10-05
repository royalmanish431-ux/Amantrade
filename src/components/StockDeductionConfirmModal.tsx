import React from 'react';
import { FileSpreadsheet, AlertCircle, Check, X, ShieldAlert } from 'lucide-react';
import { AMAN_TRADERS_SPREADSHEET_ID, DEFAULT_SHEET_NAME, SPREADSHEET_URL } from '../services/googleSheetsService';

interface StockDeductionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderItems: { name: string; quantity: number; price: number }[];
  isDeducting: boolean;
}

export const StockDeductionConfirmModal: React.FC<StockDeductionConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderItems,
  isDeducting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-stone-200 animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Confirm Google Sheets Stock Deduction
              </h3>
              <p className="text-[11px] text-emerald-200">
                Aman Traders Spreadsheet · {DEFAULT_SHEET_NAME}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeducting}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs text-stone-700">
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Live Inventory Modification:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                Placing this order will automatically deduct stock from <strong>Column E</strong> in <strong>Sheet 2</strong> of your Aman Traders Google Spreadsheet.
              </p>
            </div>
          </div>

          {/* Spreadsheet Target Details */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Spreadsheet:</span>
              <span className="font-bold text-stone-900 font-mono">amantraders</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Target Sheet Tab:</span>
              <span className="font-bold text-emerald-700 font-mono">{DEFAULT_SHEET_NAME}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Stock Column:</span>
              <span className="font-bold text-red-600 font-mono">Column E (Quantity)</span>
            </div>
            <div className="pt-1 border-t border-stone-200 text-right">
              <a
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold underline inline-flex items-center gap-1"
              >
                <span>View Google Sheet in new tab</span>
              </a>
            </div>
          </div>

          {/* Items to Deduct */}
          <div className="space-y-2">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
              Items to be deducted ({orderItems.length})
            </span>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {orderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-stone-100/80 border border-stone-200 text-xs"
                >
                  <span className="font-medium text-stone-800 truncate mr-2">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-black text-[11px]">
                      -{item.quantity} in Col E
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={isDeducting}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeducting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeducting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Deducting Stock from Sheet 2...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirm & Deduct Stock</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
