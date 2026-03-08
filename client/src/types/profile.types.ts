import { ApiResponse } from "./api.types";
import { CurrentUser } from "./currentUser";

/**
 * AL Profile Types
 */

export interface ALProfile {
    _id: string;
    userId: string | CurrentUser;
    qualificationType: 'AL';
    // Personal Details
    age: string;
    gender: 'Male' | 'Female' | 'Other';
    nativeLanguage: 'English' | 'Sinhala' | 'Tamil';
    preferredLanguage: 'English' | 'Sinhala' | 'Tamil';
    // Educational Details
    olResults: string;
    alStream?: 'Bio Science' | 'Physical Science' | 'Commerce' | 'Arts' | 'Engineering Technology' | 'Bio-systems Technology';
    alResults?: string;
    otherQualifications?: string;
    ieltsScore?: string;
    // Career & Preferences
    interestArea: 'Information Technology' | 'Business & Management' | 'Engineering/Technology' | 'Arts & Design' | 'Healthcare/Medicine' | 'Education/Teaching' | 'Agriculture/Environment';
    careerGoal: string;
    monthlyIncome: string;
    fundingMethod: 'Self-funded' | 'Need scholarship';
    availability: 'Weekday' | 'Weekend';
    // Logistics
    completionPeriod: '< 1 year' | '1–2 years' | '2-3 years' | '3-4 years' | '4+ years';
    studyMethod: 'Hybrid' | 'Online' | 'Onsite';
    currentLocation: string;
    preferredLocations: string;
    // Soft Delete
    isDeleted: boolean;
    // Timestamps
    createdAt: string;
    updatedAt: string;
    recommendations?: Recommendation[];
}

export interface Recommendation {
    id?: string;
    _id?: string;
    rank: number;
    course_name: string;
    university: string;
    location: string;
    match_score: number;
    explanation: string;
    url: string;
    career_opportunities: string;
    study_language: string;
    study_method: string;
    duration: string;
    requirements: string;
    course_fee: string;
    department: string;
    tags: string[];
    isSelected: boolean;
}

export interface CreateALProfileRequest {
    age: string;
    gender: 'Male' | 'Female' | 'Other';
    nativeLanguage: 'English' | 'Sinhala' | 'Tamil';
    preferredLanguage: 'English' | 'Sinhala' | 'Tamil';
    olResults: string;
    alStream?: 'Bio Science' | 'Physical Science' | 'Commerce' | 'Arts' | 'Engineering Technology' | 'Bio-systems Technology';
    alResults?: string;
    otherQualifications?: string;
    ieltsScore?: string;
    interestArea: 'Information Technology' | 'Business & Management' | 'Engineering/Technology' | 'Arts & Design' | 'Healthcare/Medicine' | 'Education/Teaching' | 'Agriculture/Environment';
    careerGoal: string;
    monthlyIncome: string;
    fundingMethod: 'Self-funded' | 'Need scholarship';
    availability: 'Weekday' | 'Weekend';
    completionPeriod: '< 1 year' | '1–2 years' | '2-3 years' | '3-4 years' | '4+ years';
    studyMethod: 'Hybrid' | 'Online' | 'Onsite';
    currentLocation: string;
    preferredLocations: string;
}

export interface UpdateALProfileRequest extends Partial<CreateALProfileRequest> { }

export interface ALProfileResponse extends ApiResponse<{ profile: ALProfile }> {
    success: boolean;
    message: string;
    data: {
        profile: ALProfile;
    };
}

export interface ALProfilesResponse extends ApiResponse<{ profiles: ALProfile[]; count: number }> {
    success: boolean;
    message: string;
    data: {
        profiles: ALProfile[];
        count: number;
    };
}
