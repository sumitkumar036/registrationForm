import { env } from 'process';
import { PreMarathonFormData, PreMarathonRegistrationRecord } from '../types';

// Replace with your Google Apps Script Web App URL ending in /exec
const apiUrl =  import.meta.env.VITE_API_URL|| 'https://script.google.com/macros/s/AKfycbzB4V_g254DOStW4xuaUpyCORB9LlaFTbvTIlK_imcgKwbbZkGsH7r7Lfn67TR9tHLC/exec';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  totalParticipants?: number;
  errors?: Record<string, string>;
}

/**
 * Submits marathon registration data to Google Apps Script.
 * Uses 'text/plain' and 'redirect: follow' to bypass CORS preflights and handle GAS 302 redirects.
 */
export async function submitRegistration(
  formData: PreMarathonFormData
): Promise<ApiResponse<PreMarathonRegistrationRecord>> {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      redirect: 'follow',
      body: JSON.stringify(formData),
    });

    const result: ApiResponse<PreMarathonRegistrationRecord> = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Network error connecting to the registration server.',
    };
  }
}

/**
 * Fetches current live participant count on page load using POST
 */
export async function fetchParticipantCount(): Promise<number> {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      redirect: 'follow',
      body: JSON.stringify({ action: 'count' }),
    });

    if (!response.ok) {
      console.error(`HTTP error while fetching count: ${response.status}`);
      return 0;
    }

    // Read the stream once here
    const result = await response.json();
    
    // Log the parsed JSON data, NOT the raw response object
    console.log('Participant count parsed response:', result);

    if (result && result.success && typeof result.totalParticipants === 'number') {
      return result.totalParticipants;
    }

    return 0;
  } catch (error) {
    console.error('Failed to parse participant count response:', error);
    return 0;
  }
}