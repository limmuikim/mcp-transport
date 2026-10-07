import React, { useState } from 'react';
import { X, Search, MapPin, ArrowRight } from 'lucide-react';
import { BusService } from '../types/transit';

interface StopSearchModalProps {
  onClose: () => void;
  onSelectBus: (serviceNo: string) => void;
  allServices: Record<string, BusService>;
}

export const StopSearchModal: React.FC<StopSearchModalProps> = ({
  onClose,
  onSelectBus,
  allServices,
}) => {
  const [query, setQuery] = useState('');

  const sampleStops = [
    { code: '01112', name: 'Opp Bugis Junction', road: 'Victoria St', buses: ['147', '65', '166', '51', '190', '174'] },
    { code: '01541', name: 'Bugis Stn Exit D', road: 'Rochor Rd', buses: ['147', '857', '960'] },
    { code: '07551', name: 'Fu Lu Shou Cplx', road: 'Bencoolen St', buses: ['147', '56', '131'] },
    { code: '01039', name: "St. Joseph's Church", road: 'Victoria St', buses: ['147', '166', '61'] },
    { code: '04179', name: 'SMU Li Ka Shing Bldg', road: 'Bras Basah Rd', buses: ['147', '166', '174'] },
    { code: '04229', name: 'Clarke Quay Stn Exit E', road: 'Eu Tong Sen St', buses: ['147', '51', '190'] },
    { code: '17179', name: 'Clementi Interchange', road: 'Clementi Ave 3', buses: ['147', '166', '175'] },
  ];

  const filtered = sampleStops.filter(
    (s) =>
      s.code.includes(query) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.road.toLowerCase().includes(query.toLowerCase()) ||
      s.buses.some((b) => b.includes(query))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121824] border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#00E5FF] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stop name (e.g. Bugis), 5-digit code (01112), or bus number..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-mono">
              No matching bus stops or services found for "{query}".
            </div>
          ) : (
            filtered.map((stop) => (
              <div
                key={stop.code}
                className="bg-[#0B0F17] hover:bg-[#161D2B] border border-slate-800 hover:border-slate-700 p-3 rounded-xl transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm font-headline">
                      {stop.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[#00E5FF] font-mono text-[10px]">
                      {stop.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {stop.road}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[10px] text-slate-500 font-mono mr-1">BUSES:</span>
                    {stop.buses.map((bus) => (
                      <button
                        key={bus}
                        onClick={() => {
                          if (allServices[bus]) {
                            onSelectBus(bus);
                            onClose();
                          }
                        }}
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                          bus === '147'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:text-[#00E5FF]'
                        }`}
                      >
                        {bus}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectBus(stop.buses[0]);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-[#00E5FF] text-slate-300 hover:text-slate-950 text-xs font-semibold font-mono flex items-center gap-1 transition-colors"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
