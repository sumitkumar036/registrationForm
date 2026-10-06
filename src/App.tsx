import React, { useState, useEffect } from 'react';
import { RegistrationForm } from './components/RegistrationForm';
import { AfterMarathonSurveyForm } from './components/AfterMarathonSurveyForm';
import { MarathonVisualBanner } from './components/MarathonVisualBanner';
import { AthleticGraphicsBackground } from './components/AthleticGraphicsBackground';
import { CelebrationConfetti } from './components/CelebrationConfetti';
import { CelebrationPostModal } from './components/CelebrationPostModal';
import { PreMarathonRegistrationRecord, AfterMarathonSurveyRecord } from './types';
import { Users, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'register' | 'survey'>('register');
  const [registeredCount, setRegisteredCount] = useState<number>(3);
  const [lastRegistered, setLastRegistered] = useState<PreMarathonRegistrationRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Celebration state
  const [celebrationActive, setCelebrationActive] = useState<boolean>(false);
  const [celebrationType, setCelebrationType] = useState<'registration' | 'survey'>('registration');
  const [celebrationRegRecord, setCelebrationRegRecord] = useState<PreMarathonRegistrationRecord | null>(null);
  const [celebrationSurRecord, setCelebrationSurRecord] = useState<AfterMarathonSurveyRecord | null>(null);

  // Fetch registered number from backend API
  const fetchRegisteredNumber = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setRegisteredCount(data.totalRegistrations);
      }
    } catch (e) {
      console.error('Failed to fetch registered count:', e);
    }
  };

  useEffect(() => {
    fetchRegisteredNumber();
  }, []);

  const handleRegistrationSuccess = (record: PreMarathonRegistrationRecord) => {
    setLastRegistered(record);
    fetchRegisteredNumber();
    showToast(`Registered successfully! Your Assigned Number: ${record.bibNumber}`);

    // Trigger celebration post & confetti
    setCelebrationType('registration');
    setCelebrationRegRecord(record);
    setCelebrationSurRecord(null);
    setCelebrationActive(true);
  };

  const handleSurveySuccess = (record: AfterMarathonSurveyRecord) => {
    fetchRegisteredNumber();
    showToast(`Survey submitted successfully! Reference: ${record.id}`);

    // Trigger celebration post & confetti
    setCelebrationType('survey');
    setCelebrationSurRecord(record);
    setCelebrationRegRecord(null);
    setCelebrationActive(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-stone-100 flex flex-col font-sans relative selection:bg-amber-500 selection:text-stone-950">
      {/* Full-bleed Athletic Graphics Background */}
      <AthleticGraphicsBackground />

      {/* Confetti Explosion on Success */}
      {celebrationActive && (
        <CelebrationConfetti
          duration={6000}
          onComplete={() => {
            // Keep confetti until modal is closed
          }}
        />
      )}

      {/* Celebration Post Success Modal */}
      {celebrationActive && (
        <CelebrationPostModal
          type={celebrationType}
          registrationRecord={celebrationRegRecord}
          surveyRecord={celebrationSurRecord}
          onClose={() => setCelebrationActive(false)}
          onSwitchToSurvey={() => {
            setCelebrationActive(false);
            setActiveView('survey');
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-40 bg-stone-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/40 backdrop-blur-md flex items-center gap-3 text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header with Vijaya Janta Party Branding and Registered Number */}
      <header className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-stone-800 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* VJP Emblem badge with radiant gradient */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center text-amber-400 font-black text-xs tracking-tight">
                VJP
              </div>
            </div>
            <div>
              <h1 className="font-display font-black text-base sm:text-lg text-white tracking-tight leading-tight">
                Vijaya Janta Party Marathon 2026
              </h1>
              {/* <p className="text-[11px] font-bold text-orange-400">
                विजय जनता पार्टी · वार्षिक मैराथन
              </p> */}
            </div>
          </div>

          {/* Registered Number Display in Header */}
          <div className="flex items-center gap-2.5 bg-stone-900/90 border border-amber-500/40 px-4 py-1.5 rounded-xl shadow-inner">
            <Users className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider leading-tight">
                Registered
              </span>
              <span className="font-display font-black text-white text-sm sm:text-base tabular-nums leading-none">
                {registeredCount} <span className="text-[11px] font-bold text-orange-400">Runners</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Single Page Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 relative z-10">
        {/* Marathon Visual Graphic Banner */}
        <MarathonVisualBanner registeredCount={registeredCount} />

        {/* Toggle Switcher between Registration and Survey */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-stone-900/90 backdrop-blur rounded-2xl border border-stone-800 shadow-lg">
            {/* <button
              onClick={() => setActiveView('register')}
              className={`px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeView === 'register'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              1. Marathon Registration
            </button> */}
            {/* <button
              onClick={() => setActiveView('survey')}
              className={`px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeView === 'survey'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              2. After Marathon Survey
            </button> */}
          </div>
        </div>

        {/* Active Form */}
        {activeView === 'register' ? (
          <RegistrationForm
            onSuccess={handleRegistrationSuccess}
            onSwitchToSurvey={() => setActiveView('survey')}
          />
        ) : (
          <AfterMarathonSurveyForm
            onSuccess={handleSurveySuccess}
            onSwitchToRegister={() => setActiveView('register')}
            defaultRunnerName={lastRegistered ? `${lastRegistered.name} (${lastRegistered.bibNumber})` : ''}
          />
        )}
      </main>

      {/* Quiet Minimal Dark Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950/80 backdrop-blur py-6 mt-12 text-xs text-stone-400 relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-white">
              Vijaya Janta Party Marathon 2026
            </span>
            <span className="text-stone-600 mx-2">·</span>
            <span>@CDTC</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Total Registered Runners:</span>
            <span className="font-mono font-bold text-amber-400 bg-stone-900 border border-stone-800 px-2.5 py-0.5 rounded">
              {registeredCount} Athletes
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
