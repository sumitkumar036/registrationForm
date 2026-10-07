import React, { useState } from 'react';
import { AfterMarathonFormData, AfterMarathonSurveyRecord } from '../types';
import { Star, CheckCircle2, AlertCircle, Send, Sparkles, Trophy } from 'lucide-react';

interface AfterMarathonSurveyFormProps {
  onSuccess: (record: AfterMarathonSurveyRecord) => void;
  onSwitchToRegister: () => void;
  defaultRunnerName?: string;
}

const PARTICIPATION_OPTIONS = ['Completed the run', 'Partially completed', 'Did not participate'];
const SATISFACTION_OPTIONS = ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'];
const PHYSICAL_CHALLENGES = ['Very easy', 'Easy', 'Moderate', 'Difficult', 'Very difficult'];
const POST_RUN_FEELINGS = ['Extremely energetic', 'Good', 'Normal', 'Tired', 'Very exhausted'];
const EXPECTATIONS_RESULTS = [
  'Exceeded expectations',
  'Met expectations',
  'Partially met expectations',
  'Did not meet expectations',
];
const PARTICIPATE_AGAIN = ['Definitely yes', 'Probably yes', 'Maybe', 'Probably no', 'Definitely no'];
const RECOMMEND_OPTIONS = ['Yes', 'Maybe', 'No'];

const ASPECTS_LIST: { key: keyof AfterMarathonFormData['ratings']; label: string; description: string }[] = [
  { key: 'registration', label: 'Registration', description: 'Check-in, kit pick-up & bib collection' },
  { key: 'route', label: 'Route', description: 'Scenic course design, road quality & safety' },
  { key: 'waterRefreshments', label: 'Water/refreshment stations', description: 'Hydration spacing, isotonic drinks & fruit' },
  { key: 'medicalSupport', label: 'Medical support', description: 'First aid availability, ambulance & support' },
  { key: 'volunteers', label: 'Volunteers', description: 'Cheering enthusiasm, marshaling & helpfulness' },
  { key: 'crowdManagement', label: 'Crowd management', description: 'Spectator barriers, corrals & clear lanes' },
  { key: 'atmosphere', label: 'Event atmosphere', description: 'Music, live DJs, announcer vibes & runner spirit' },
  { key: 'finishingArrangements', label: 'Finishing arrangements', description: 'Finisher medal, recovery zone & refreshments' },
];

export const AfterMarathonSurveyForm: React.FC<AfterMarathonSurveyFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  defaultRunnerName = '',
}) => {
  const initialData: AfterMarathonFormData = {
    runnerIdentifier: defaultRunnerName,
    participationStatus: '',
    overallExperience: 0,
    organizationSatisfaction: '',
    ratings: {
      registration: 0,
      route: 0,
      waterRefreshments: 0,
      medicalSupport: 0,
      volunteers: 0,
      crowdManagement: 0,
      atmosphere: 0,
      finishingArrangements: 0,
    },
    physicalChallenge: '',
    postRunFeeling: '',
    metExpectations: '',
    enjoyedMost: '',
    improvementSuggestions: '',
    wouldParticipateAgain: '',
    wouldRecommend: '',
    additionalFeedback: '',
  };

  const [formData, setFormData] = useState<AfterMarathonFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<AfterMarathonSurveyRecord | null>(null);

  // Validation function
  const validate = (data: AfterMarathonFormData): Record<string, string> => {
    const errs: Record<string, string> = {};

    // 1. Participation status
    if (!data.participationStatus) {
      errs.participationStatus = 'Please select how you participated today.';
    }

    // 2. Overall experience rating
    if (!data.overallExperience || data.overallExperience < 1 || data.overallExperience > 5) {
      errs.overallExperience = 'Please select an overall rating from 1 to 5 stars.';
    }

    // 3. Organization satisfaction
    if (!data.organizationSatisfaction) {
      errs.organizationSatisfaction = 'Please indicate your satisfaction with event organization.';
    }

    // 4. Rate 8 aspects
    ASPECTS_LIST.forEach((aspect) => {
      const score = data.ratings[aspect.key];
      if (!score || score < 1 || score > 5) {
        errs[`rating_${aspect.key}`] = `Please rate ${aspect.label} (1 to 5).`;
      }
    });

    // 5. Physical challenge
    if (!data.physicalChallenge) {
      errs.physicalChallenge = 'Please rate how physically challenging the marathon was.';
    }

    // 6. Post run feeling
    if (!data.postRunFeeling) {
      errs.postRunFeeling = 'Please choose how you feel after participating.';
    }

    // 7. Did the event meet expectations
    if (!data.metExpectations) {
      errs.metExpectations = 'Please select whether the event met your expectations.';
    }

    // 8. What did you enjoy the most
    if (!data.enjoyedMost.trim()) {
      errs.enjoyedMost = 'Please tell us what you enjoyed the most.';
    } else if (data.enjoyedMost.trim().length < 3) {
      errs.enjoyedMost = 'Please provide at least 3 characters.';
    }

    // 9. What could we improve
    if (!data.improvementSuggestions.trim()) {
      errs.improvementSuggestions = 'Please share what we could improve for the next marathon.';
    } else if (data.improvementSuggestions.trim().length < 3) {
      errs.improvementSuggestions = 'Please provide at least 3 characters.';
    }

    // 10. Participate again
    if (!data.wouldParticipateAgain) {
      errs.wouldParticipateAgain = 'Please indicate if you would participate in our next marathon.';
    }

    // 11. Would recommend
    if (!data.wouldRecommend) {
      errs.wouldRecommend = 'Please answer if you would recommend this event to friends/family.';
    }

    return errs;
  };

  const handleFieldChange = (field: keyof AfterMarathonFormData, value: any) => {
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

  const handleAspectRatingChange = (key: keyof AfterMarathonFormData['ratings'], score: number) => {
    const updated = {
      ...formData,
      ratings: {
        ...formData.ratings,
        [key]: score,
      },
    };
    setFormData(updated);

    const errorKey = `rating_${key}`;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };

  const fillSampleSurvey = () => {
    setFormData({
      runnerIdentifier: defaultRunnerName || 'Rohan Verma (BIB-2026)',
      participationStatus: 'Completed the run',
      overallExperience: 5,
      organizationSatisfaction: 'Very satisfied',
      ratings: {
        registration: 5,
        route: 5,
        waterRefreshments: 5,
        medicalSupport: 5,
        volunteers: 5,
        crowdManagement: 4,
        atmosphere: 5,
        finishingArrangements: 5,
      },
      physicalChallenge: 'Difficult',
      postRunFeeling: 'Good',
      metExpectations: 'Exceeded expectations',
      enjoyedMost: 'The patriotic cheer crowd along the riverfront bridge and volunteer energy at KM 18.',
      improvementSuggestions: 'Add extra waste bins after the hydration stands.',
      wouldParticipateAgain: 'Definitely yes',
      wouldRecommend: 'Yes',
      additionalFeedback: 'Brilliantly managed marathon by Vijaya Janta Party! Proud to run.',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Mark all as touched
    const allTouched: Record<string, boolean> = {
      participationStatus: true,
      overallExperience: true,
      organizationSatisfaction: true,
      physicalChallenge: true,
      postRunFeeling: true,
      metExpectations: true,
      enjoyedMost: true,
      improvementSuggestions: true,
      wouldParticipateAgain: true,
      wouldRecommend: true,
    };
    ASPECTS_LIST.forEach((a) => {
      allTouched[`rating_${a.key}`] = true;
    });
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
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setServerError(result.message || 'Error recording survey response.');
        if (result.errors) {
          setErrors(result.errors);
        }
      } else {
        setSubmittedRecord(result.data);
        onSuccess(result.data);
      }
    } catch (err: any) {
      setServerError('Network error connecting to the survey endpoint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate progress
  const answeredCount = [
    Boolean(formData.participationStatus),
    formData.overallExperience > 0,
    Boolean(formData.organizationSatisfaction),
    ...ASPECTS_LIST.map((a) => formData.ratings[a.key] > 0),
    Boolean(formData.physicalChallenge),
    Boolean(formData.postRunFeeling),
    Boolean(formData.metExpectations),
    Boolean(formData.enjoyedMost.trim().length >= 3),
    Boolean(formData.improvementSuggestions.trim().length >= 3),
    Boolean(formData.wouldParticipateAgain),
    Boolean(formData.wouldRecommend),
  ].filter(Boolean).length;

  const totalRequiredFields = 18;
  const progressPercent = Math.round((answeredCount / totalRequiredFields) * 100);

  if (submittedRecord) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-stone-900/95 backdrop-blur-md rounded-3xl border-2 border-amber-500/60 shadow-2xl overflow-hidden text-center text-white">
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-stone-950 p-8 sm:p-10 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-950 text-amber-400 rounded-2xl mb-3 font-bold shadow-lg">
              <Trophy className="w-9 h-9" />
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-stone-950/80">
              Vijaya Janta Party Marathon 2026
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
              Survey Submitted!
            </h2>
            <p className="text-white font-medium text-xs sm:text-sm mt-2 max-w-md mx-auto">
              Thank you for participating and sharing your valuable feedback with the Vijaya Janta Party organizing committee.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-left">
            <div className="bg-stone-950/70 rounded-2xl p-6 border border-stone-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-stone-400 block">Feedback Reference</span>
                  <span className="font-mono text-lg font-black text-amber-400">{submittedRecord.id}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-black text-amber-300">
                    {submittedRecord.overallExperience} / 5 Stars Given
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-stone-400 block">Participation</span>
                  <span className="font-bold text-white">{submittedRecord.participationStatus}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Organization</span>
                  <span className="font-bold text-white">{submittedRecord.organizationSatisfaction}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Future Participation</span>
                  <span className="font-bold text-white">{submittedRecord.wouldParticipateAgain}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
                <span>Directly persisted in backend</span>
                <span className="font-mono text-emerald-400 font-semibold">Status: 201 Created</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2">
              <button
                onClick={() => {
                  setSubmittedRecord(null);
                  setFormData(initialData);
                  setErrors({});
                  setTouched({});
                }}
                className="w-full sm:w-auto px-6 py-3 border border-stone-700 bg-stone-800 hover:bg-stone-700 rounded-xl text-xs sm:text-sm font-bold text-stone-200 transition-colors cursor-pointer"
              >
                Submit Another Response
              </button>
              <button
                onClick={onSwitchToRegister}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg cursor-pointer"
              >
                Return to Marathon Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="bg-stone-900/95 backdrop-blur-xl rounded-3xl border border-stone-800/90 shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-stone-800/80 bg-stone-950/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">🏅</span>
                <span className="text-[11px] uppercase font-black tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-0.5 rounded-full">
                  Vijaya Janta Party Marathon 2026 · Post-Event Review
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Official After Marathon Survey
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-1">
                Your direct evaluation helps the Vijaya Janta Party organizing committee enhance future race courses, refreshments, medical support, and volunteer services.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fillSampleSurvey}
                className="text-xs font-semibold text-stone-200 hover:text-white bg-stone-800/90 hover:bg-stone-700 border border-stone-700/80 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                
                Fill Sample
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 pt-4 border-t border-stone-800">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-300 mb-2">
              <span>Required Survey Responses</span>
              <span className="font-mono tabular-nums text-amber-400">
                {answeredCount} of {totalRequiredFields} ({progressPercent}%)
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
              <p className="font-bold">Survey Submission Failed</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-9">
          {/* Optional Participant Identifier */}
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-2xl">
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              Runner Name or Bib Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Rohan Verma or BIB-2026 (leave empty for Anonymous)"
              value={formData.runnerIdentifier}
              onChange={(e) => handleFieldChange('runnerIdentifier', e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-900 border border-stone-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            />
          </div>

          {/* QUESTION 1: How did you participate today? */}
          <div id="field-participationStatus" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">1.</span>
                <span>How did you participate today?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.participationStatus && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.participationStatus}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PARTICIPATION_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleFieldChange('participationStatus', opt)}
                  className={`p-3.5 text-xs sm:text-sm font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.participationStatus === opt
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 2: Overall rating ⭐ 1–5 */}
          <div id="field-overallExperience" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">2.</span>
                <span>How would you rate your overall marathon experience?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.overallExperience && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.overallExperience}
                </span>
              )}
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleFieldChange('overallExperience', star)}
                    className="p-1 hover:scale-115 transition-transform cursor-pointer"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`w-9 h-9 transition-colors ${
                        star <= formData.overallExperience
                          ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'fill-stone-800 text-stone-700 hover:fill-amber-400/30 hover:text-amber-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="text-center sm:text-right">
                <span className="font-display font-black text-2xl text-amber-400 tabular-nums">
                  {formData.overallExperience ? `${formData.overallExperience} / 5 Stars` : 'Click to Rate'}
                </span>
                <div className="text-xs text-stone-400">
                  {formData.overallExperience === 5 && 'Outstanding & memorable!'}
                  {formData.overallExperience === 4 && 'Very positive experience'}
                  {formData.overallExperience === 3 && 'Average / acceptable'}
                  {formData.overallExperience === 2 && 'Needs improvement'}
                  {formData.overallExperience === 1 && 'Unsatisfactory'}
                  {!formData.overallExperience && 'Select from 1 to 5'}
                </div>
              </div>
            </div>
          </div>

          {/* QUESTION 3: Organization satisfaction */}
          <div id="field-organizationSatisfaction" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">3.</span>
                <span>How satisfied were you with the event organization?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.organizationSatisfaction && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.organizationSatisfaction}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {SATISFACTION_OPTIONS.map((sat) => (
                <button
                  type="button"
                  key={sat}
                  onClick={() => handleFieldChange('organizationSatisfaction', sat)}
                  className={`p-3 text-xs sm:text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.organizationSatisfaction === sat
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {sat}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 4: Rate 8 aspects (1–5) */}
          <div id="field-aspects" className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-xs">4.</span>
                  <span>How would you rate the following?</span>
                  <span className="text-orange-400 font-bold">*</span>
                </label>
                <span className="text-xs text-amber-400 font-mono">Scale: 1 (Poor) to 5 (Excellent)</span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Please score all 8 key organizational categories below.
              </p>
            </div>

            <div className="space-y-3">
              {ASPECTS_LIST.map((aspect) => {
                const currentRating = formData.ratings[aspect.key];
                const error = errors[`rating_${aspect.key}`];

                return (
                  <div
                    key={aspect.key}
                    id={`field-rating_${aspect.key}`}
                    className={`p-4 rounded-2xl border transition-colors ${
                      error ? 'border-rose-500/60 bg-rose-950/20' : 'border-stone-800 bg-stone-950/60 hover:bg-stone-950/90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-white">{aspect.label}</div>
                        <div className="text-xs text-stone-400">{aspect.description}</div>
                        {error && (
                          <div className="text-xs font-semibold text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {error}
                          </div>
                        )}
                      </div>

                      {/* 1-5 Radio Selector */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            type="button"
                            key={score}
                            onClick={() => handleAspectRatingChange(aspect.key, score)}
                            className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                              currentRating === score
                                ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-stone-950 font-black shadow-lg ring-2 ring-amber-300'
                                : currentRating > score
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-stone-900 border border-stone-700/80 text-stone-300 hover:border-amber-400 hover:text-white'
                            }`}
                            aria-label={`Rate ${aspect.label} ${score} out of 5`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUESTION 5: Physical challenge */}
          <div id="field-physicalChallenge" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">5.</span>
                <span>How physically challenging was the marathon?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.physicalChallenge && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.physicalChallenge}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {PHYSICAL_CHALLENGES.map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => handleFieldChange('physicalChallenge', lvl)}
                  className={`p-3 text-xs sm:text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.physicalChallenge === lvl
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 6: Post run feeling */}
          <div id="field-postRunFeeling" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">6.</span>
                <span>How do you feel after completing/participating in the marathon?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.postRunFeeling && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.postRunFeeling}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {POST_RUN_FEELINGS.map((feel) => (
                <button
                  type="button"
                  key={feel}
                  onClick={() => handleFieldChange('postRunFeeling', feel)}
                  className={`p-3 text-xs sm:text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.postRunFeeling === feel
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {feel}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 7: Met expectations */}
          <div id="field-metExpectations" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">7.</span>
                <span>Did the event meet your expectations?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.metExpectations && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.metExpectations}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {EXPECTATIONS_RESULTS.map((res) => (
                <button
                  type="button"
                  key={res}
                  onClick={() => handleFieldChange('metExpectations', res)}
                  className={`p-3 text-xs sm:text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.metExpectations === res
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 8: Enjoyed most */}
          <div id="field-enjoyedMost" className="space-y-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="input-enjoyedMost" className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">8.</span>
                <span>What did you enjoy the most?</span>
                <span className="text-orange-400 font-bold">*</span>
                <span className="text-xs font-normal text-stone-400">(Short answer)</span>
              </label>
              {errors.enjoyedMost && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.enjoyedMost}
                </span>
              )}
            </div>
            <textarea
              id="input-enjoyedMost"
              rows={2}
              placeholder="e.g. The live cheering tunnels, river bridge crossing views, cold sponges at kilometer 18."
              value={formData.enjoyedMost}
              onChange={(e) => handleFieldChange('enjoyedMost', e.target.value)}
              className={`w-full px-4 py-3 bg-stone-950/80 border rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner ${
                errors.enjoyedMost ? 'border-rose-500 bg-rose-950/20' : 'border-stone-700/80'
              }`}
            />
          </div>

          {/* QUESTION 9: Improvement suggestions */}
          <div id="field-improvementSuggestions" className="space-y-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="input-improvement" className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">9.</span>
                <span>What could we improve for the next marathon?</span>
                <span className="text-orange-400 font-bold">*</span>
                <span className="text-xs font-normal text-stone-400">(Short answer)</span>
              </label>
              {errors.improvementSuggestions && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.improvementSuggestions}
                </span>
              )}
            </div>
            <textarea
              id="input-improvement"
              rows={2}
              placeholder="e.g. Expand gear-check tent exits, provide isotonic gels at early stations, clearer distance marker flags."
              value={formData.improvementSuggestions}
              onChange={(e) => handleFieldChange('improvementSuggestions', e.target.value)}
              className={`w-full px-4 py-3 bg-stone-950/80 border rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner ${
                errors.improvementSuggestions ? 'border-rose-500 bg-rose-950/20' : 'border-stone-700/80'
              }`}
            />
          </div>

          {/* QUESTION 10: Participate again */}
          <div id="field-wouldParticipateAgain" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">10.</span>
                <span>Would you participate in our next marathon?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.wouldParticipateAgain && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.wouldParticipateAgain}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {PARTICIPATE_AGAIN.map((ans) => (
                <button
                  type="button"
                  key={ans}
                  onClick={() => handleFieldChange('wouldParticipateAgain', ans)}
                  className={`p-3 text-xs sm:text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.wouldParticipateAgain === ans
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 11: Would recommend */}
          <div id="field-wouldRecommend" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">11.</span>
                <span>Would you recommend this event to your friends/family?</span>
                <span className="text-orange-400 font-bold">*</span>
              </label>
              {errors.wouldRecommend && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.wouldRecommend}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {RECOMMEND_OPTIONS.map((rec) => (
                <button
                  type="button"
                  key={rec}
                  onClick={() => handleFieldChange('wouldRecommend', rec)}
                  className={`p-3 text-sm font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    formData.wouldRecommend === rec
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION 12: Additional feedback */}
          <div id="field-additionalFeedback" className="space-y-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="input-additionalFeedback" className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs">12.</span>
                <span>Any additional feedback?</span>
                <span className="text-xs font-normal text-stone-400">(Short answer, Optional)</span>
              </label>
            </div>
            <textarea
              id="input-additionalFeedback"
              rows={2}
              placeholder="Any other thoughts, shout-outs to medical or volunteer teams, or general impressions..."
              value={formData.additionalFeedback}
              onChange={(e) => handleFieldChange('additionalFeedback', e.target.value)}
              className="w-full px-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-400">
              Survey data submits directly to <code className="bg-stone-950 px-2 py-1 rounded font-mono text-amber-300 border border-stone-800">/api/survey</code>.
            </div>

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
                  <span>Submitting Survey...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Post-Marathon Survey</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
