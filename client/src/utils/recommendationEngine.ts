import { ugcCourses, UGCCourse } from './ugcCourseData';

export interface ALResultsData {
    stream: string;
    subjects: Array<{ name: string; grade: string }>;
    zScore?: number;
    islandRank?: number;
    districtRank?: number;
}

export interface CareerQuizAnswer {
    questionId: string;
    answer: number;
}

// Sri Lankan A/L Streams (6 streams as per UGC)
export const AL_STREAMS = [
    'Physical Science',
    'Biological Science',
    'Commerce',
    'Arts',
    'Engineering Technology',
    'Bio Technology'
] as const;

export type ALStream = typeof AL_STREAMS[number];

export interface RecommendedCourse {
    courseName: string;
    university: string;
    uniCode: string;
    academicScore: number;
    interestScore: number;
    overallScore: number;
    category: 'highly-recommended' | 'moderately-recommended' | 'conditionally-eligible';
    requiresAptitudeTest: boolean;
    matchingInterests: string[];
}

const gradePoints: Record<string, number> = { 'A': 5, 'B': 4, 'C': 3, 'S': 2, 'F': 0 };

const interestLabels: Record<string, string> = {
    q1_science_tech: 'Science & Technology',
    q2_healthcare: 'Healthcare',
    q3_design: 'Design & Creativity',
    q4_data: 'Data & Analytics',
    q5_business: 'Business & Management',
    q6_arts_culture: 'Arts & Culture',
    q7_nature_env: 'Nature & Environment',
    q8_hands_on: 'Hands-on Work',
    q9_innovation: 'Innovation',
    q10_people_social: 'People & Social',
    q11_urban_corporate: 'Urban & Corporate',
    q12_flexible_path: 'Flexible Career'
};

export function calculateRecommendations(
    alResults: ALResultsData,
    quizAnswers: CareerQuizAnswer[]
): RecommendedCourse[] {
    // Calculate academic score (average grade points)
    const academicScore = alResults.subjects.reduce((sum, s) =>
        sum + (gradePoints[s.grade] || 0), 0) / alResults.subjects.length;

    // Build interest scores map from quiz answers
    const interestScores: Record<string, number> = {};
    quizAnswers.forEach(a => { interestScores[a.questionId] = a.answer; });

    // Filter courses by stream eligibility
    const eligibleCourses = ugcCourses.filter(course =>
        course.eligibleStreams.some(s =>
            s.toLowerCase() === alResults.stream.toLowerCase()
        )
    );

    // Score and rank courses
    const recommendations: RecommendedCourse[] = eligibleCourses.map(course => {
        // Calculate interest score based on matching interests
        const matchingInterests = course.interestMapping.filter(i =>
            (interestScores[i] || 0) >= 3
        );

        const interestScore = course.interestMapping.reduce((sum, interest) =>
            sum + ((interestScores[interest] || 3) / 5), 0) / Math.max(course.interestMapping.length, 1);

        // Calculate overall score (60% academic, 40% interest)
        const overallScore = (academicScore / 5) * 0.6 + interestScore * 0.4;

        // Determine category
        let category: RecommendedCourse['category'] = 'conditionally-eligible';
        if (overallScore >= 0.75 && academicScore >= 3.5) {
            category = 'highly-recommended';
        } else if (overallScore >= 0.55 && academicScore >= 2.5) {
            category = 'moderately-recommended';
        }

        return {
            courseName: course.courseName,
            university: course.university,
            uniCode: course.uniCode,
            academicScore: Math.round(academicScore * 100) / 100,
            interestScore: Math.round(interestScore * 100) / 100,
            overallScore: Math.round(overallScore * 100) / 100,
            category,
            requiresAptitudeTest: course.requiresAptitudeTest,
            matchingInterests: matchingInterests.map(i => interestLabels[i] || i)
        };
    });

    // Sort by overall score descending
    return recommendations.sort((a, b) => b.overallScore - a.overallScore);
}

export function getTopRecommendations(
    alResults: ALResultsData,
    quizAnswers: CareerQuizAnswer[],
    limit: number = 20
): RecommendedCourse[] {
    return calculateRecommendations(alResults, quizAnswers).slice(0, limit);
}

export function getRecommendationsByCategory(
    alResults: ALResultsData,
    quizAnswers: CareerQuizAnswer[]
): {
    highlyRecommended: RecommendedCourse[];
    moderatelyRecommended: RecommendedCourse[];
    conditionallyEligible: RecommendedCourse[];
} {
    const all = calculateRecommendations(alResults, quizAnswers);
    return {
        highlyRecommended: all.filter(c => c.category === 'highly-recommended'),
        moderatelyRecommended: all.filter(c => c.category === 'moderately-recommended'),
        conditionallyEligible: all.filter(c => c.category === 'conditionally-eligible')
    };
}

export { ugcCourses };
