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
import { CareerQuizAnswer, quizQuestions } from '@/components/ugc-course-recommender/CareerQuiz';
import { calculateRecommendations, RecommendedCourse } from '@/utils/recommendationEngine';

type Step = 'student-info' | 'al-results' | 'career-quiz' | 'recommendations' | 'aptitude-list' | 'aptitude-quiz';

const steps = ['Student Info', 'A/L Results', 'Career Quiz', 'Recommendations', 'Aptitude Tests'];

export default function UGCCourseSelectorPage() {
    const [currentStep, setCurrentStep] = useState<Step>('student-info');
    const [studentInfo, setStudentInfo] = useState<StudentInfoData | null>(null);
    const [alResults, setALResults] = useState<ALResultsData | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<CareerQuizAnswer[]>([]);
    const [currentQuizQuestion, setCurrentQuizQuestion] = useState(1);
    const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<RecommendedCourse | null>(null);
    const [selectedTest, setSelectedTest] = useState<string | null>(null);

    const handleStudentInfoSubmit = (data: StudentInfoData) => {
        setStudentInfo(data);
        setCurrentStep('al-results');
    };

    const handleALResultsSubmit = (data: ALResultsData) => {
        setALResults(data);
        setRecommendations([]);
        setCurrentStep('career-quiz');
        setCurrentQuizQuestion(1);
    };

    const handleQuizAnswer = (answer: string | number) => {
        const newAnswers = [...quizAnswers];
        newAnswers[currentQuizQuestion - 1] = {
            questionId: quizQuestions[currentQuizQuestion - 1].id,
            answer: Number(answer)
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
        } else {
            setCurrentStep('al-results');
        }
    };

    const handleSelectCourse = (course: RecommendedCourse) => {
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
            case 'student-info': return 0;
            case 'al-results': return 1;
            case 'career-quiz': return 2;
            case 'recommendations': return 3;
            case 'aptitude-list':
            case 'aptitude-quiz': return 4;
            default: return 0;
        }
    };

    const handleStepNav = (index: number) => {
        // Only allow unlocking steps if previous steps are complete
        if (index === 0) setCurrentStep('student-info');
        if (index === 1 && studentInfo) setCurrentStep('al-results');
        if (index === 2 && alResults) {
            setCurrentStep('career-quiz');
            // If returning to quiz, start from question 1 or keep last state?
            // Usually simpler to just show the quiz.
        }
        if (index === 3 && recommendations.length > 0) setCurrentStep('recommendations');
        if (index === 4 && selectedCourse) setCurrentStep('aptitude-list');
    };

    const getMaxStepIndex = (): number => {
        if (selectedCourse) return 4;
        if (recommendations.length > 0) return 3;
        if (alResults) return 2;
        if (studentInfo) return 1;
        return 0;
    };

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <UGCHeader />

                <div className="mt-8 mb-12">
                    <ProgressIndicator
                        steps={steps}
                        currentStep={getStepIndex()}
                        onStepClick={handleStepNav}
                        maxStep={getMaxStepIndex()}
                    />
                </div>

                {/* Step 1: Student Information */}
                {currentStep === 'student-info' && (
                    <StudentInfoForm
                        onSubmit={handleStudentInfoSubmit}
                        initialData={studentInfo}
                    />
                )}

                {/* Step 2: A/L Results */}
                {currentStep === 'al-results' && (
                    <ALResultsForm
                        onSubmit={handleALResultsSubmit}
                        initialData={alResults}
                    />
                )}

                {/* Step 3: Career Quiz */}
                {currentStep === 'career-quiz' && (
                    <CareerQuiz
                        questionNumber={currentQuizQuestion}
                        totalQuestions={10}
                        onNext={handleQuizAnswer}
                        onPrevious={handleQuizPrevious}
                        currentAnswer={quizAnswers.find(a => a.questionId === quizQuestions[currentQuizQuestion - 1].id)?.answer}
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
