import React, { useEffect, useState } from 'react';
import { PreMarathonRegistration } from '../../server';
import { CheckCircle2, ShieldCheck, UserCheck, AlertTriangle, ArrowLeft, Calendar, MapPin, QrCode, Search, RefreshCw } from 'lucide-react';

interface VerifyUserPageProps {
  onBackToHome: () => void;
}

export const VerifyUserPage: React.FC<VerifyUserPageProps> = ({ onBackToHome }) => {
  const [bibQuery, setBibQuery] = useState<string>('');
  const [runner, setRunner] = useState<PreMarathonRegistration | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [isUpdatingCheckIn, setIsUpdatingCheckIn] = useState<boolean>(false);

  // Extract query params from URL
  const fetchRunnerData = async (bibOrId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/verifyUser?bib=${encodeURIComponent(bibOrId)}&id=${encodeURIComponent(bibOrId)}`);
      const data = await res.json();
      if (res.ok && data.found) {
        setRunner(data.runner);
        setIsCheckedIn(data.runner.checkInStatus === 'CHECKED_IN');
      } else {
        setRunner(null);
        setErrorMessage(data.message || `No runner found for "${bibOrId}".`);
      }
    } catch (e: any) {
      setErrorMessage('Network error communicating with verification backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const bib = urlParams.get('bib') || urlParams.get('id') || '';
      const nameParam = urlParams.get('name') || '';

      if (bib) {
        setBibQuery(bib);
        if (nameParam) {
          // Initial optimistic runner state
          setRunner({
            id: urlParams.get('id') || 'REG-PENDING',
            bibNumber: bib,
            name: decodeURIComponent(nameParam),
            email: '',
            ageGroup: 'Verified Athlete',
            gender: 'Registered',
            isFirstMarathon: 'No',
            distance: 'Registered Distance',
            exerciseFrequency: 'Regular',
            mainMotivation: 'Marathon Participation',
            fitnessLevel: 'Active',
            confidenceLevel: 'Confirmed',
            expectations: '',
            createdAt: new Date().toISOString(),
            checkInStatus: 'CONFIRMED',
          });
        }
        fetchRunnerData(bib);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (bibQuery.trim()) {
      fetchRunnerData(bibQuery.trim());
    }
  };

  const handleCheckInToggle = async () => {
    if (!runner) return;
    setIsUpdatingCheckIn(true);
    try {
      const res = await fetch('/api/verifyUser/checkIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bib: runner.bibNumber, id: runner.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsCheckedIn(true);
      }
    } catch (err) {
      console.error('Check-in update failed', err);
    } finally {
      setIsUpdatingCheckIn(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 relative z-10">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white rounded-xl text-xs font-bold border border-stone-800 transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Registration Portal</span>
        </button>

        <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
          QR Verification Terminal
        </span>
      </div>

      {/* Main Verification Card */}
      <div className="bg-stone-900/95 backdrop-blur-xl rounded-3xl border-2 border-amber-500/60 shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-stone-900 to-emerald-800 p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-400 text-stone-950 rounded-2xl mb-3 font-bold shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-300">
            Vijaya Janta Party Marathon 2026
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            Official Runner Verification
          </h2>
          <p className="text-stone-200 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Live QR Scanner & Event Marshal Gate Verification
          </p>
        </div>

        {/* Search Bar (to manually query any Bib) */}
        <div className="p-6 border-b border-stone-800 bg-stone-950/60">
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Bib (e.g. BIB-1042) or Registration ID..."
                value={bibQuery}
                onChange={(e) => setBibQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </form>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {isLoading && (
            <div className="text-center py-12 space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-sm text-stone-300 font-medium">Verifying credentials against backend database...</p>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="p-6 bg-rose-950/40 border border-rose-500/40 rounded-2xl text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">Verification Failed</h3>
              <p className="text-xs text-rose-200 max-w-md mx-auto">{errorMessage}</p>
              <p className="text-xs text-stone-400">
                Please verify the QR code was scanned accurately or query with your BIB number above.
              </p>
            </div>
          )}

          {!isLoading && runner && (
            <div className="space-y-6">
              {/* Verified Ribbon */}
              <div className="p-4 bg-emerald-950/50 border border-emerald-500/50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider block">
                      Status: Verified Participant
                    </span>
                    <span className="text-sm font-bold text-white">
                      Clear for Entry & Bib Pickup
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    isCheckedIn ? 'bg-emerald-500 text-stone-950' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {isCheckedIn ? '● Kit Handed Over' : 'Pending Check-in'}
                  </span>
                </div>
              </div>

              {/* Runner Details Pass */}
              <div className="border-2 border-dashed border-amber-500/70 bg-stone-950/80 rounded-2xl p-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                      Athlete Name
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-display text-white mt-0.5">
                      {runner.name}
                    </div>
                    <div className="text-xs text-stone-400 mt-1">
                      Email: <strong className="text-amber-300 font-mono">{runner.email || 'Registered in-system'}</strong>
                    </div>
                  </div>

                  <div className="bg-stone-900 border-2 border-amber-500 px-5 py-3 rounded-xl text-center sm:text-right shadow-inner">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Official Bib Number
                    </div>
                    <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 tabular-nums">
                      {runner.bibNumber}
                    </div>
                  </div>
                </div>

                {/* Spec Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 text-xs">
                  <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">Distance</span>
                    <span className="font-bold text-white text-sm">{runner.distance}</span>
                  </div>
                  <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">Age Group</span>
                    <span className="font-bold text-white text-sm">{runner.ageGroup}</span>
                  </div>
                  <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">Gender</span>
                    <span className="font-bold text-white text-sm">{runner.gender}</span>
                  </div>
                  <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">Confidence</span>
                    <span className="font-bold text-white text-sm">{runner.confidenceLevel}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-stone-800 text-xs text-stone-300 space-y-1">
                  <div>
                    <span className="text-stone-400">Motivation:</span> <strong>{runner.mainMotivation}</strong>
                  </div>
                  {runner.expectations && (
                    <div>
                      <span className="text-stone-400">Expectations:</span> <em>"{runner.expectations}"</em>
                    </div>
                  )}
                </div>

                {/* Security Barcode */}
                <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <span>Registration ID: <strong className="font-mono text-amber-300">{runner.id}</strong></span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Database Authenticated
                  </span>
                </div>
              </div>

              {/* Marshal Actions */}
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-stone-300">
                  <span className="font-bold text-white block">Event Marshal Desk:</span>
                  <span>Confirm bib & racing kit has been delivered to participant.</span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckInToggle}
                  disabled={isUpdatingCheckIn || isCheckedIn}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    isCheckedIn
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 cursor-default'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-md'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isCheckedIn ? 'Kit Already Handed Over' : 'Mark Kit as Handed Over'}</span>
                </button>
              </div>
            </div>
          )}

          {!isLoading && !runner && !errorMessage && (
            <div className="text-center py-10 space-y-2 text-stone-400">
              <QrCode className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
              <p className="text-sm font-semibold text-stone-200">Scan or Search a Runner to Verify</p>
              <p className="text-xs">
                Scan the QR Code on any athlete's pass or enter their BIB number above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
