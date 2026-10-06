import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

// In-memory persistent arrays with initial realistic seed data for immediate demonstration
const registrations: PreMarathonRegistration[] = [
  {
    id: 'REG-1042',
    name: 'Elena Rostova',
    ageGroup: '26–35',
    gender: 'Female',
    isFirstMarathon: 'No',
    distance: 'Half Marathon',
    exerciseFrequency: '3–5 times a week',
    mainMotivation: 'Personal challenge',
    fitnessLevel: 'Good',
    confidenceLevel: 'Confident',
    expectations: 'Looking to hit a sub-1:50 personal record and enjoy the scenic riverfront route.',
    bibNumber: 'BIB-1042',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'REG-1089',
    name: 'Marcus Chen',
    ageGroup: '18–25',
    gender: 'Male',
    isFirstMarathon: 'Yes',
    distance: '10 KM',
    exerciseFrequency: '1–2 times a week',
    mainMotivation: 'Fitness & health',
    fitnessLevel: 'Average',
    confidenceLevel: 'Very confident',
    expectations: 'First official timed run! Hoping for great crowd energy and to finish safely.',
    bibNumber: 'BIB-1089',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'REG-1104',
    name: 'Priya Sharma',
    ageGroup: '36–45',
    gender: 'Female',
    isFirstMarathon: 'No',
    distance: '5 KM',
    exerciseFrequency: '3–5 times a week',
    mainMotivation: 'Social/community participation',
    fitnessLevel: 'Good',
    confidenceLevel: 'Very confident',
    expectations: 'Running alongside community coworkers to support our charity foundation.',
    bibNumber: 'BIB-1104',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

const surveys: AfterMarathonSurvey[] = [
  {
    id: 'SUR-501',
    runnerIdentifier: 'Elena Rostova (BIB-1042)',
    participationStatus: 'Completed the run',
    overallExperience: 5,
    organizationSatisfaction: 'Very satisfied',
    ratings: {
      registration: 5,
      route: 5,
      waterRefreshments: 5,
      medicalSupport: 4,
      volunteers: 5,
      crowdManagement: 4,
      atmosphere: 5,
      finishingArrangements: 5,
    },
    physicalChallenge: 'Difficult',
    postRunFeeling: 'Good',
    metExpectations: 'Exceeded expectations',
    enjoyedMost: 'The cheering cheer zones at KM 16 and the cold electrolytes at the finish line.',
    improvementSuggestions: 'Add one more water station right after the bridge incline.',
    wouldParticipateAgain: 'Definitely yes',
    wouldRecommend: 'Yes',
    additionalFeedback: 'Kudos to the volunteer staff, they made us feel like champions.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'SUR-502',
    runnerIdentifier: 'Participant #409',
    participationStatus: 'Completed the run',
    overallExperience: 4,
    organizationSatisfaction: 'Satisfied',
    ratings: {
      registration: 4,
      route: 4,
      waterRefreshments: 4,
      medicalSupport: 5,
      volunteers: 5,
      crowdManagement: 3,
      atmosphere: 5,
      finishingArrangements: 4,
    },
    physicalChallenge: 'Moderate',
    postRunFeeling: 'Tired',
    metExpectations: 'Met expectations',
    enjoyedMost: 'The medal ceremony and live percussion band at the central park loop.',
    improvementSuggestions: 'Post-race bag drop retrieval line was a bit slow around 10:30 AM.',
    wouldParticipateAgain: 'Probably yes',
    wouldRecommend: 'Yes',
    additionalFeedback: 'Overall great day. Will train harder next year!',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

// Helper validation functions
const validAgeGroups = ['Under 18', '18–25', '26–35', '36–45', '46–55', '56+'];
const validGenders = ['Male', 'Female', 'Prefer not to say'];
const validDistances = ['3 KM', '5 KM', '10 KM', 'Half Marathon', 'Other'];
const validFrequencies = ['Daily', '3–5 times a week', '1–2 times a week', 'Occasionally', 'Rarely'];
const validMotivations = [
  'Fitness & health',
  'Personal challenge',
  'Social/community participation',
  'Supporting a cause',
  'Fun & experience',
  'Other',
];
const validFitnessLevels = ['Excellent', 'Good', 'Average', 'Below average'];
const validConfidence = ['Very confident', 'Confident', 'Neutral', 'Slightly concerned', 'Not confident'];

const validParticipation = ['Completed the run', 'Partially completed', 'Did not participate'];
const validSatisfaction = ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'];
const validChallenges = ['Very easy', 'Easy', 'Moderate', 'Difficult', 'Very difficult'];
const validFeelings = ['Extremely energetic', 'Good', 'Normal', 'Tired', 'Very exhausted'];
const validExpectationsResult = ['Exceeded expectations', 'Met expectations', 'Partially met expectations', 'Did not meet expectations'];
const validParticipateAgain = ['Definitely yes', 'Probably yes', 'Maybe', 'Probably no', 'Definitely no'];
const validRecommend = ['Yes', 'Maybe', 'No'];

// API 1: Registration Endpoint
app.post('/api/register', (req: Request, res: Response): any => {
  try {
    const {
      name,
      ageGroup,
      gender,
      isFirstMarathon,
      distance,
      otherDistance,
      exerciseFrequency,
      mainMotivation,
      otherMotivation,
      fitnessLevel,
      confidenceLevel,
      expectations,
    } = req.body;

    const errors: Record<string, string> = {};

    // 1. Name is optional, but if present, clean up
    const cleanName = (name || '').trim();

    // 2. Age group validation
    if (!ageGroup || !validAgeGroups.includes(ageGroup)) {
      errors.ageGroup = 'Please select a valid age group.';
    }

    // 3. Gender validation
    if (!gender || !validGenders.includes(gender)) {
      errors.gender = 'Please select your gender.';
    }

    // 4. First marathon
    if (!isFirstMarathon || !['Yes', 'No'].includes(isFirstMarathon)) {
      errors.isFirstMarathon = 'Please indicate whether this is your first marathon.';
    }

    // 5. Distance
    if (!distance || !validDistances.includes(distance)) {
      errors.distance = 'Please choose your running distance.';
    } else if (distance === 'Other' && (!otherDistance || !otherDistance.trim())) {
      errors.otherDistance = 'Please specify your participating distance.';
    }

    // 6. Exercise frequency
    if (!exerciseFrequency || !validFrequencies.includes(exerciseFrequency)) {
      errors.exerciseFrequency = 'Please indicate your exercise or running frequency.';
    }

    // 7. Main motivation
    if (!mainMotivation || !validMotivations.includes(mainMotivation)) {
      errors.mainMotivation = 'Please select your main motivation.';
    } else if (mainMotivation === 'Other' && (!otherMotivation || !otherMotivation.trim())) {
      errors.otherMotivation = 'Please specify your motivation.';
    }

    // 8. Fitness level
    if (!fitnessLevel || !validFitnessLevels.includes(fitnessLevel)) {
      errors.fitnessLevel = 'Please rate your current fitness level.';
    }

    // 9. Confidence level
    if (!confidenceLevel || !validConfidence.includes(confidenceLevel)) {
      errors.confidenceLevel = 'Please indicate your confidence level.';
    }

    // 10. Expectations
    if (!expectations || !expectations.trim()) {
      errors.expectations = 'Please share what you are expecting from today\'s event.';
    } else if (expectations.trim().length < 3) {
      errors.expectations = 'Expectations answer must be at least 3 characters.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for registration survey fields.',
        errors,
      });
    }

    const regId = `REG-${Math.floor(1000 + Math.random() * 9000)}`;
    const bibNum = `BIB-${Math.floor(2000 + Math.random() * 8000)}`;

    const newRecord: PreMarathonRegistration = {
      id: regId,
      name: cleanName || 'Anonymous Runner',
      ageGroup,
      gender,
      isFirstMarathon,
      distance: distance === 'Other' ? `Other (${otherDistance.trim()})` : distance,
      exerciseFrequency,
      mainMotivation: mainMotivation === 'Other' ? `Other (${otherMotivation.trim()})` : mainMotivation,
      fitnessLevel,
      confidenceLevel,
      expectations: expectations.trim(),
      bibNumber: bibNum,
      createdAt: new Date().toISOString(),
    };

    registrations.unshift(newRecord);

    return res.status(201).json({
      success: true,
      message: 'Registration and pre-event survey submitted successfully!',
      data: newRecord,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error processing registration.',
      error: err.message,
    });
  }
});

// API 2: After Marathon Survey Endpoint
app.post('/api/survey', (req: Request, res: Response): any => {
  try {
    const {
      runnerIdentifier,
      participationStatus,
      overallExperience,
      organizationSatisfaction,
      ratings,
      physicalChallenge,
      postRunFeeling,
      metExpectations,
      enjoyedMost,
      improvementSuggestions,
      wouldParticipateAgain,
      wouldRecommend,
      additionalFeedback,
    } = req.body;

    const errors: Record<string, string> = {};

    // 1. Participation status
    if (!participationStatus || !validParticipation.includes(participationStatus)) {
      errors.participationStatus = 'Please select how you participated today.';
    }

    // 2. Overall marathon experience (1-5)
    const expNum = Number(overallExperience);
    if (!expNum || expNum < 1 || expNum > 5) {
      errors.overallExperience = 'Please provide an overall rating from 1 to 5 stars.';
    }

    // 3. Organization satisfaction
    if (!organizationSatisfaction || !validSatisfaction.includes(organizationSatisfaction)) {
      errors.organizationSatisfaction = 'Please select your organization satisfaction level.';
    }

    // 4. Rate the 8 aspects (1-5 each)
    const aspectKeys: (keyof AfterMarathonSurvey['ratings'])[] = [
      'registration',
      'route',
      'waterRefreshments',
      'medicalSupport',
      'volunteers',
      'crowdManagement',
      'atmosphere',
      'finishingArrangements',
    ];

    if (!ratings || typeof ratings !== 'object') {
      errors.ratings = 'Please rate all 8 event organization categories.';
    } else {
      for (const aspect of aspectKeys) {
        const val = Number(ratings[aspect]);
        if (!val || val < 1 || val > 5) {
          errors[`ratings.${aspect}`] = `Please rate ${aspect} between 1 and 5.`;
        }
      }
    }

    // 5. Physical challenge
    if (!physicalChallenge || !validChallenges.includes(physicalChallenge)) {
      errors.physicalChallenge = 'Please rate how physically challenging the marathon was.';
    }

    // 6. Post run feeling
    if (!postRunFeeling || !validFeelings.includes(postRunFeeling)) {
      errors.postRunFeeling = 'Please indicate how you feel after participating.';
    }

    // 7. Met expectations
    if (!metExpectations || !validExpectationsResult.includes(metExpectations)) {
      errors.metExpectations = 'Please select whether the event met your expectations.';
    }

    // 8. Enjoyed most
    if (!enjoyedMost || !enjoyedMost.trim()) {
      errors.enjoyedMost = 'Please specify what you enjoyed the most.';
    }

    // 9. Improvement suggestions
    if (!improvementSuggestions || !improvementSuggestions.trim()) {
      errors.improvementSuggestions = 'Please share what we could improve for the next marathon.';
    }

    // 10. Participate again
    if (!wouldParticipateAgain || !validParticipateAgain.includes(wouldParticipateAgain)) {
      errors.wouldParticipateAgain = 'Please answer if you would participate in our next marathon.';
    }

    // 11. Would recommend
    if (!wouldRecommend || !validRecommend.includes(wouldRecommend)) {
      errors.wouldRecommend = 'Please answer if you would recommend this event.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for after-marathon survey fields.',
        errors,
      });
    }

    const surveyId = `SUR-${Math.floor(5000 + Math.random() * 5000)}`;
    const newSurvey: AfterMarathonSurvey = {
      id: surveyId,
      runnerIdentifier: runnerIdentifier?.trim() || 'Anonymous Finisher',
      participationStatus,
      overallExperience: expNum,
      organizationSatisfaction,
      ratings: {
        registration: Number(ratings.registration),
        route: Number(ratings.route),
        waterRefreshments: Number(ratings.waterRefreshments),
        medicalSupport: Number(ratings.medicalSupport),
        volunteers: Number(ratings.volunteers),
        crowdManagement: Number(ratings.crowdManagement),
        atmosphere: Number(ratings.atmosphere),
        finishingArrangements: Number(ratings.finishingArrangements),
      },
      physicalChallenge,
      postRunFeeling,
      metExpectations,
      enjoyedMost: enjoyedMost.trim(),
      improvementSuggestions: improvementSuggestions.trim(),
      wouldParticipateAgain,
      wouldRecommend,
      additionalFeedback: (additionalFeedback || '').trim(),
      createdAt: new Date().toISOString(),
    };

    surveys.unshift(newSurvey);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your after-marathon survey has been recorded.',
      data: newSurvey,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error processing survey.',
      error: err.message,
    });
  }
});

// API 3: Statistics & Aggregations
app.get('/api/stats', (_req: Request, res: Response) => {
  const totalRegistrations = registrations.length;
  const totalSurveys = surveys.length;

  const avgOverallExperience = totalSurveys > 0
    ? (surveys.reduce((sum, s) => sum + s.overallExperience, 0) / totalSurveys).toFixed(1)
    : '5.0';

  // Distance breakdown
  const distanceCounts: Record<string, number> = {};
  registrations.forEach(r => {
    const key = r.distance.startsWith('Other') ? 'Other' : r.distance;
    distanceCounts[key] = (distanceCounts[key] || 0) + 1;
  });

  // Aspect average scores
  const aspectAverages: Record<string, number> = {
    registration: 0,
    route: 0,
    waterRefreshments: 0,
    medicalSupport: 0,
    volunteers: 0,
    crowdManagement: 0,
    atmosphere: 0,
    finishingArrangements: 0,
  };

  if (totalSurveys > 0) {
    for (const key of Object.keys(aspectAverages)) {
      const sum = surveys.reduce((acc, s) => acc + ((s.ratings as any)[key] || 0), 0);
      aspectAverages[key] = parseFloat((sum / totalSurveys).toFixed(2));
    }
  }

  // Recommendation %
  const recommendCount = surveys.filter(s => s.wouldRecommend === 'Yes').length;
  const recommendRate = totalSurveys > 0 ? Math.round((recommendCount / totalSurveys) * 100) : 100;

  res.json({
    totalRegistrations,
    totalSurveys,
    avgOverallExperience: Number(avgOverallExperience),
    recommendRate,
    distanceCounts,
    aspectAverages,
  });
});

// API 4: Submissions Listing
app.get('/api/submissions', (_req: Request, res: Response) => {
  res.json({
    registrations,
    surveys,
  });
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
