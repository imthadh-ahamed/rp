// Types for AL Stream Predictor components

// Basket configuration types
export interface Basket {
    name: string;
    description: string;
    subjects: string[];
}

export interface BasketConfig {
    basket1: Basket;
    basket2: Basket;
    basket3: Basket;
    basket4: Basket;
}

// Form data type (subject marks)
export interface FormData {
    [subject: string]: number;
}

// Selected subjects for optional baskets
export interface SelectedSubjects {
    basket2: string | null;
    basket3: string | null;
    basket4: string | null;
}

// Recommendation from prediction
export interface Recommendation {
    stream: string;
    confidence: number;
}

// Student summary from prediction
export interface StudentSummary {
    mathematics: number;
    science: number;
    english: number;
    first_language: number;
    math_science_avg: number;
    language_avg: number;
    stem_aptitude: number;
    humanities_aptitude: number;
}

// Prediction result
export interface PredictionResult {
    success: boolean;
    student_summary: StudentSummary;
    top_recommendations: Recommendation[];
    all_predictions: Recommendation[];
    interpretation: string;
    error?: string;
}

// Component props types
export interface ALStreamPredictorProps {
    onTakeQuiz?: (stream: string) => void;
    setPredictorResults?: (results: PredictionResult) => void;
}

export interface BasketSelectorProps {
    basket: Basket;
    basketKey: string;
    selectedSubject: string | null;
    onSelectSubject: (basket: string, subject: string) => void;
    formData: FormData;
    onMarkChange: (subject: string, value: string) => void;
    color: 'green' | 'purple' | 'orange';
}

export interface PredictorResultsProps {
    results: PredictionResult;
    onTakeQuiz: (stream: string) => void;
    onReset: () => void;
}

export interface StatCardProps {
    label: string;
    value: number | string;
    highlight?: boolean;
}

export interface LoadingSpinnerProps {
    message?: string;
}

export interface ErrorAlertProps {
    message: string;
}
