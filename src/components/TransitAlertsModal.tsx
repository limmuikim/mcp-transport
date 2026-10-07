import React from 'react';
import { X, AlertTriangle, CheckCircle, Clock, Info, ShieldAlert } from 'lucide-react';
import { TRANSIT_ALERTS } from '../data/transitData';

interface TransitAlertsModalProps {
  onClose: () => void;
}

export const TransitAlertsModal: React.FC<TransitAlertsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121824] border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-slate-100 text-base">
                LTA & SBS Transit Operations Control Center (OCC)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Live Disruption & Commuter Telemetry Advisory
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {TRANSIT_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border text-xs ${
                alert.type === 'Delay'
                  ? 'bg-rose-950/20 border-rose-800/50'
                  : alert.type === 'ERP Update'
                  ? 'bg-cyan-950/20 border-cyan-800/50'
                  : alert.type === 'Route Diversion'
                  ? 'bg-amber-950/20 border-amber-800/50'
                  : 'bg-emerald-950/20 border-emerald-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      alert.type === 'Delay'
                        ? 'bg-rose-500'
                        : alert.type === 'ERP Update'
                        ? 'bg-[#00E5FF]'
                        : alert.type === 'Route Diversion'
                        ? 'bg-[#FFB300]'
                        : 'bg-[#00E676]'
                    }`}
                  />
                  <span>{alert.lineOrService}</span>
                </span>

                <span className="font-mono text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {alert.time}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                {alert.message}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0B0F17] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Acknowledge Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
