import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CelebrationPostModal } from '../components/CelebrationPostModal';
import { AthleticGraphicsBackground } from '../components/AthleticGraphicsBackground';
import { PreMarathonRegistrationRecord } from '../types';

export const VerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract verified runner query details from React Router's searchParams
  const verifiedRecord = useMemo<PreMarathonRegistrationRecord | null>(() => {
    const bib = searchParams.get('bib');
    if (!bib) return null;

    return {
      id: searchParams.get('id') || `REG-2026-${bib.replace(/\D/g, '')}`,
      bibNumber: bib,
      name: searchParams.get('name') || 'Registered Participant',
      email: searchParams.get('email') || '',
      distance: searchParams.get('distance') || '10 KM',
      ageGroup: searchParams.get('ageGroup') || '26–35',
      gender: searchParams.get('gender') || 'Male',
      isFirstMarathon: 'No',
      otherDistance: '',
      exerciseFrequency: '',
      mainMotivation: '',
      otherMotivation: '',
      fitnessLevel: 'Good',
      confidenceLevel: 'Confident',
      expectations: '',
      createdAt: new Date().toISOString(),
    };
  }, [searchParams]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-stone-100 flex flex-col font-sans relative selection:bg-amber-500 selection:text-stone-950">
      <AthleticGraphicsBackground />

      {verifiedRecord ? (
        <CelebrationPostModal
          type="registration"
          registrationRecord={verifiedRecord}
          onClose={handleGoHome}
          onSwitchToSurvey={handleGoHome}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center p-4 z-10">
          <div className="bg-stone-900/90 border border-stone-800 p-8 rounded-2xl text-center max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-rose-400 mb-2">Invalid Verification Link</h2>
            <p className="text-xs text-stone-400 mb-6">
              No registered Bib Number was found in the provided URL parameters.
            </p>
            <button
              onClick={handleGoHome}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black rounded-xl transition-all cursor-pointer shadow-md"
            >
              Go to Marathon Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};