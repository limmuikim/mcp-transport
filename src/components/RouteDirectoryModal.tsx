import React from 'react';
import { X, MapPin, Bus, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { BusService } from '../types/transit';

interface RouteDirectoryModalProps {
  service: BusService;
  onClose: () => void;
  onSelectService: (serviceNo: string) => void;
  allServices: Record<string, BusService>;
}

export const RouteDirectoryModal: React.FC<RouteDirectoryModalProps> = ({
  service,
  onClose,
  onSelectService,
  allServices,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121824] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-[#D32F2F] text-white font-black font-headline text-lg">
              {service.serviceNo}
            </div>
            <div>
              <h3 className="font-headline font-bold text-slate-100 text-base">
                Route Directory & Corridor Schedule
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {service.originFrom} ⇄ {service.destinationTo}
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

        {/* Quick Route Switcher */}
        <div className="px-4 py-2 bg-[#0B0F17] border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0">
            Switch Trunk:
          </span>
          {Object.keys(allServices).map((no) => (
            <button
              key={no}
              onClick={() => onSelectService(no)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-colors shrink-0 ${
                service.serviceNo === no
                  ? 'bg-[#00E5FF] text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Bus {no}
            </button>
          ))}
        </div>

        {/* Content list of stops along route */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="text-xs text-slate-400 font-mono mb-2 flex items-center justify-between">
            <span>KEY PROGRESS STOPS & CORRIDOR INTERCHANGES</span>
            <span>FREQ: {service.corridorStats.headwayMin}</span>
          </div>

          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {service.progressStops.map((stop, i) => (
              <div key={stop.code} className="relative flex items-start justify-between gap-3 text-xs">
                {/* Node dot */}
                <div
                  className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                    stop.isCurrent
                      ? 'bg-[#00E676] border-white ring-4 ring-[#00E676]/25'
                      : stop.isPassed
                      ? 'bg-slate-600 border-slate-800'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                />

                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <span className="text-slate-100 font-semibold">{stop.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">({stop.code})</span>
                    {stop.isCurrent && (
                      <span className="px-1.5 py-0.2 rounded bg-[#00E676]/20 text-[#00E676] text-[10px] font-mono font-bold">
                        CURRENT STOP
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {stop.road} • Towards Clementi Interchange
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono text-xs text-slate-400">
                  {stop.isPassed ? (
                    <span className="text-slate-500">Departed</span>
                  ) : stop.isCurrent ? (
                    <span className="text-[#00E676] font-bold">2 min</span>
                  ) : (
                    <span>+{stop.relativeTimeMin} min</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              <span>Full Route Wheelchair Accessible (WAB 100%)</span>
            </div>
            <span className="text-[#00E676] font-bold">LTA Certified</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0B0F17] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
