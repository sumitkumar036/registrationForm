import React, { useState } from 'react';
import { PreMarathonFormData, PreMarathonRegistrationRecord } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { CheckCircle2, AlertCircle, Send, Sparkles, User, Mail, ArrowRight } from 'lucide-react';
import { submitRegistration } from '../Service/api';

interface RegistrationFormProps {
  onSuccess: (record: PreMarathonRegistrationRecord) => void;
  onSwitchToSurvey: () => void;
  onOpenVerification?: (bib: string) => void;
}

const AGE_GROUPS = ['Under 18', '18-25', '26-35', '36-45', '46-55', '56+'];
const GENDERS = ['Male', 'Female', 'Prefer not to say'];
const DISTANCES = ['3 KM', '5 KM', '10 KM', 'Half Marathon', 'Other'];
const EXERCISE_FREQUENCIES = ['Daily', '3-5 times a week', '1-2 times a week', 'Occasionally', 'Rarely'];
const MOTIVATIONS = [
  'Fitness & health',
  'Personal challenge',
  'Social/community participation',
  'Supporting a cause',
  'Fun & experience',
  'Other',
];
const FITNESS_LEVELS = ['Excellent', 'Good', 'Average', 'Below average'];
const CONFIDENCE_LEVELS = ['Very confident', 'Confident', 'Neutral', 'Slightly concerned', 'Not confident'];
const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbzB4V_g254DOStW4xuaUpyCORB9LlaFTbvTIlK_imcgKwbbZkGsH7r7Lfn67TR9tHLC/exec';

const initialFormData: PreMarathonFormData = {
  name: '',
  email: '',
  ageGroup: '',
  gender: '',
  isFirstMarathon: '',
  distance: '',
  otherDistance: '',
  exerciseFrequency: '',
  mainMotivation: '',
  otherMotivation: '',
  fitnessLevel: '',
  confidenceLevel: '',
  expectations: '',
};

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, onSwitchToSurvey, onOpenVerification }) => {
  const [formData, setFormData] = useState<PreMarathonFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<PreMarathonRegistrationRecord | null>(null);

  // Validation function
  const validate = (data: PreMarathonFormData): Record<string, string> => {
    const errs: Record<string, string> = {};

    // 1. Name is optional, no error

    // 2. Email Address (Required for sending confirmation email & QR pass)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !data.email.trim()) {
      errs.email = 'Please provide an email address to receive your official QR Code pass.';
    } else if (!emailRegex.test(data.email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. runner@gmail.com).';
    }

    // 3. Age group
    if (!data.ageGroup) {
      errs.ageGroup = 'Please select your age group.';
    }

    // 4. Gender
    if (!data.gender) {
      errs.gender = 'Please select your gender.';
    }

    // 5. First marathon
    if (!data.isFirstMarathon) {
      errs.isFirstMarathon = 'Please indicate if this is your first marathon/running event.';
    }

    // 6. Distance
    if (!data.distance) {
      errs.distance = 'Please choose the distance you are participating in.';
    } else if (data.distance === 'Other' && !data.otherDistance.trim()) {
      errs.otherDistance = 'Please specify your custom participating distance.';
    }

    // 7. Exercise frequency
    if (!data.exerciseFrequency) {
      errs.exerciseFrequency = 'Please tell us how often you exercise or run.';
    }

    // 8. Main motivation
    if (!data.mainMotivation) {
      errs.mainMotivation = 'Please select your main motivation for participating.';
    } else if (data.mainMotivation === 'Other' && !data.otherMotivation.trim()) {
      errs.otherMotivation = 'Please specify your motivation.';
    }

    // 9. Fitness level
    if (!data.fitnessLevel) {
      errs.fitnessLevel = 'Please rate your current fitness level.';
    }

    // 10. Confidence level
    if (!data.confidenceLevel) {
      errs.confidenceLevel = 'Please select your confidence level about completing the distance.';
    }

    // 11. Expectations
    if (!data.expectations.trim()) {
      errs.expectations = 'Please describe what you are expecting from today\'s event.';
    } else if (data.expectations.trim().length < 3) {
      errs.expectations = 'Please enter at least 3 characters for your expectations.';
    }

    return errs;
  };

  const handleFieldChange = (field: keyof PreMarathonFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const errs = validate(updated);
      setErrors((prev) => {
        const next = { ...prev };
        if (!errs[field]) {
          delete next[field];
        } else {
          next[field] = errs[field];
        }
        return next;
      });
    }
  };

  const handleBlur = (field: keyof PreMarathonFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(formData);
    if (errs[field]) {
      setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    }
  };

  const fillSampleData = () => {
    const sample: PreMarathonFormData = {
      name: 'Rohan Verma',
      email: 'rohan.verma@example.com',
      ageGroup: '26-35',
      gender: 'Male',
      isFirstMarathon: 'No',
      distance: '10 KM',
      otherDistance: '',
      exerciseFrequency: '3-5 times a week',
      mainMotivation: 'Fitness & health',
      otherMotivation: '',
      fitnessLevel: 'Good',
      confidenceLevel: 'Very confident',
      expectations: 'Looking forward to running for community fitness, enjoying great course energy, and completing under 50 minutes.',
    };
    setFormData(sample);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Mark all required fields as touched
    const allTouched: Record<string, boolean> = {
      email: true,
      ageGroup: true,
      gender: true,
      isFirstMarathon: true,
      distance: true,
      otherDistance: true,
      exerciseFrequency: true,
      mainMotivation: true,
      otherMotivation: true,
      fitnessLevel: true,
      confidenceLevel: true,
      expectations: true,
    };
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the helper function directly
      const result = await submitRegistration(formData);

      if (!result.success) {
        setServerError(result.message || 'Failed to submit registration. Please verify your inputs.');
        if (result.errors) {
          setErrors(result.errors);
        }
      } else if (result.data) {
        setSubmittedRecord(result.data);
        onSuccess(result.data);
      }
    } catch (err: any) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const totalRequired = 10; // email + questions 2 to 10
  const answeredCount = [
    Boolean(formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())),
    Boolean(formData.ageGroup),
    Boolean(formData.gender),
    Boolean(formData.isFirstMarathon),
    Boolean(formData.distance && (formData.distance !== 'Other' || formData.otherDistance.trim())),
    Boolean(formData.exerciseFrequency),
    Boolean(formData.mainMotivation && (formData.mainMotivation !== 'Other' || formData.otherMotivation.trim())),
    Boolean(formData.fitnessLevel),
    Boolean(formData.confidenceLevel),
    Boolean(formData.expectations.trim().length >= 3),
  ].filter(Boolean).length;

  const progressPercent = Math.round((answeredCount / totalRequired) * 100);

  // If already submitted, display the official registration pass with QR Code
  if (submittedRecord) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-stone-900/95 backdrop-blur-md rounded-3xl border-2 border-amber-500/60 shadow-2xl overflow-hidden text-white">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-orange-600 via-stone-900 to-emerald-800 text-white p-8 text-center relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-400 text-stone-950 rounded-2xl mb-3 font-bold shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Vijaya Janta Party Marathon 2026
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight mt-1">
              Registration & QR Pass Confirmed!
            </h2>
            <p className="text-stone-200 text-xs sm:text-sm mt-1 max-w-md mx-auto">
              Your details are officially recorded. Scan the QR code below or check your email ({submittedRecord.email}).
            </p>
          </div>

          {/* Bib Digital Pass with QR Code */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-2 border-dashed border-orange-500/70 bg-stone-950/70 rounded-2xl p-6 relative">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-stone-800 pb-5">
                <div>
                  <div className="text-[11px] uppercase font-black tracking-wider text-orange-400">
                    Vijaya Janta Party · Official Participant
                  </div>
                  <div className="text-2xl font-black text-white font-display mt-0.5">
                    {submittedRecord.name || 'Anonymous Runner'}
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    Email: <strong className="text-amber-300 font-mono">{submittedRecord.email}</strong>
                  </div>
                </div>

                <div className="text-center sm:text-right bg-stone-900 px-5 py-3 rounded-xl border border-orange-500/60 shadow-inner">
                  <div className="text-[10px] font-bold text-orange-300 uppercase tracking-wider">
                    Assigned Registered Number
                  </div>
                  <div className="text-3xl font-black font-mono text-amber-400 tabular-nums">
                    {submittedRecord.bibNumber}
                  </div>
                </div>
              </div>

              {/* QR Code Display Container */}
              <div className="pt-6 pb-4 flex flex-col items-center border-b border-stone-800">
                <QRCodeDisplay
                  bibNumber={submittedRecord.bibNumber}
                  registrationId={submittedRecord.id}
                  runnerName={submittedRecord.name}
                  size={180}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
                <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Category</span>
                  <span className="font-bold text-white text-sm">{submittedRecord.distance}</span>
                </div>
                <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Age Group</span>
                  <span className="font-bold text-white text-sm">{submittedRecord.ageGroup}</span>
                </div>
                <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">First Marathon</span>
                  <span className="font-bold text-white text-sm">{submittedRecord.isFirstMarathon}</span>
                </div>
                <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Confidence</span>
                  <span className="font-bold text-white text-sm">{submittedRecord.confidenceLevel}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>Confirmation ID: <strong className="font-mono text-amber-300">{submittedRecord.id}</strong></span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  ● Confirmed & Verified in Database
                </span>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2">
              <button
                onClick={() => {
                  setSubmittedRecord(null);
                  setFormData(initialFormData);
                  setTouched({});
                  setErrors({});
                }}
                className="w-full sm:w-auto px-6 py-3 border border-stone-700 bg-stone-800 hover:bg-stone-700 rounded-xl text-xs sm:text-sm font-bold text-stone-200 transition-colors cursor-pointer"
              >
                Register Another Runner
              </button>
{/* 
              <button
                onClick={onSwitchToSurvey}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Post-Race Survey</span>
                <ArrowRight className="w-4 h-4" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Form Card */}
      <div className="bg-stone-900/95 backdrop-blur-xl rounded-3xl border border-stone-800/90 shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="p-6 sm:p-8 border-b border-stone-800/80 bg-stone-950/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] uppercase font-black tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-0.5 rounded-full">
                  Vijaya Janta Party Marathon 2026
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Official Marathon Registration Form
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-1">
                Complete the fields below to obtain your assigned Bib Number and scannable QR Code pass.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={fillSampleData}
                className="text-xs font-semibold text-stone-200 hover:text-white bg-stone-800/90 hover:bg-stone-700 border border-stone-700/80 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
               
                <span>Fill Sample</span>
              </button>
            </div>
          </div>

          {/* Completion Progress Bar */}
          <div className="mt-6 pt-4 border-t border-stone-800">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-300 mb-2">
              <span>Required Questions Completed</span>
              <span className="font-mono tabular-nums text-amber-400">
                {answeredCount} of {totalRequired} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-stone-950 rounded-full h-2.5 overflow-hidden border border-stone-800">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-400 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="m-6 p-4 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-start gap-3 text-rose-200 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Submission Error</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-9">
          {/* QUESTION 1: Name (Optional) */}
          <div id="field-name" className="space-y-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="input-name" className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">1.</span>
                <span>Name</span>
                <span className="text-xs font-normal text-stone-400">(Optional)</span>
              </label>
            </div>
            <div className="relative">
              <input
                id="input-name"
                type="text"
                placeholder="e.g. Rohan Verma (or leave blank to remain anonymous)"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white text-sm placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-colors shadow-inner"
              />
              <User className="w-4 h-4 text-stone-500 absolute right-4 top-3.5" />
            </div>
          </div>

          {/* EMAIL ADDRESS (Required for QR Code Delivery) */}
          <div id="field-email" className="space-y-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="input-email" className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">●</span>
                <span>Email Address</span>
                <span className="text-orange-400 font-bold">*</span>
                <span className="text-xs font-normal text-stone-400">(Required for QR Pass & Email Delivery)</span>
              </label>
              {errors.email && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="input-email"
                type="email"
                placeholder="e.g. rohan.verma@gmail.com"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-3 bg-stone-950/80 border rounded-xl text-white text-sm placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors shadow-inner ${
                  errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-stone-700/80 focus:border-amber-400'
                }`}
              />
              <Mail className="w-4 h-4 text-stone-500 absolute right-4 top-3.5" />
            </div>
            <p className="text-[11px] text-stone-400">
              Your official QR code pass and registration receipt will be emailed here.
            </p>
          </div>

          {/* QUESTION 2: Age Group */}
          <div id="field-ageGroup" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">2.</span>
                <span>Age Group</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.ageGroup && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.ageGroup}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AGE_GROUPS.map((age) => (
                <button
                  type="button"
                  key={age}
                  onClick={() => handleFieldChange('ageGroup', age)}
                  className={`px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl border text-left transition-all cursor-pointer ${
                    formData.ageGroup === age
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  <span className="block">{age}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 3: Gender */}
          <div id="field-gender" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">3.</span>
                <span>Gender</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.gender && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.gender}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {GENDERS.map((gender) => (
                <button
                  type="button"
                  key={gender}
                  onClick={() => handleFieldChange('gender', gender)}
                  className={`px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl border text-left transition-all cursor-pointer ${
                    formData.gender === gender
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 4: Is this your first marathon/running event? */}
          <div id="field-isFirstMarathon" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">4.</span>
                <span>Is this your first marathon/running event?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.isFirstMarathon && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.isFirstMarathon}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              {['Yes', 'No'].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleFieldChange('isFirstMarathon', opt)}
                  className={`px-6 py-3 text-sm font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.isFirstMarathon === opt
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 5: What distance are you participating in? */}
          <div id="field-distance" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">5.</span>
                <span>What distance are you participating in?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {(errors.distance || errors.otherDistance) && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.distance || errors.otherDistance}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {DISTANCES.map((dist) => (
                <button
                  type="button"
                  key={dist}
                  onClick={() => handleFieldChange('distance', dist)}
                  className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.distance === dist
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>

            {formData.distance === 'Other' && (
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Specify distance (e.g. 15 KM, 42 KM Full Marathon)"
                  value={formData.otherDistance}
                  onChange={(e) => handleFieldChange('otherDistance', e.target.value)}
                  onBlur={() => handleBlur('otherDistance')}
                  className={`w-full px-4 py-2.5 bg-stone-950/80 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.otherDistance ? 'border-rose-500 bg-rose-950/30' : 'border-stone-700'
                  }`}
                />
              </div>
            )}
          </div>

          {/* QUESTION 6: How often do you exercise or run? */}
          <div id="field-exerciseFrequency" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">6.</span>
                <span>How often do you exercise or run?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.exerciseFrequency && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.exerciseFrequency}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {EXERCISE_FREQUENCIES.map((freq) => (
                <button
                  type="button"
                  key={freq}
                  onClick={() => handleFieldChange('exerciseFrequency', freq)}
                  className={`px-3 py-3 text-xs sm:text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.exerciseFrequency === freq
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 7: What is your main motivation for participating? */}
          <div id="field-mainMotivation" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">7.</span>
                <span>What is your main motivation for participating?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {(errors.mainMotivation || errors.otherMotivation) && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.mainMotivation || errors.otherMotivation}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {MOTIVATIONS.map((mot) => (
                <button
                  type="button"
                  key={mot}
                  onClick={() => handleFieldChange('mainMotivation', mot)}
                  className={`p-3 text-xs sm:text-sm font-semibold rounded-xl border text-left transition-all cursor-pointer ${
                    formData.mainMotivation === mot
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {mot}
                </button>
              ))}
            </div>

            {formData.mainMotivation === 'Other' && (
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Tell us what motivates you (e.g. In memory of a loved one, corporate team challenge)"
                  value={formData.otherMotivation}
                  onChange={(e) => handleFieldChange('otherMotivation', e.target.value)}
                  onBlur={() => handleBlur('otherMotivation')}
                  className={`w-full px-4 py-2.5 bg-stone-950/80 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.otherMotivation ? 'border-rose-500 bg-rose-950/30' : 'border-stone-700'
                  }`}
                />
              </div>
            )}
          </div>

          {/* QUESTION 8: How would you rate your current fitness level? */}
          <div id="field-fitnessLevel" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">8.</span>
                <span>How would you rate your current fitness level?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.fitnessLevel && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.fitnessLevel}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FITNESS_LEVELS.map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => handleFieldChange('fitnessLevel', level)}
                  className={`p-3 text-xs sm:text-sm font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.fitnessLevel === level
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 9: How confident are you about completing your chosen distance? */}
          <div id="field-confidenceLevel" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">9.</span>
                <span>How confident are you about completing your chosen distance?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.confidenceLevel && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.confidenceLevel}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {CONFIDENCE_LEVELS.map((conf) => (
                <button
                  type="button"
                  key={conf}
                  onClick={() => handleFieldChange('confidenceLevel', conf)}
                  className={`p-3 text-xs sm:text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.confidenceLevel === conf
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {conf}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 10: What are you expecting from today's event? (Short answer) */}
          <div id="field-expectations" className="space-y-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="input-expectations" className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">10.</span>
                <span>What are you expecting from today's event?</span>
                <span className="text-orange-400 font-bold">*</span>
                <span className="text-xs font-normal text-stone-400">(Short answer)</span>
              </label>
              {errors.expectations && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.expectations}
                </span>
              )}
            </div>
            <textarea
              id="input-expectations"
              rows={3}
              placeholder="e.g. Great atmospheric energy, well-placed hydration stations, and reaching a personal best finish time."
              value={formData.expectations}
              onChange={(e) => handleFieldChange('expectations', e.target.value)}
              onBlur={() => handleBlur('expectations')}
              className={`w-full px-4 py-3 bg-stone-950/80 border rounded-xl text-white text-sm placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-colors shadow-inner ${
                errors.expectations ? 'border-rose-500 bg-rose-950/20' : 'border-stone-700/80'
              }`}
            />
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm text-stone-950 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                isSubmitting
                  ? 'bg-amber-300 cursor-not-allowed opacity-75'
                  : 'bg-gradient-to-r from-orange-500 via-amber-400 to-amber-500 hover:from-orange-400 hover:to-amber-300 active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Submitting & Generating QR Code...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Registration & Get QR Pass</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
