export interface PreMarathonFormData {
  name: string;
  ageGroup: string;
  gender: string;
  isFirstMarathon: string;
  distance: string;
  otherDistance: string;
  exerciseFrequency: string;
  mainMotivation: string;
  otherMotivation: string;
  fitnessLevel: string;
  confidenceLevel: string;
  expectations: string;
}

export interface AspectRatings {
  registration: number;
  route: number;
  waterRefreshments: number;
  medicalSupport: number;
  volunteers: number;
  crowdManagement: number;
  atmosphere: number;
  finishingArrangements: number;
}

export interface AfterMarathonFormData {
  runnerIdentifier: string;
  participationStatus: string;
  overallExperience: number;
  organizationSatisfaction: string;
  ratings: AspectRatings;
  physicalChallenge: string;
  postRunFeeling: string;
  metExpectations: string;
  enjoyedMost: string;
  improvementSuggestions: string;
  wouldParticipateAgain: string;
  wouldRecommend: string;
  additionalFeedback: string;
}

export interface PreMarathonRegistrationRecord extends PreMarathonFormData {
  id: string;
  bibNumber: string;
  createdAt: string;
}

export interface AfterMarathonSurveyRecord {
  id: string;
  runnerIdentifier: string;
  participationStatus: string;
  overallExperience: number;
  organizationSatisfaction: string;
  ratings: AspectRatings;
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

export interface StatsResponse {
  totalRegistrations: number;
  totalSurveys: number;
  avgOverallExperience: number;
  recommendRate: number;
  distanceCounts: Record<string, number>;
  aspectAverages: AspectRatings;
}
