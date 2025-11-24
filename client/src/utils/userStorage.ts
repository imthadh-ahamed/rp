export interface UserData {
    age: string;
    gender: string;
    nativeLanguage: string;
    preferredLanguage: string;
    olResults: string;
    alStream?: string | null;
    alResults?: string | null;
    otherQualifications?: string;
    ieltsScore?: string;
    interestArea: string;
    careerGoal: string;
    monthlyIncome: string;
    fundingMethod: string;
    availability: string;
    completionPeriod: string;
    studyMethod: string;
    currentLocation: string;
    preferredLocations: string;
    qualificationType: 'AL' | 'OL';
}

const STORAGE_KEY = 'career_guide_user_data';

export const saveUserData = (data: UserData) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
};

export const getUserData = (): UserData | null => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }
    return null;
};

export const clearUserData = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
};
