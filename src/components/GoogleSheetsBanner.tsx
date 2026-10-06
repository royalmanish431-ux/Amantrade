import React from 'react';
import { Sheet, RefreshCw, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { SPREADSHEET_ID, SPREADSHEET_URL } from '../services/googleSheetsService';

interface GoogleSheetsBannerProps {
  isSyncing: boolean;
  lastSynced: string;
  rowCount: number;
  onRefresh: () => void;
  error?: string | null;
}

export const GoogleSheetsBanner: React.FC<GoogleSheetsBannerProps> = ({
  isSyncing,
  lastSynced,
  rowCount,
  onRefresh,
  error,
}) => {
  return (
    <div className="mx-4 my-2.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sheet className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-900 leading-none">
                Google Sheets Sync
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                15 Cols Connected (Col A-O)
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                ⚡ Apps Script Linked
              </span>
            </div>
            <p className="text-[11px] text-slate-600 truncate mt-0.5">
              {error ? (
                <span className="text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Error syncing
                </span>
              ) : (
                <>
                  {rowCount} item{rowCount === 1 ? '' : 's'} linked · Stock Deduct (Col E) & Amount Add (Col H) Active
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-emerald-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh from Google Sheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <a
            href={SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
            title="Open Google Sheet in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
      {lastSynced && (
        <div className="mt-1.5 pt-1.5 border-t border-emerald-200/50 flex justify-between items-center text-[10px] text-slate-500">
          <span>ID: <code className="text-slate-700 font-mono">{SPREADSHEET_ID.slice(0, 14)}...</code></span>
          <span>Last synced: {lastSynced}</span>
        </div>
      )}
    </div>
  );
};
