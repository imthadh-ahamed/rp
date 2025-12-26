export interface ALResultsData {
    stream: string;
    subjects: Array<{
        name: string;
        grade: string;
    }>;
    zScore?: number;
    islandRank?: number;
    districtRank?: number;
}

export interface CareerQuizAnswer {
    questionId: number;
    answer: string | number;
}

export interface Course {
    id: string;
    name: string;
    university: string;
    stream: string;
    requiredSubjects: string[];
    minimumGrade: string;
    description: string;
    academicScore: number;
    interestScore: number;
    overallScore: number;
    category: 'highly-recommended' | 'moderately-recommended' | 'conditionally-eligible';
    hasAptitudeTest: boolean;
    aptitudeTests?: string[];
}

// Mock course database
const courseDatabase: Course[] = [
    {
        id: 'cs-001',
        name: 'Computer Science',
        university: 'University of Colombo',
        stream: 'Physical Science',
        requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
        minimumGrade: 'B',
        description: 'B.Sc. in Computer Science',
        academicScore: 0,
        interestScore: 0,
        overallScore: 0,
        category: 'highly-recommended',
        hasAptitudeTest: true,
        aptitudeTests: ['Logical Reasoning', 'Problem Solving', 'Data Structures']
    },
    {
        id: 'eng-001',
        name: 'Software Engineering',
        university: 'University of Moratuwa',
        stream: 'Physical Science',
        requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
        minimumGrade: 'A',
        description: 'B.Sc. in Software Engineering',
        academicScore: 0,
        interestScore: 0,
        overallScore: 0,
        category: 'highly-recommended',
        hasAptitudeTest: true,
        aptitudeTests: ['Coding Assessment', 'System Design']
    },
    {
        id: 'civil-001',
        name: 'Civil Engineering',
        university: 'University of Moratuwa',
        stream: 'Physical Science',
        requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
        minimumGrade: 'B',
        description: 'B.Sc. in Civil Engineering',
        academicScore: 0,
        interestScore: 0,
        overallScore: 0,
        category: 'highly-recommended',
        hasAptitudeTest: true,
        aptitudeTests: ['Engineering Fundamentals', 'Design Principles']
    },
    {
        id: 'mech-001',
        name: 'Mechanical Engineering',
        university: 'University of Peradeniya',
        stream: 'Physical Science',
        requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
        minimumGrade: 'B',
        description: 'B.Sc. in Mechanical Engineering',
        academicScore: 0,
        interestScore: 0,
        overallScore: 0,
        category: 'moderately-recommended',
        hasAptitudeTest: true,
        aptitudeTests: ['Mechanics', 'Thermodynamics']
    },
    {
        id: 'phys-001',
        name: 'Physics',
        university: 'University of Colombo',
        stream: 'Physical Science',
        requiredSubjects: ['Physics', 'Mathematics'],
        minimumGrade: 'A',
        description: 'B.Sc. in Physics',
        academicScore: 0,
        interestScore: 0,
        overallScore: 0,
        category: 'moderately-recommended',
        hasAptitudeTest: true,
        aptitudeTests: ['Physics Fundamentals', 'Mathematical Reasoning']
    },
    {
        id: 'chem-001',
        name: 'Chemistry',
        university: 'University of Colombo',
        stream: 'Physical Science',
        requiredSubjects: ['Chemistry', 'Physics'],
        minimumGrade: 'B',
        description: 'B.Sc. in Chemistry',
        academicScore: 0,
        interestScore: 0,
        overallScore: 0,
        category: 'moderately-recommended',
        hasAptitudeTest: false
    },
    {
        id: 'arch-001',
        name: 'Architecture',
        university: 'University of Moratuwa',
        stream: 'Physical Science',
        requiredSubjects: ['Physics', 'Mathematics'],
        minimumGrade: 'B',
        description: 'B.Sc. in Architecture',
        academicScore: 0,
        interestScore: 0,
        overallScore: 0,
        category: 'highly-recommended',
        hasAptitudeTest: true,
        aptitudeTests: ['Design Thinking', 'Spatial Reasoning']
    },
    {
        id: 'env-001',
        name: 'Environmental Science',
        university: 'University of Sri Jayewardenepura',
        stream: 'Biological Science',
        requiredSubjects: ['Biology', 'Chemistry'],
        minimumGrade: 'B',
        description: 'B.Sc. in Environmental Science',
        academicScore: 0,
        interestScore: 0,
        overallScore: 0,
        category: 'highly-recommended',
        hasAptitudeTest: false
    },
];

export function calculateRecommendations(
    alResults: ALResultsData,
    quizAnswers: CareerQuizAnswer[]
): Course[] {
    // Get grade point values for scoring
    const gradePoints: Record<string, number> = { 'A': 5, 'B': 4, 'C': 3, 'S': 2, 'F': 0 };

    // Calculate academic score
    const academicScore = alResults.subjects.reduce((sum: number, subject: { name: string; grade: string }) => {
        return sum + (gradePoints[subject.grade] || 0);
    }, 0) / alResults.subjects.length;

    // Analyze career interests
    const interestPatterns = analyzeCareerInterests(quizAnswers);

    // Filter and score courses
    const recommendedCourses = courseDatabase
        .filter(course => course.stream === alResults.stream)
        .map(course => {
            // Check academic eligibility
            const academicEligible = checkAcademicEligibility(course, alResults, academicScore);
            
            // Calculate interest score
            const interestScore = calculateInterestScore(course, interestPatterns);

            // Calculate overall score
            const overallScore = (academicScore * 0.6) + (interestScore * 0.4);

            // Determine category
            let category: 'highly-recommended' | 'moderately-recommended' | 'conditionally-eligible' = 'conditionally-eligible';
            if (overallScore >= 4 && academicEligible) {
                category = 'highly-recommended';
            } else if (overallScore >= 3 && academicEligible) {
                category = 'moderately-recommended';
            }

            return {
                ...course,
                academicScore: Math.round(academicScore * 100) / 100,
                interestScore: Math.round(interestScore * 100) / 100,
                overallScore: Math.round(overallScore * 100) / 100,
                category
            };
        })
        .sort((a, b) => b.overallScore - a.overallScore);

    return recommendedCourses;
}

function checkAcademicEligibility(course: Course, alResults: ALResultsData, academicScore: number): boolean {
    const gradePoints: Record<string, number> = { 'A': 5, 'B': 4, 'C': 3, 'S': 2, 'F': 0 };
    const minGradePoint = gradePoints[course.minimumGrade] || 0;

    // Check if student has required subjects
    const hasRequiredSubjects = course.requiredSubjects.every(required =>
        alResults.subjects.some((subject: { name: string; grade: string }) => subject.name === required)
    );

    // Check minimum grades in required subjects
    const meetsMinimumGrade = course.requiredSubjects.every(required => {
        const subject = alResults.subjects.find((s: { name: string; grade: string }) => s.name === required);
        return subject && (gradePoints[subject.grade] || 0) >= minGradePoint;
    });

    return hasRequiredSubjects && meetsMinimumGrade;
}

function analyzeCareerInterests(answers: CareerQuizAnswer[]): Record<string, number> {
    const patterns = {
        technical: 0,
        creative: 0,
        fieldwork: 0,
        analytical: 0,
        dataOriented: 0,
        peopleOriented: 0,
        innovation: 0,
        leadership: 0,
        sustainability: 0
    };

    answers.forEach(answer => {
        switch (answer.questionId) {
            case 2: // Technical vs Creative
                if (answer.answer === 'Technical') patterns.technical += 1;
                else patterns.creative += 1;
                break;
            case 3: // Fieldwork vs Office
                if (answer.answer === 'Fieldwork') patterns.fieldwork += 1;
                break;
            case 5: // Data vs People
                if (answer.answer === 'Data-oriented') patterns.dataOriented += 1;
                else patterns.peopleOriented += 1;
                break;
            case 6: // Innovation interest
                if (typeof answer.answer === 'number') patterns.innovation += (answer.answer as number) / 5;
                break;
            case 9: // Sustainability
                if (typeof answer.answer === 'number') patterns.sustainability += (answer.answer as number) / 5;
                break;
            case 10: // Leadership
                if (answer.answer === 'Leadership') patterns.leadership += 1;
                break;
        }
    });

    return patterns;
}

function calculateInterestScore(course: Course, patterns: Record<string, number>): number {
    let score = 3; // Base score

    const courseName = course.name.toLowerCase();

    // Adjust based on course type and patterns
    if (courseName.includes('computer') || courseName.includes('software') || courseName.includes('engineering')) {
        score += patterns.technical * 0.5 + patterns.innovation * 0.3;
    }

    if (courseName.includes('architecture') || courseName.includes('design')) {
        score += patterns.creative * 0.5 + patterns.innovation * 0.3;
    }

    if (courseName.includes('civil') || courseName.includes('mechanical') || courseName.includes('environmental')) {
        score += patterns.fieldwork * 0.3 + patterns.innovation * 0.2;
    }

    if (courseName.includes('environmental') || courseName.includes('sustainability')) {
        score += patterns.sustainability * 0.5;
    }

    return Math.min(score, 5);
}

export { courseDatabase };
