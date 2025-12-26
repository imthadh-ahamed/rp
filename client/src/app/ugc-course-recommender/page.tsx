'use client';

import { useState } from 'react';
import AppShell from '@/components/common/AppShell';
import {
    UGCHeader,
    StudentInfoForm,
    ALResultsForm,
    CareerQuiz,
    CourseRecommendations,
    AptitudeTestList,
    AptitudeTestQuiz
} from '@/components/ugc-course-recommender';
import ProgressIndicator from '@/components/ugc-course-recommender/ProgressIndicator';
import { StudentInfoData } from '@/components/ugc-course-recommender/StudentInfoForm';
import { ALResultsData } from '@/components/ugc-course-recommender/ALResultsForm';
import { CareerQuizAnswer } from '@/components/ugc-course-recommender/CareerQuiz';
import { calculateRecommendations, Course } from '@/utils/recommendationEngine';

type Step = 'student-info' | 'al-results' | 'career-quiz' | 'recommendations' | 'aptitude-list' | 'aptitude-quiz';

const steps = ['Student Info', 'A/L Results', 'Career Quiz', 'Recommendations', 'Aptitude Tests'];

export default function UGCCourseSelectorPage() {
    const [currentStep, setCurrentStep] = useState<Step>('student-info');
    const [studentInfo, setStudentInfo] = useState<StudentInfoData | null>(null);
    const [alResults, setALResults] = useState<ALResultsData | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<CareerQuizAnswer[]>([]);
    const [currentQuizQuestion, setCurrentQuizQuestion] = useState(1);
    const [recommendations, setRecommendations] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedTest, setSelectedTest] = useState<string | null>(null);

    const handleStudentInfoSubmit = (data: StudentInfoData) => {
        setStudentInfo(data);
        setCurrentStep('al-results');
    };

    const handleALResultsSubmit = (data: ALResultsData) => {
        setALResults(data);
        setCurrentStep('career-quiz');
        setCurrentQuizQuestion(1);
    };

    const handleQuizAnswer = (answer: string | number) => {
        const newAnswers = [...quizAnswers];
        newAnswers[currentQuizQuestion - 1] = {
            questionId: currentQuizQuestion,
            answer
        };
        setQuizAnswers(newAnswers);

        if (currentQuizQuestion < 10) {
            setCurrentQuizQuestion(prev => prev + 1);
        } else {
            // All quiz questions answered, generate recommendations
            if (alResults && newAnswers.length === 10) {
                const generatedRecommendations = calculateRecommendations(alResults, newAnswers);
                setRecommendations(generatedRecommendations);
                setCurrentStep('recommendations');
            }
        }
    };

    const handleQuizPrevious = () => {
        if (currentQuizQuestion > 1) {
            setCurrentQuizQuestion(prev => prev - 1);
        }
    };

    const handleSelectCourse = (course: Course) => {
        setSelectedCourse(course);
        setCurrentStep('aptitude-list');
        setSelectedTest(null);
    };

    const handleSelectTest = (testName: string) => {
        setSelectedTest(testName);
        setCurrentStep('aptitude-quiz');
    };

    const handleBackToRecommendations = () => {
        setCurrentStep('recommendations');
        setSelectedCourse(null);
        setSelectedTest(null);
    };

    const handleBackToTests = () => {
        setCurrentStep('aptitude-list');
        setSelectedTest(null);
    };

    const getStepIndex = (): number => {
        switch (currentStep) {
            case 'student-info':
                return 0;
            case 'al-results':
                return 1;
            case 'career-quiz':
                return 2;
            case 'recommendations':
            case 'aptitude-list':
            case 'aptitude-quiz':
                return 3;
            default:
                return 0;
        }
    };

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <UGCHeader />

                <div className="mt-8 mb-12">
                    <ProgressIndicator steps={steps} currentStep={getStepIndex()} />
                </div>

                {/* Step 1: Student Information */}
                {currentStep === 'student-info' && (
                    <StudentInfoForm onSubmit={handleStudentInfoSubmit} />
                )}

                {/* Step 2: A/L Results */}
                {currentStep === 'al-results' && (
                    <ALResultsForm onSubmit={handleALResultsSubmit} />
                )}

                {/* Step 3: Career Quiz */}
                {currentStep === 'career-quiz' && (
                    <CareerQuiz
                        questionNumber={currentQuizQuestion}
                        totalQuestions={10}
                        onNext={handleQuizAnswer}
                        onPrevious={handleQuizPrevious}
                    />
                )}

                {/* Step 4: Course Recommendations */}
                {currentStep === 'recommendations' && (
                    <CourseRecommendations
                        courses={recommendations}
                        onSelectCourse={handleSelectCourse}
                    />
                )}

                {/* Step 5: Aptitude Test List */}
                {currentStep === 'aptitude-list' && selectedCourse && (
                    <AptitudeTestList
                        course={selectedCourse}
                        onSelectTest={handleSelectTest}
                        onBack={handleBackToRecommendations}
                    />
                )}

                {/* Step 6: Aptitude Test Quiz */}
                {currentStep === 'aptitude-quiz' && selectedCourse && selectedTest && (
                    <AptitudeTestQuiz
                        course={selectedCourse}
                        testName={selectedTest}
                        onBack={handleBackToTests}
                    />
                )}
            </div>
        </AppShell>
    );
}
