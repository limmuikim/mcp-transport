import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Terminal, Send, Server, ShieldCheck } from 'lucide-react';

interface ApiHealthModalProps {
  onClose: () => void;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({ onClose }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test query state for bus arrival
  const [testStopCode, setTestStopCode] = useState('04121');
  const [testServiceNo, setTestServiceNo] = useState('7');
  const [arrivalResult, setArrivalResult] = useState<any>(null);
  const [testingArrival, setTestingArrival] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setHealthData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch /api/health');
    } finally {
      setLoading(false);
    }
  };

  const testBusArrivalApi = async () => {
    setTestingArrival(true);
    setArrivalResult(null);
    try {
      let url = `/api/busArrival?BusStopCode=${encodeURIComponent(testStopCode)}`;
      if (testServiceNo.trim()) {
        url += `&ServiceNo=${encodeURIComponent(testServiceNo.trim())}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setArrivalResult(data);
    } catch (err: any) {
      setArrivalResult({ error: err.message });
    } finally {
      setTestingArrival(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    testBusArrivalApi();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121824] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-slate-100 text-base">
                API Health & Gateway Monitor
              </h3>
              <p className="text-[11px] text-slate-400">
                Monitoring /api/health & LTA DataMall v3 BusArrival endpoint
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Health Status Box */}
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00E5FF]" />
                <span>GET /api/health</span>
              </span>
              <button
                onClick={fetchHealth}
                disabled={loading}
                className="flex items-center gap-1 text-[11px] text-[#00E5FF] hover:underline"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="text-slate-400 py-2">Pinging /api/health...</div>
            ) : error ? (
              <div className="text-rose-400 flex items-center gap-2 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Error: {error}</span>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1 text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Gateway Status:</span>
                  <span className="text-[#00E676] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {healthData?.status?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>LTA DataMall Status:</span>
                  <span
                    className={`font-bold ${
                      healthData?.ltaDataMall?.accountKeyConfigured
                        ? 'text-[#00E676]'
                        : 'text-[#FFB300]'
                    }`}
                  >
                    {healthData?.ltaDataMall?.accountKeyConfigured
                      ? 'LTA_ACCOUNT_KEY Configured (Live Feed)'
                      : 'Pending LTA_ACCOUNT_KEY (Preview Mode)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Timestamp:</span>
                  <span className="text-slate-400">{healthData?.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Uptime:</span>
                  <span className="text-slate-400">{healthData?.uptimeSeconds}s</span>
                </div>
              </div>
            )}
          </div>

          {/* Test /api/busArrival Interactive Client */}
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="text-slate-200 font-semibold uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#00E676]" />
                <span>Interactive LTA Bus Arrival Query</span>
              </span>
              <span className="text-slate-500 text-[10px]">LTA DataMall v3</span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  BusStopCode (Required, e.g. 04121, 01112)
                </label>
                <input
                  type="text"
                  value={testStopCode}
                  onChange={(e) => setTestStopCode(e.target.value)}
                  placeholder="04121"
                  className="w-full bg-[#121824] border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  ServiceNo (Optional, e.g. 7, 147)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testServiceNo}
                    onChange={(e) => setTestServiceNo(e.target.value)}
                    placeholder="7"
                    className="flex-1 bg-[#121824] border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00E5FF]"
                  />
                  <button
                    onClick={testBusArrivalApi}
                    disabled={testingArrival || !testStopCode}
                    className="px-3 py-1.5 bg-[#00E5FF] hover:bg-[#00c8e0] text-slate-950 font-bold rounded flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {testingArrival ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Send</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Result JSON Inspector */}
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Response Payload</span>
                {arrivalResult?.source && (
                  <span className="text-[#00E5FF] font-bold">
                    Source: {arrivalResult.source}
                  </span>
                )}
              </div>
              <pre className="bg-[#121824] p-3 rounded-lg border border-slate-800 text-[11px] text-emerald-300 max-h-48 overflow-y-auto overflow-x-auto whitespace-pre">
                {JSON.stringify(arrivalResult, null, 2)}
              </pre>
            </div>
          </div>

          {/* Vercel Environment Deployment Note */}
          <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-amber-200/90 text-[11px] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Vercel Configuration Ready</span>
            </div>
            <p className="leading-relaxed">
              When deploying to Vercel, set <code className="bg-amber-900/50 px-1 py-0.5 rounded text-amber-100">LTA_ACCOUNT_KEY</code> in Project Settings &rarr; Environment Variables. The endpoint will automatically forward queries directly to LTA DataMall v3.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0B0F17] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
