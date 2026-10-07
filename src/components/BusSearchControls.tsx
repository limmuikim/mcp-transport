import React, { useState, useEffect } from 'react';
import { Search, X, Navigation, Radio, CheckCircle2 } from 'lucide-react';
import { BusService } from '../types/transit';

interface BusSearchControlsProps {
  currentService: BusService;
  onSelectService: (serviceNo: string) => void;
  selectedDirection: number;
  onSelectDirection: (directionIndex: number) => void;
  onGpsLocate: () => void;
  isLocating: boolean;
}

export const BusSearchControls: React.FC<BusSearchControlsProps> = ({
  currentService,
  onSelectService,
  selectedDirection,
  onSelectDirection,
  onGpsLocate,
  isLocating,
}) => {
  const [searchQuery, setSearchQuery] = useState(
    `Bus ${currentService.serviceNo} - ${currentService.originFrom} ⇄ ${currentService.destinationTo} (Stop ${currentService.currentStop.code})`
  );
  const [secondsAgo, setSecondsAgo] = useState(1.8);
  const [searchFocused, setSearchFocused] = useState(false);

  // Sync searchQuery when currentService changes
  useEffect(() => {
    setSearchQuery(
      `Bus ${currentService.serviceNo} - ${currentService.originFrom} ⇄ ${currentService.destinationTo} (Stop ${currentService.currentStop.code})`
    );
  }, [currentService]);

  // Live timer for LTA sync: "1.8s AGO (SGPS)" updating naturally
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => {
        if (prev >= 6.5) return 1.2;
        return Number((prev + 0.3).toFixed(1));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const quickServices = [
    { no: '147', label: 'Bus 147', note: '' },
    { no: '65', label: 'Bus 65', note: '' },
    { no: '166', label: 'Bus 166', note: '' },
    { no: '51', label: 'Bus 51', note: '' },
    { no: '190', label: 'Bus 190 (SMRT)', note: 'SMRT' },
    { no: '174', label: 'Bus 174', note: '' },
  ];

  return (
    <div className="w-full space-y-3">
      {/* Top Status Bar: LTA Datamall Feed and SimplyGo badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/60 border border-red-500/30 text-red-300 font-mono text-[11px]">
            <span className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center font-bold text-[10px]">
              A
            </span>
            <span className="font-semibold tracking-wide">LTA DATAMALL REAL-TIME FEED</span>
            <span className="text-red-400/60">·</span>
            <span className="text-slate-300">LTA SYNCED: {secondsAgo}s AGO (SGPS)</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
          <span className="font-semibold tracking-wider text-[#00E676]">SIMPLYGO INTEGRATED CORRIDOR</span>
        </div>
      </div>

      {/* Main Search Input & GPS Button */}
      <div className="flex items-center gap-2 flex-col sm:flex-row">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search bus service (e.g. 147, 65) or stop code (01112)..."
            className="w-full bg-[#121824] border border-slate-700/80 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Quick search suggestions popup */}
          {searchFocused && (
            <div className="absolute left-0 right-0 mt-1 bg-[#121824] border border-slate-700 rounded-lg shadow-2xl py-1.5 z-30">
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                Suggested Corridors & Stops
              </div>
              {quickServices.map((svc) => (
                <button
                  key={svc.no}
                  onMouseDown={() => onSelectService(svc.no)}
                  className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold font-mono text-[11px]">
                      {svc.no}
                    </span>
                    <span>Route {svc.no} - Singapore Transit Trunk</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Stop 01112 (Victoria St)</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GPS Locate Button */}
        <button
          onClick={onGpsLocate}
          disabled={isLocating}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
        >
          <Navigation className={`w-3.5 h-3.5 text-[#00E5FF] ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating Stop...' : 'Detect Nearby Bus Stop (GPS)'}</span>
          <span className="text-slate-400">↗</span>
        </button>
      </div>

      {/* Direction Switcher & Quick Select Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Direction Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onSelectDirection(0)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedDirection === 0
                ? 'bg-[#00E5FF] text-slate-950 font-bold shadow-md shadow-[#00E5FF]/20'
                : 'bg-[#121824] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <span>➔</span>
            <span>To {currentService.destinationTo} (Loop / West)</span>
          </button>
          <button
            onClick={() => onSelectDirection(1)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedDirection === 1
                ? 'bg-[#00E5FF] text-slate-950 font-bold shadow-md shadow-[#00E5FF]/20'
                : 'bg-[#121824] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <span>←</span>
            <span>To {currentService.originFrom}</span>
          </button>
        </div>

        {/* Quick Select Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1">
            QUICK SELECT:
          </span>
          {quickServices.map((svc) => {
            const isSelected = currentService.serviceNo === svc.no;
            return (
              <button
                key={svc.no}
                onClick={() => onSelectService(svc.no)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-[#D32F2F] text-white font-bold border border-red-400 shadow-sm'
                    : 'bg-[#121824] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {svc.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
