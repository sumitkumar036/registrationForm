import React, { useState } from 'react';
import { PreMarathonRegistrationRecord, AfterMarathonSurveyRecord } from '../types';
import { Trophy, CheckCircle2, Share2, Download, Copy, Check, X, Sparkles, Award } from 'lucide-react';

interface CelebrationPostModalProps {
  type: 'registration' | 'survey';
  registrationRecord?: PreMarathonRegistrationRecord | null;
  surveyRecord?: AfterMarathonSurveyRecord | null;
  onClose: () => void;
  onSwitchToSurvey?: () => void;
}

export const CelebrationPostModal: React.FC<CelebrationPostModalProps> = ({
  type,
  registrationRecord,
  surveyRecord,
  onClose,
  onSwitchToSurvey,
}) => {
  const [copied, setCopied] = useState(false);

  const identifier = registrationRecord?.bibNumber || surveyRecord?.id || 'VJP-2026';
  const name = registrationRecord?.name || surveyRecord?.runnerIdentifier || 'Champion Runner';

  const handleCopy = () => {
    navigator.clipboard?.writeText(
      `I am officially registered for the Vijaya Janta Party Marathon 2026! My Bib: ${identifier}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl border-2 border-amber-500/80 shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="relative p-6 sm:p-8 text-center bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-950 text-amber-400 mb-3 shadow-xl ring-4 ring-white/20">
            {type === 'registration' ? (
              <Trophy className="w-9 h-9" />
            ) : (
              <Award className="w-9 h-9" />
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 bg-stone-950/80 backdrop-blur px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-amber-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Vijaya Janta Party · Victory Run 2026</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
            {type === 'registration'
              ? '🎉 REGISTRATION VICTORIOUS!'
              : '🏅 SURVEY RECORDED WITH HONOR!'}
          </h2>

          <p className="text-stone-950 font-bold text-xs sm:text-sm mt-1 max-w-md mx-auto">
            {type === 'registration'
              ? 'Congratulations! You are officially confirmed for the Vijaya Janta Party Marathon.'
              : 'Thank you for your valuable feedback to the Vijaya Janta Party organizing team!'}
          </p>
        </div>

        {/* Digital Souvenir / Race Pass Card */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="border-2 border-dashed border-amber-400/80 bg-stone-800/60 rounded-2xl p-6 relative backdrop-blur-xs">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-700/80 pb-5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  Official Participant Pass
                </div>
                <div className="text-2xl font-black font-display text-white mt-0.5">
                  {name}
                </div>
                <div className="text-xs text-stone-400 mt-0.5">
                  Vijaya Janta Party Marathon · Oct 25, 2026
                </div>
              </div>

              <div className="bg-stone-900 border-2 border-amber-500/80 px-4 py-2.5 rounded-xl text-center sm:text-right shadow-inner">
                <div className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                  Assigned Registered Number
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tabular-nums">
                  {identifier}
                </div>
              </div>
            </div>

            {/* Registration Details */}
            {type === 'registration' && registrationRecord && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40">
                  <span className="text-stone-400 text-[10px] block">Distance</span>
                  <span className="font-bold text-white text-sm">{registrationRecord.distance}</span>
                </div>
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40">
                  <span className="text-stone-400 text-[10px] block">Age Group</span>
                  <span className="font-bold text-white text-sm">{registrationRecord.ageGroup}</span>
                </div>
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40">
                  <span className="text-stone-400 text-[10px] block">First Marathon</span>
                  <span className="font-bold text-white text-sm">{registrationRecord.isFirstMarathon}</span>
                </div>
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40">
                  <span className="text-stone-400 text-[10px] block">Status</span>
                  <span className="font-bold text-emerald-400 text-sm">Confirmed</span>
                </div>
              </div>
            )}

            {/* Survey Details */}
            {type === 'survey' && surveyRecord && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs">
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40">
                  <span className="text-stone-400 text-[10px] block">Overall Rating</span>
                  <span className="font-bold text-amber-400 text-sm">{surveyRecord.overallExperience} / 5 Stars</span>
                </div>
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40">
                  <span className="text-stone-400 text-[10px] block">Participation</span>
                  <span className="font-bold text-white text-sm">{surveyRecord.participationStatus}</span>
                </div>
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40">
                  <span className="text-stone-400 text-[10px] block">Organization</span>
                  <span className="font-bold text-white text-sm">{surveyRecord.organizationSatisfaction}</span>
                </div>
              </div>
            )}

            {/* Mock Barcode / Security Strip */}
            <div className="mt-5 pt-3 border-t border-stone-700/80 flex items-center justify-between text-[11px] text-stone-400">
              <div className="font-mono tracking-widest text-stone-300 text-xs">
                ||| | |||| | ||| |||| | ||||| | ||
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Backend API Verified
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-stone-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Text'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-stone-700"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Print / Save Pass</span>
            </button>

            {type === 'registration' && onSwitchToSurvey && (
              <button
                onClick={() => {
                  onClose();
                  onSwitchToSurvey();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 rounded-xl text-xs font-black transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Go to Post-Race Survey</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
