import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Wifi, 
  Zap, 
  Accessibility, 
  Snowflake, 
  Bell, 
  Check, 
  Clock, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { BusService } from '../types/transit';

interface BusHeroCardProps {
  service: BusService;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSelectStop?: (code: string) => void;
}

export const BusHeroCard: React.FC<BusHeroCardProps> = ({
  service,
  isBookmarked,
  onToggleBookmark,
  onSelectStop,
}) => {
  // Live seconds countdown for the next bus
  const [countdownSeconds, setCountdownSeconds] = useState(service.arrivals[0].etaSeconds);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCountdownSeconds(service.arrivals[0].etaSeconds);
  }, [service]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 10) return service.arrivals[0].etaSeconds; // loop for demo realism
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [service]);

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} min`;
  };

  const handleToggleNotification = () => {
    const nextState = !notificationEnabled;
    setNotificationEnabled(nextState);
    if (nextState) {
      setToastMessage('Haptic & Audio alert active: 2 stops before Opp Bugis Junction');
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } else {
      setToastMessage('Boarding alerts disabled');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 1. CURRENT BUS STOP BANNER */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[#00E5FF] font-semibold tracking-wider text-[11px]">
              CURRENT BUS STOP
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              🚶‍♂️ {service.currentStop.walkTimeMin} min walk ({service.currentStop.walkDistanceM}m)
            </span>
          </div>

          <button
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-[#FFB300] transition-colors"
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-[#FFB300] text-[#FFB300]' : ''}`}
            />
          </button>
        </div>

        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold font-headline text-white tracking-tight">
            {service.currentStop.name}
          </h2>
        </div>

        <div className="text-xs text-slate-400 mt-0.5 font-mono flex items-center gap-2">
          <span>Bus Stop Code: <strong className="text-slate-200">{service.currentStop.code}</strong></span>
          <span>•</span>
          <span>{service.currentStop.road}</span>
          <span>•</span>
          <span>{service.currentStop.directionDesc}</span>
        </div>
      </div>

      {/* 2. MAIN BUS SERVICE HERO CARD */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
        {/* Top Service Bar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Big Red Bus Number Badge */}
            <div className="bg-[#D32F2F] text-white px-3.5 py-1.5 rounded-lg flex flex-col items-center justify-center shadow-lg border border-red-500/40">
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-red-200 leading-none">
                BUS
              </span>
              <span className="text-2xl font-black font-headline tracking-tighter leading-none mt-0.5">
                {service.serviceNo}
              </span>
            </div>

            {/* Operator and route info */}
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold text-slate-200">
                  {service.operator}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                  WAB
                </span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-[#00E5FF]">
                  DOUBLE DECKER
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {service.originFrom} ⇄ {service.destinationTo} via {service.via}
              </p>
            </div>
          </div>

          {/* Arriving In 2 Mins Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E676]/15 border border-[#00E676]/30 text-[#00E676] text-xs font-bold font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
            </span>
            <span>ARRIVING IN 2 MINS</span>
          </div>
        </div>

        {/* Departures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#0B0F17]/70 p-3 rounded-lg border border-slate-800/80 mb-3">
          {/* Next Bus (Live Countdown) */}
          <div className="bg-[#161D2B] p-2.5 rounded-md border border-[#00E5FF]/20 flex flex-col justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>NEXT BUS (LTA LIVE)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></span>
            </div>
            <div className="my-1">
              <span className="text-2xl font-bold font-mono text-[#00E676] tracking-tight">
                {formatCountdown(countdownSeconds)}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-1 font-mono">
              <span>💺 Seats Avail (SEA)</span>
            </div>
          </div>

          {/* Subsequent Departure 2 */}
          <div className="bg-[#121824] p-2.5 rounded-md border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              SUBSEQUENT DEPARTURES
            </div>
            <div className="my-1">
              <span className="text-lg font-bold font-mono text-slate-200">
                8 mins
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <span className="text-slate-300">🚍 Double Deck</span>
              <span>•</span>
              <span className="text-[#00E676]">SEA</span>
            </div>
          </div>

          {/* Subsequent Departure 3 */}
          <div className="bg-[#121824] p-2.5 rounded-md border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              SUBSEQUENT DEPARTURES
            </div>
            <div className="my-1">
              <span className="text-lg font-bold font-mono text-slate-200">
                16 mins
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <span className="text-slate-300">🚍 Single Deck</span>
              <span>•</span>
              <span className="text-[#FFB300]">SDA</span>
            </div>
          </div>
        </div>

        {/* Telemetry row: Crowd Level, Specs, Active Vehicle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 py-2 border-t border-b border-slate-800/80 mb-3 text-xs">
          {/* Crowd Level */}
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>LTA CROWD LEVEL</span>
              <span className="text-[#00E676] font-bold">28% SEA</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#00E676] rounded-full transition-all duration-500" style={{ width: '28%' }}></div>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Seats Available</span>
          </div>

          {/* Bus Type & Specs */}
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              BUS TYPE & SPECS
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span title="Wheelchair Accessible"><Accessibility className="w-3.5 h-3.5 text-[#00E5FF]" /></span>
              <span title="Free Wireless@SGx onboard"><Wifi className="w-3.5 h-3.5 text-[#00E676]" /></span>
              <span title="USB Fast Charging Ports"><Zap className="w-3.5 h-3.5 text-[#FFB300]" /></span>
              <span title="Full Climate Control"><Snowflake className="w-3.5 h-3.5 text-blue-300" /></span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">WAB Double Decker (BD)</span>
          </div>

          {/* Active Vehicle */}
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>ACTIVE VEHICLE</span>
              <span className="flex items-center gap-1 text-[10px] text-[#00E676]">
                <Wifi className="w-2.5 h-2.5" /> Live SGPS
              </span>
            </div>
            <div className="font-mono font-bold text-slate-200">
              {service.vehicle.plate}
            </div>
            <span className="text-[11px] text-slate-400 truncate block">
              {service.vehicle.model}
            </span>
          </div>
        </div>

        {/* Corridor Progress Tracker */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] font-mono mb-2">
            <span className="text-slate-300 uppercase tracking-wider font-semibold">
              CORRIDOR PROGRESS TRACKER
            </span>
            <span className="text-[#00E5FF] text-[10px]">
              LTA GPS LIVE - VICTORIA ST
            </span>
          </div>

          {/* Stepper horizontal line */}
          <div className="relative pt-2 pb-1">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 -z-0"></div>

            <div className="grid grid-cols-5 gap-1 relative z-10 text-center">
              {service.progressStops.map((stop, idx) => (
                <div 
                  key={stop.code} 
                  onClick={() => onSelectStop && onSelectStop(stop.code)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      stop.isCurrent
                        ? 'bg-[#00E676] ring-4 ring-[#00E676]/20 scale-110'
                        : stop.isPassed
                        ? 'bg-slate-600'
                        : 'bg-slate-800 border-2 border-slate-600 group-hover:border-[#00E5FF]'
                    }`}
                  >
                    {stop.isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>}
                    {stop.isPassed && <Check className="w-2.5 h-2.5 text-slate-300" />}
                  </div>

                  <span
                    className={`text-[10px] font-medium mt-1 truncate max-w-[70px] ${
                      stop.isCurrent ? 'text-[#00E676] font-bold' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {stop.name}
                  </span>

                  <span className="text-[9px] font-mono text-slate-500">
                    {stop.isPassed ? 'Departed' : stop.isCurrent ? '2 min (You)' : `+${stop.relativeTimeMin} min`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrival Notification setting */}
        <div className="bg-[#0B0F17]/80 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${notificationEnabled ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'bg-slate-800 text-slate-400'}`}>
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Arrival Notification
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Vibrate 2 stops before boarding Opp Bugis Junction
              </div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationEnabled}
              onChange={handleToggleNotification}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00E5FF]"></div>
          </label>
        </div>

        {toastMessage && (
          <div className="mt-2 text-center text-xs py-1.5 px-3 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-mono border border-[#00E5FF]/40 animate-fade-in">
            🔔 {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
