import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Plus, 
  Minus, 
  Crosshair, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Gauge, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { BusService } from '../types/transit';

interface LiveBusRadarMapProps {
  service: BusService;
  onOpenAlerts: () => void;
  onSelectStop?: (code: string) => void;
}

export const LiveBusRadarMap: React.FC<LiveBusRadarMapProps> = ({
  service,
  onOpenAlerts,
  onSelectStop,
}) => {
  // Layer toggles
  const [layers, setLayers] = useState({
    traffic: true,
    busLanes: true,
    erp: true,
    mrt: true,
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // Animated bus position along the corridor
  const [busPosition, setBusPosition] = useState({ x: 260, y: 155 });

  useEffect(() => {
    // Subtle vehicle movement simulation
    const interval = setInterval(() => {
      setBusPosition((prev) => {
        const nextX = prev.x + (Math.random() * 2 - 0.8);
        const nextY = prev.y + (Math.random() * 2 - 0.6);
        return {
          x: nextX > 320 ? 240 : nextX,
          y: nextY > 210 ? 140 : nextY,
        };
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header & Layer Toggles */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm">🌐</span>
            <h3 className="text-sm font-bold font-headline text-slate-100 flex items-center gap-1.5">
              <span>Live Bus Radar - Singapore Central Area</span>
              <span className="text-slate-400 font-normal text-xs">(Bugis / Victoria St)</span>
            </h3>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-[#00E676] font-bold">
              LTA LIVE
            </span>
          </div>
        </div>

        {/* Filter / Layer Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <button
            onClick={() => toggleLayer('traffic')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
              layers.traffic
                ? 'bg-emerald-950/70 text-[#00E676] border border-[#00E676]/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <span>● Live Traffic</span>
          </button>
          <button
            onClick={() => toggleLayer('busLanes')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
              layers.busLanes
                ? 'bg-amber-950/70 text-[#FFB300] border border-[#FFB300]/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <span>Bus Lanes Active</span>
          </button>
          <button
            onClick={() => toggleLayer('erp')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
              layers.erp
                ? 'bg-cyan-950/70 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <span>ERP Rates</span>
          </button>
          <button
            onClick={() => toggleLayer('mrt')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
              layers.mrt
                ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <span>MRT Transfers</span>
          </button>
        </div>
      </div>

      {/* Vector Radar Viewport */}
      <div className="relative w-full h-[320px] sm:h-[350px] bg-[#0A0E17] rounded-lg border border-slate-800 overflow-hidden select-none">
        {/* Radar Background grid and streets map */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 360"
          preserveAspectRatio="xMidYMid slice"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
            {/* Gradient along the transit corridor */}
            <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#00E676" stopOpacity="0.9" />
            </linearGradient>
            {/* Radar scanner gradient */}
            <radialGradient id="radarSweepGrad">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid background */}
          <rect width="600" height="360" fill="url(#radarGrid)" />

          {/* Singapore Waterway / Rochor Canal / Marina Bay edge */}
          <path
            d="M 0 320 Q 200 280 400 310 T 600 290 L 600 360 L 0 360 Z"
            fill="#06101E"
            opacity="0.8"
          />
          <text x="440" y="340" fill="#1e3a5f" fontSize="10" fontFamily="monospace">
            Marina Bay Waterway
          </text>

          {/* City Street Grid (Victoria St, Rochor Rd, Middle Rd, Bras Basah Rd, North Bridge Rd) */}
          <g stroke="rgba(255, 255, 255, 0.12)" strokeWidth="3" strokeLinecap="round">
            {/* Rochor Road */}
            <line x1="20" y1="60" x2="560" y2="120" stroke="rgba(255, 255, 255, 0.14)" strokeWidth="4" />
            {/* Middle Road */}
            <line x1="40" y1="160" x2="540" y2="210" />
            {/* Bras Basah Road */}
            <line x1="80" y1="260" x2="560" y2="290" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="4" />

            {/* Bencoolen Street */}
            <line x1="120" y1="20" x2="160" y2="340" />
            {/* Victoria Street (Primary Bus Spine) */}
            <line x1="260" y1="20" x2="310" y2="340" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="6" />
            {/* North Bridge Road */}
            <line x1="400" y1="20" x2="440" y2="340" />
            {/* Beach Road */}
            <line x1="520" y1="20" x2="550" y2="340" stroke="rgba(255, 255, 255, 0.1)" />
          </g>

          {/* Street Labels */}
          <g fill="rgba(255, 255, 255, 0.35)" fontSize="9" fontFamily="monospace">
            <text x="270" y="45" transform="rotate(70 270 45)">VICTORIA STREET</text>
            <text x="135" y="45" transform="rotate(70 135 45)">BENCOOLEN ST</text>
            <text x="415" y="45" transform="rotate(70 415 45)">NORTH BRIDGE RD</text>
            <text x="320" y="100">ROCHOR RD</text>
            <text x="320" y="190">MIDDLE RD</text>
            <text x="320" y="275">BRAS BASAH RD</text>
          </g>

          {/* Landmarks / Context */}
          <g fill="rgba(255, 255, 255, 0.2)" fontSize="9">
            <rect x="290" y="115" width="85" height="55" rx="4" fill="rgba(0, 229, 255, 0.05)" stroke="rgba(0, 229, 255, 0.2)" />
            <text x="300" y="145" fill="#94a3b8" fontSize="9" fontWeight="bold">Bugis Junction</text>
            <text x="300" y="157" fill="#64748b" fontSize="8">Mall & Interlink</text>

            <rect x="170" y="65" width="75" height="45" rx="4" fill="rgba(255, 179, 0, 0.05)" stroke="rgba(255, 179, 0, 0.2)" />
            <text x="178" y="90" fill="#94a3b8" fontSize="8">Fu Lu Shou</text>

            <rect x="180" y="240" width="75" height="40" rx="4" fill="rgba(99, 102, 241, 0.05)" stroke="rgba(99, 102, 241, 0.2)" />
            <text x="188" y="262" fill="#94a3b8" fontSize="8">SMU Campus</text>
          </g>

          {/* Bus Lane active indicator (Yellow dashed highlight along Victoria St) */}
          {layers.busLanes && (
            <path
              d="M 264 40 L 305 320"
              stroke="#FFB300"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.85"
            />
          )}

          {/* Live Traffic Flow (Green / Amber / Red sections) */}
          {layers.traffic && (
            <g strokeWidth="2.5" opacity="0.8">
              {/* Free flow green */}
              <line x1="262" y1="30" x2="278" y2="130" stroke="#00E676" />
              {/* Moderate flow at Bugis junction */}
              <line x1="279" y1="130" x2="295" y2="230" stroke="#00E676" />
              <line x1="296" y1="230" x2="310" y2="330" stroke="#00E676" />
              {/* Rochor junction */}
              <line x1="180" y1="80" x2="280" y2="92" stroke="#FFB300" />
            </g>
          )}

          {/* MRT Stations and Transfers */}
          {layers.mrt && (
            <g>
              {/* Bugis MRT (EW12 / DT14 Interchange) */}
              <circle cx="360" cy="115" r="7" fill="#00E676" stroke="#000" strokeWidth="1.5" />
              <circle cx="370" cy="115" r="7" fill="#0284c7" stroke="#000" strokeWidth="1.5" />
              <text x="382" y="119" fill="#e2e8f0" fontSize="9" fontWeight="bold">
                Bugis MRT (EW12 / DT14)
              </text>

              {/* Bras Basah MRT (CC2) */}
              <circle cx="210" cy="275" r="6" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
              <text x="120" y="278" fill="#cbd5e1" fontSize="8">
                Bras Basah MRT (CC2)
              </text>
            </g>
          )}

          {/* ERP Gantry Marker */}
          {layers.erp && (
            <g transform="translate(290, 80)">
              <rect x="-18" y="-7" width="36" height="14" rx="3" fill="#0B0F17" stroke="#00E5FF" strokeWidth="1" />
              <text x="0" y="3" fill="#00E5FF" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                ERP $1.00
              </text>
            </g>
          )}

          {/* MAIN BUS 147 GLOWING TRANSIT CORRIDOR */}
          <path
            d="M 230 30 L 265 140 L 290 220 L 325 320"
            fill="none"
            stroke="url(#routeGlow)"
            strokeWidth="5"
            strokeLinecap="round"
            filter="drop-shadow(0 0 6px rgba(0, 229, 255, 0.8))"
          />

          {/* Stop: Bugis Stn Exit A (Departed) */}
          <g transform="translate(248, 85)" className="cursor-pointer">
            <circle cx="0" cy="0" r="4.5" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="-12" y="-9" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              Bugis Stn Exit A (01113 - Departed)
            </text>
          </g>

          {/* CURRENT STOP: Opp Bugis Junction (01112) - Highlighted Beacon */}
          <g transform="translate(272, 160)" className="cursor-pointer" onClick={() => onSelectStop && onSelectStop('01112')}>
            <circle cx="0" cy="0" r="14" fill="rgba(0, 230, 118, 0.2)" className="animate-ping" />
            <circle cx="0" cy="0" r="8" fill="#00E676" stroke="#ffffff" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#0B0F17" />

            {/* Boarding Badge / Label */}
            <g transform="translate(14, -12)">
              <rect x="0" y="0" width="140" height="22" rx="4" fill="#0B0F17" stroke="#00E676" strokeWidth="1.5" />
              <text x="8" y="10" fill="#FFFFFF" fontSize="8.5" fontWeight="bold">
                Opp Bugis Junction
              </text>
              <text x="8" y="18" fill="#94A3B8" fontSize="7" fontFamily="monospace">
                (01112)
              </text>
              <rect x="94" y="3" width="42" height="15" rx="3" fill="#00E676" />
              <text x="115" y="14" fill="#0B0F17" fontSize="7" fontWeight="black" textAnchor="middle">
                BOARDING
              </text>
            </g>
          </g>

          {/* Stop: St. Joseph's Church */}
          <g transform="translate(290, 225)" className="cursor-pointer" onClick={() => onSelectStop && onSelectStop('01039')}>
            <circle cx="0" cy="0" r="5" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="10" y="4" fill="#E2E8F0" fontSize="8" fontFamily="monospace">
              St. Joseph's Ch (01039 - ETA 10:45)
            </text>
          </g>

          {/* Terminus Clementi Indicator */}
          <g transform="translate(325, 320)">
            <circle cx="0" cy="0" r="5" fill="#38bdf8" />
            <text x="10" y="4" fill="#38bdf8" fontSize="8" fontWeight="bold">
              Terminus: Clementi Interchange
            </text>
          </g>

          {/* LIVE BUS VEHICLE MARKER (SBS 3429Z) Moving Along Route */}
          <g transform={`translate(${busPosition.x}, ${busPosition.y})`}>
            {/* Pulsing signal ring */}
            <circle cx="0" cy="0" r="16" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
            {/* Bus vehicle dot */}
            <circle cx="0" cy="0" r="7" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="2" />
            
            {/* Vehicle callout tag */}
            <g transform="translate(12, -22)">
              <rect x="0" y="0" width="135" height="28" rx="4" fill="#0B0F17" stroke="#00E5FF" strokeWidth="1" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.8))" />
              <text x="6" y="11" fill="#00E676" fontSize="8" fontWeight="bold" fontFamily="monospace">
                SBS 3429Z
              </text>
              <text x="60" y="11" fill="#00E5FF" fontSize="7" fontFamily="monospace">
                38 km/h
              </text>
              <text x="6" y="22" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                Dist: 450m • Double Decker (WAB)
              </text>
            </g>
          </g>
        </svg>

        {/* HUD Overlay: Compass Heading on Bottom-Left */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#0B0F17]/90 border border-slate-700/80 rounded px-2.5 py-1 text-[11px] font-mono flex items-center gap-2 backdrop-blur-sm">
          <Navigation className="w-3.5 h-3.5 text-[#00E5FF] rotate-[215deg]" />
          <span className="text-slate-300 font-semibold">HEADING: 215° SW</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Victoria St • 400 M</span>
        </div>

        {/* Map Controls: Top/Bottom Right */}
        <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1 z-10">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            className="w-7 h-7 rounded bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all shadow-md"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="w-7 h-7 rounded bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all shadow-md"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setBusPosition({ x: 260, y: 155 });
            }}
            className="w-7 h-7 rounded bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-[#00E5FF] hover:bg-slate-800 flex items-center justify-center transition-all shadow-md"
            title="Recenter Map"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Operations Control Centre (OCC) Status Ticker */}
      <div className="mt-3 bg-[#0B0F17]/80 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-[#00E676] shrink-0"></span>
          <p className="text-slate-300 truncate text-[11px]">
            <strong className="text-white">Normal Service on Route {service.serviceNo}</strong> • Peak Hour headway {service.corridorStats.headwayMin} managed by SBS Transit Operations Control Centre (OCC).
          </p>
        </div>
        <button
          onClick={onOpenAlerts}
          className="text-[#00E5FF] hover:underline text-[11px] whitespace-nowrap flex items-center gap-1 shrink-0 font-medium"
        >
          <span>View LTA Alerts</span>
          <span>→</span>
        </button>
      </div>

      {/* Corridor Metric Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
        {/* Metric 1: Corridor Pace */}
        <div className="bg-[#0B0F17] border border-slate-800 p-2.5 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-950/40 text-[#00E5FF]">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              CORRIDOR PACE
            </div>
            <div className="text-sm font-bold font-mono text-slate-100">
              {service.corridorStats.avgSpeed} km/h avg
            </div>
          </div>
        </div>

        {/* Metric 2: Feeder Headway */}
        <div className="bg-[#0B0F17] border border-slate-800 p-2.5 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-950/40 text-[#00E676]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              FEEDER HEADWAY
            </div>
            <div className="text-sm font-bold font-mono text-slate-100">
              {service.corridorStats.headwayMin}
            </div>
          </div>
        </div>

        {/* Metric 3: Fleet Standard */}
        <div className="bg-[#0B0F17] border border-slate-800 p-2.5 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-amber-950/40 text-[#FFB300]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              FLEET STANDARD
            </div>
            <div className="text-sm font-bold font-mono text-slate-100">
              {service.corridorStats.fleetWabPercent}% WAB / Euro VI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
