import React from 'react';

interface TransitFooterProps {
  onOpenAlerts: () => void;
  onOpenDirectory: () => void;
}

export const TransitFooter: React.FC<TransitFooterProps> = ({
  onOpenAlerts,
  onOpenDirectory,
}) => {
  return (
    <footer className="w-full bg-[#080B10] border-t border-slate-800/80 py-4 px-4 lg:px-6 mt-8">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        {/* Left: SBS logo & LTA credit */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#D32F2F] text-white font-black tracking-tighter text-xs px-2 py-0.5 rounded flex items-center gap-1 border border-red-500/30">
            <span className="font-extrabold tracking-wider">SBS</span>
            <span className="text-[10px] font-semibold text-red-100 uppercase tracking-widest pl-1 border-l border-red-400/50">TRANSIT</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span>• Powered by LTA DataMall Real-Time API</span>
          </div>
        </div>

        {/* Center Links */}
        <div className="flex items-center gap-4 text-[11px] font-mono flex-wrap">
          <button
            onClick={onOpenAlerts}
            className="hover:text-[#00E5FF] transition-colors"
          >
            LTA Service Status
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={onOpenDirectory}
            className="hover:text-[#00E5FF] transition-colors"
          >
            Singapore Transit Map
          </button>
          <span className="text-slate-700">|</span>
          <a
            href="https://simplygo.com.sg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00E5FF] transition-colors"
          >
            SimplyGo Preferences
          </a>
        </div>

        {/* Right: Copyright & SGPS telemetry statement */}
        <div className="text-[11px] font-mono text-slate-500 text-center md:text-right">
          © 2025 SBS Transit Ltd & Land Transport Authority (Singapore). Real-Time SGPS Telemetry.
        </div>
      </div>
    </footer>
  );
};
