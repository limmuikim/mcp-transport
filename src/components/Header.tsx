import React from 'react';
import { Search, ChevronDown, Bell, Bookmark } from 'lucide-react';

interface HeaderProps {
  activeTab: 'live' | 'directory' | 'favorites' | 'alerts';
  setActiveTab: (tab: 'live' | 'directory' | 'favorites' | 'alerts') => void;
  selectedHub: string;
  setSelectedHub: (hub: string) => void;
  onOpenSearch: () => void;
  onOpenApiHealth?: () => void;
  favoritesCount: number;
  alertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedHub,
  setSelectedHub,
  onOpenSearch,
  onOpenApiHealth,
  favoritesCount,
  alertCount,
}) => {
  const [hubDropdownOpen, setHubDropdownOpen] = React.useState(false);

  const hubs = [
    'Toa Payoh / Jurong East',
    'Bugis / City Hall (Central)',
    'Hougang Central / Sengkang',
    'Clementi / Jurong West',
    'Woodlands / Yishun',
    'Tampines / Bedok',
  ];

  return (
    <header className="w-full bg-[#0B0F17]/95 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 px-3 lg:px-6 py-2.5">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#D32F2F] text-white font-black tracking-tighter text-sm px-2 py-1 rounded shadow-sm flex items-center gap-1.5 border border-red-500/30">
              <span className="font-extrabold tracking-wider text-xs">SBS</span>
              <span className="text-[11px] font-semibold text-red-100 uppercase tracking-widest border-l border-red-400/50 pl-1.5">TRANSIT</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase leading-none">
                LTA DATAMALL RT SYNCED
              </span>
            </div>
          </div>

          {/* SGPS Live pulse / API Health trigger */}
          <button
            onClick={onOpenApiHealth}
            title="Click to check /api/health and LTA DataMall Gateway status"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00E676]/10 hover:bg-[#00E676]/20 border border-[#00E676]/25 text-[11px] text-[#00E676] font-medium font-mono transition-colors cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
            </span>
            <span className="hidden md:inline">LTA DataMall Real-Time API Synced</span>
            <span className="md:hidden">SGPS Live</span>
            <span className="text-[10px] text-slate-400 hidden lg:inline">(SGPS Live)</span>
          </button>
        </div>

        {/* Center / Nav Items */}
        <nav className="flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'live'
                ? 'bg-slate-800 text-white font-semibold border-b-2 border-[#00E5FF] shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Live Bus Timings
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-slate-800 text-white font-semibold border-b-2 border-[#00E5FF]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Route Directory
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'bg-slate-800 text-white font-semibold border-b-2 border-[#00E5FF]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-[#FFB300]" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FFB300]/20 text-[#FFB300] font-mono">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-slate-800 text-white font-semibold border-b-2 border-[#00E5FF]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-rose-400" />
            <span>MRT / Bus Alerts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono">
              {alertCount}
            </span>
          </button>
        </nav>

        {/* Right: Hub Selector, Search & View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Hub Selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setHubDropdownOpen(!hubDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700/80 text-xs text-slate-300 hover:border-slate-500 transition-colors"
            >
              <span className="text-slate-400 text-[11px]">Hub:</span>
              <span className="font-medium text-slate-100 max-w-[120px] lg:max-w-[150px] truncate">{selectedHub}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {hubDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-md shadow-2xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                  Select Singapore Transit Hub
                </div>
                {hubs.map((hub) => (
                  <button
                    key={hub}
                    onClick={() => {
                      setSelectedHub(hub);
                      setHubDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                      selectedHub === hub ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-medium' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{hub}</span>
                    {selectedHub === hub && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stop Search trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700/80 text-xs text-slate-300 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-colors"
            title="Search Bus Stop or Code"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stop Search</span>
          </button>
        </div>
      </div>
    </header>
  );
};
