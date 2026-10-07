import React from 'react';
import { CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';

export const CommuterAdvisory: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[#0d2238] via-[#121b2b] to-[#121824] border border-cyan-500/30 rounded-xl p-3 flex items-center gap-3.5 shadow-lg relative overflow-hidden">
      {/* Decorative thumbnail/graphic */}
      <div className="w-11 h-11 rounded-lg bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center shrink-0 text-[#00E5FF] shadow-inner">
        <CreditCard className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono tracking-wider uppercase text-[#00E5FF] font-semibold flex items-center gap-1.5">
          <span>LTA COMMUTER ADVISORY</span>
          <span className="w-1 h-1 rounded-full bg-[#00E5FF]"></span>
          <span className="text-slate-400">FARES & TICKETING</span>
        </div>
        <h4 className="text-sm font-headline font-bold text-white tracking-tight truncate">
          SimplyGo & Contactless Fare Payment
        </h4>
        <p className="text-xs text-slate-300 font-mono line-clamp-1 mt-0.5">
          Tap in/out with SimplyGo EZ-Link or Contactless Mastercard/Visa/NETS. Child Concession cardholders ride free during off-peak.
        </p>
      </div>

      <a
        href="https://simplygo.com.sg"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-semibold font-mono border border-[#00E5FF]/30 transition-all shrink-0"
      >
        <span>Card Guide</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
