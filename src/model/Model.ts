export interface PreMarathonRegistration {
  id: string;
  name: string;
  ageGroup: string;
  gender: string;
  isFirstMarathon: string;
  distance: string;
  otherDistance?: string;
  exerciseFrequency: string;
  mainMotivation: string;
  otherMotivation?: string;
  fitnessLevel: string;
  confidenceLevel: string;
  expectations: string;
  bibNumber?: string;
  createdAt: string;
}

export interface AfterMarathonSurvey {
  id: string;
  runnerIdentifier?: string;
  participationStatus: string;
  overallExperience: number; // 1-5
  organizationSatisfaction: string;
  ratings: {
    registration: number;
    route: number;
    waterRefreshments: number;
    medicalSupport: number;
    volunteers: number;
    crowdManagement: number;
    atmosphere: number;
    finishingArrangements: number;
  };
  physicalChallenge: string;
  postRunFeeling: string;
  metExpectations: string;
  enjoyedMost: string;
  improvementSuggestions: string;
  wouldParticipateAgain: string;
  wouldRecommend: string;
  additionalFeedback?: string;
  createdAt: string;
}
