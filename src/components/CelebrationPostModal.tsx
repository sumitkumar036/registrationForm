import React, { useState } from 'react';
import { PreMarathonRegistrationRecord, AfterMarathonSurveyRecord } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Trophy, CheckCircle2, Download, Copy, Check, X, Sparkles, Award, Mail, ExternalLink } from 'lucide-react';

interface CelebrationPostModalProps {
  type: 'registration' | 'survey';
  registrationRecord?: PreMarathonRegistrationRecord | null;
  surveyRecord?: AfterMarathonSurveyRecord | null;
  onClose: () => void;
  onSwitchToSurvey?: () => void;
  onOpenVerification?: (bib: string) => void;
}

export const CelebrationPostModal: React.FC<CelebrationPostModalProps> = ({
  type,
  registrationRecord,
  surveyRecord,
  onClose,
  onSwitchToSurvey,
  onOpenVerification,
}) => {
  const [copied, setCopied] = useState(false);

  const identifier = registrationRecord?.bibNumber || surveyRecord?.id || 'VJP-2026';
  const name = registrationRecord?.name || surveyRecord?.runnerIdentifier || 'Champion Runner';
  const email = registrationRecord?.email || '';

  const handleCopy = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const verifyUrl = `${origin}/verifyUser?bib=${encodeURIComponent(identifier)}`;
    navigator.clipboard?.writeText(
      `I am officially registered for the Vijaya Janta Party Marathon 2026! My Bib is ${identifier}. Verify my pass here: ${verifyUrl}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/85 backdrop-blur-md animate-fade-in overflow-y-auto print:p-0 print:bg-transparent print:overflow-visible">
      
      {/* Strict Print Rules: Single page enforcement & hides buttons like Save QR */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: portrait;
            margin: 6mm;
          }
          html, body {
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-pass-card, #printable-pass-card * {
            visibility: visible !important;
          }
          #printable-pass-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: 100vh !important;
            margin: 0 !important;
            padding: 10px !important;
            box-shadow: none !important;
            border: 2px solid #1e293b !important;
            background: #ffffff !important;
            color: #0f172a !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }
          /* Hide all buttons/actions inside the QR component or modal during print */
          #printable-pass-card button, 
          #printable-pass-card .print-hidden {
            display: none !important;
          }
          .print-dark-text {
            color: #0f172a !important;
          }
          .print-bg-light {
            background-color: #f8fafc !important;
            border-color: #cbd5e1 !important;
          }
        }
      `}} />

      {/* Modal Dialog */}
      <div 
        id="printable-pass-card"
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl border-2 border-amber-500/80 shadow-2xl overflow-hidden my-auto"
      >
        
        {/* Pinned Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="print-hidden absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-700/60 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="relative p-4 sm:p-6 text-center bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 shrink-0 print:bg-amber-500 print:py-2">
          <div className="print-hidden inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-stone-950 text-amber-400 mb-2 shadow-xl ring-4 ring-white/20">
            {type === 'registration' ? (
              <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
            ) : (
              <Award className="w-7 h-7 sm:w-8 sm:h-8" />
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 bg-stone-950/80 backdrop-blur px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300 mb-1 print:bg-black print:text-amber-200">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Vijaya Janta Party · Victory Run 2026</span>
          </div>

          <h2 className="font-display text-lg sm:text-2xl font-black text-stone-950 tracking-tight leading-tight">
            {type === 'registration'
              ? 'REGISTRATION VICTORIOUS!'
              : 'SURVEY RECORDED WITH HONOR!'}
          </h2>

          <p className="text-stone-950 font-bold text-xs mt-0.5 max-w-md mx-auto">
            {type === 'registration'
              ? 'Congratulations! You are officially confirmed for the Vijaya Janta Party Marathon.'
              : 'Thank you for your valuable feedback to the Vijaya Janta Party organizing team!'}
          </p>
        </div>

        {/* Email & Dispatch Banner */}
        {type === 'registration' && email && (
          <div className="bg-amber-500/15 border-y border-amber-500/30 px-4 sm:px-6 py-2 flex items-center gap-2.5 text-xs text-amber-300 shrink-0 print:bg-gray-100 print:text-gray-900 print:border-gray-300 print:py-1">
            <Mail className="w-4 h-4 text-amber-400 shrink-0 print:text-gray-700" />
            <span className="truncate">
              Pass & QR code generated for <strong className="text-white print:text-black">{email}</strong>
            </span>
          </div>
        )}

        {/* Scrollable Modal Body Container */}
        <div className="overflow-y-auto px-5 py-4 sm:px-8 sm:py-5 space-y-4 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900 print:overflow-visible print:p-2.5 print:space-y-1.5">
          <div className="border-2 border-dashed border-amber-400/80 bg-stone-850/70 rounded-2xl p-3 sm:p-5 relative backdrop-blur-xs print-bg-light print:border-stone-400 print:p-2.5">
            
            {/* Participant Name & Bib Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-700/80 pb-3 print:border-stone-300 print:pb-1.5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 print:text-orange-700">
                  Official Participant Pass
                </div>
                <div className="text-lg sm:text-2xl font-black font-display text-white mt-0.5 print-dark-text">
                  {name}
                </div>
                <div className="text-xs text-stone-400 mt-0.5 print:text-gray-600">
                  Vijaya Janta Party Marathon · Oct 25, 2026
                </div>
              </div>

              <div className="bg-stone-900 border-2 border-amber-500/80 px-3 py-1.5 rounded-xl text-center sm:text-right shadow-inner self-start sm:self-auto print:bg-white print:border-stone-400">
                <div className="text-[9px] sm:text-[10px] font-bold uppercase text-stone-400 tracking-wider print:text-gray-600">
                  Assigned Bib Number
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 tabular-nums leading-tight print:text-stone-900">
                  {identifier}
                </div>
              </div>
            </div>

            {/* Registration Details & QR Code */}
            {type === 'registration' && registrationRecord && (
              <div className="space-y-2.5 pt-2.5 print:space-y-1.5 print:pt-1.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-stone-900/80 rounded-lg border border-stone-700/60 print:bg-white print:border-stone-300 print:p-1">
                    <span className="text-stone-400 text-[10px] block print:text-gray-600">Distance</span>
                    <span className="font-bold text-white text-xs sm:text-sm print-dark-text">{registrationRecord.distance}</span>
                  </div>
                  <div className="p-2 bg-stone-900/80 rounded-lg border border-stone-700/60 print:bg-white print:border-stone-300 print:p-1">
                    <span className="text-stone-400 text-[10px] block print:text-gray-600">Age Group</span>
                    <span className="font-bold text-white text-xs sm:text-sm print-dark-text">{registrationRecord.ageGroup}</span>
                  </div>
                  <div className="p-2 bg-stone-900/80 rounded-lg border border-stone-700/60 print:bg-white print:border-stone-300 print:p-1">
                    <span className="text-stone-400 text-[10px] block print:text-gray-600">First Marathon</span>
                    <span className="font-bold text-white text-xs sm:text-sm print-dark-text">{registrationRecord.isFirstMarathon}</span>
                  </div>
                  <div className="p-2 bg-stone-900/80 rounded-lg border border-stone-700/60 print:bg-white print:border-stone-300 print:p-1">
                    <span className="text-stone-400 text-[10px] block print:text-gray-600">Status</span>
                    <span className="font-bold text-emerald-400 text-xs sm:text-sm print:text-emerald-700">Confirmed</span>
                  </div>
                </div>

                {/* Embedded Live QR Code */}
                <div className="pt-1 flex flex-col items-center justify-center print:pt-0">
                  <QRCodeDisplay
                    bibNumber={registrationRecord.bibNumber}
                    registrationId={registrationRecord.id}
                    runnerName={registrationRecord.name}
                    size={110}
                  />
                </div>
              </div>
            )}

            {/* Survey Details */}
            {type === 'survey' && surveyRecord && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40 print:bg-white print:border-stone-300">
                  <span className="text-stone-400 text-[10px] block print:text-gray-600">Overall Rating</span>
                  <span className="font-bold text-amber-400 text-sm print:text-amber-700">{surveyRecord.overallExperience} / 5 Stars</span>
                </div>
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40 print:bg-white print:border-stone-300">
                  <span className="text-stone-400 text-[10px] block print:text-gray-600">Participation</span>
                  <span className="font-bold text-white text-sm print-dark-text">{surveyRecord.participationStatus}</span>
                </div>
                <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-700/40 print:bg-white print:border-stone-300">
                  <span className="text-stone-400 text-[10px] block print:text-gray-600">Organization</span>
                  <span className="font-bold text-white text-sm print-dark-text">{surveyRecord.organizationSatisfaction}</span>
                </div>
              </div>
            )}

            {/* Verification Tag */}
            <div className="mt-2.5 pt-2 border-t border-stone-700/80 flex items-center justify-between text-[11px] text-stone-400 print:border-stone-300 print:text-gray-700 print:mt-1.5 print:pt-1">
              <span className="font-mono text-amber-300 print:text-stone-900">
                ID: {registrationRecord?.id || surveyRecord?.id}
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px] print:text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Database Authenticated
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="print-hidden flex flex-wrap items-center gap-2.5 justify-center pt-1 pb-1">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-stone-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Share Link!' : 'Copy Share Link'}</span>
            </button>

            {type === 'registration' && onOpenVerification && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVerification(identifier);
                }}
                className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500/40"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open /verifyUser</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-stone-700"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Print / Save Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};