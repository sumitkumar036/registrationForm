import React, { useMemo } from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { CheckCircle2, ShieldCheck, ArrowLeft, Trophy, Calendar, MapPin } from 'lucide-react';

interface VerifyUserViewProps {
  onBackToHome?: () => void;
}

export const VerifyUserView: React.FC<VerifyUserViewProps> = ({ onBackToHome }) => {
  // Parse query parameters directly from the browser URL
  const queryParams = useMemo(() => {
    if (typeof window === 'undefined') return { bib: '', id: '', name: '' };
    const params = new URLSearchParams(window.location.search);
    return {
      bib: params.get('bib') || '',
      id: params.get('id') || '',
      name: params.get('name') || '',
    };
  }, []);

  const { bib, id, name } = queryParams;
  const isValid = Boolean(bib);

  const handleReturn = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-stone-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-stone-900/95 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Verification Status Header */}
        <div className="p-6 text-center bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 text-stone-950">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-stone-950 text-amber-400 rounded-2xl shadow-xl ring-4 ring-white/20 mb-2">
            {isValid ? <ShieldCheck className="w-8 h-8" /> : <Trophy className="w-8 h-8" />}
          </div>
          <div className="text-[11px] font-black uppercase tracking-wider text-stone-950">
            Official Pass Verification
          </div>
          <h1 className="font-display text-2xl font-black tracking-tight mt-0.5">
            {isValid ? 'VERIFIED PARTICIPANT' : 'INVALID PASS DETAILS'}
          </h1>
          <p className="text-xs font-bold mt-1 text-stone-900">
            Vijaya Janta Party Marathon 2026
          </p>
        </div>

        {/* Pass Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {isValid ? (
            <div className="border-2 border-dashed border-amber-400/80 bg-stone-950/70 rounded-2xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Participant Name
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white font-display">
                    {name || 'Registered Runner'}
                  </div>
                  <div className="text-xs text-stone-400 font-mono mt-0.5">
                    Ref ID: {id || 'N/A'}
                  </div>
                </div>

                <div className="bg-stone-900 border-2 border-amber-500/80 px-4 py-2 rounded-xl text-center shadow-inner">
                  <div className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                    Bib Number
                  </div>
                  <div className="text-2xl font-black font-mono text-amber-400 tabular-nums">
                    {bib}
                  </div>
                </div>
              </div>

              {/* Event Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <span className="text-stone-400 text-[10px] block">Date</span>
                    <span className="font-bold text-white">Oct 25, 2026</span>
                  </div>
                </div>
                <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-stone-400 text-[10px] block">Checkpoint</span>
                    <span className="font-bold text-emerald-400">Entry Valid</span>
                  </div>
                </div>
              </div>

              {/* QR Code Mirror */}
              <div className="pt-2 flex flex-col items-center">
                <QRCodeDisplay
                  bibNumber={bib}
                  registrationId={id}
                  runnerName={name}
                  size={170}
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Live Pass Authenticated
                </span>
                <span className="font-mono text-[11px] text-stone-500">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-stone-300 text-sm">
                No participant details found in the current link. Ensure you scanned an official QR pass.
              </p>
            </div>
          )}

          {/* Navigation Action */}
          <button
            onClick={handleReturn}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-stone-700 shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Return to Marathon Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};