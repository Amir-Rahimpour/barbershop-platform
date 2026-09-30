import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all transform animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-[#121c17]/95 border-emerald-500/40 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-[#221315]/95 border-rose-500/40 text-rose-100'
              : 'bg-[#151922]/95 border-amber-500/30 text-amber-100'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-medium">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#d4af37] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors mr-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
