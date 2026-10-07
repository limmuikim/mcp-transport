import React from 'react';
import { AdjacentStop } from '../types/transit';

interface AdjacentStopsProps {
  stops: AdjacentStop[];
  onSelectAdjacentStop: (stop: AdjacentStop) => void;
  onSelectBus: (busNo: string) => void;
}

export const AdjacentStops: React.FC<AdjacentStopsProps> = ({
  stops,
  onSelectAdjacentStop,
  onSelectBus,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300 uppercase tracking-wider font-semibold">
          ALTERNATIVE ADJACENT BUS STOPS
        </span>
        <span className="text-slate-400 text-[11px]">RADIUS: 400M</span>
      </div>

      <div className="space-y-2">
        {stops.map((stop) => {
          const isSeats = stop.load === 'SEA';
          return (
            <div
              key={stop.id}
              onClick={() => onSelectAdjacentStop(stop)}
              className="bg-[#121824] hover:bg-[#161e2e] border border-slate-800 hover:border-slate-700/80 rounded-xl p-3 flex items-center justify-between gap-3 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {/* Index circle */}
                <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                  {stop.id}
                </div>

                <div>
                  {/* Name and Bus Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline font-bold text-sm text-slate-100 group-hover:text-[#00E5FF] transition-colors">
                      {stop.name} <span className="font-mono text-xs text-slate-400">({stop.code})</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {stop.buses.map((bus) => (
                        <button
                          key={bus}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBus(bus);
                          }}
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold transition-transform hover:scale-105 ${
                            bus === '147'
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-800 text-cyan-300 border border-slate-700'
                          }`}
                        >
                          {bus}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Road & walk info */}
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {stop.road} • {stop.walkDistanceM}m walk • {isSeats ? 'Seats Available (SEA)' : 'Standing Available (SDA)'}
                  </div>
                </div>
              </div>

              {/* ETA & Crowd badge */}
              <div className="text-right shrink-0">
                <div className="text-lg font-bold font-mono text-slate-100">
                  {String(stop.nextArrivalMin).padStart(2, '0')}
                  <span className="text-xs text-slate-400 font-normal">m</span>
                </div>
                <div
                  className={`text-[11px] font-mono font-medium ${
                    isSeats ? 'text-[#00E676]' : 'text-[#FFB300]'
                  }`}
                >
                  {stop.loadText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
