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
import { useCombinedPrediction } from '@/hooks/usePredictions';
import { AnyQuestion, QuestionType } from '@/services/aptitudeApi';

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
    const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<AnyQuestion[]>([]);
    const [aiGeneratedType, setAiGeneratedType] = useState<QuestionType>('structured');

    const {
        predict,
        result: predictionResult,
        loading: predicting,
        error: predictionError,
    } = useCombinedPrediction();

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

    const handleQuizAnswer = async (answer: string | number) => {
        const newAnswers = [...quizAnswers];
        newAnswers[currentQuizQuestion - 1] = {
            questionId: quizQuestions[currentQuizQuestion - 1].id,
            answer: Number(answer),
        };
        setQuizAnswers(newAnswers);

        if (currentQuizQuestion < 10) {
            setCurrentQuizQuestion(prev => prev + 1);
        } else {
            if (alResults && newAnswers.length === 10) {
                const generatedRecommendations = calculateRecommendations(alResults, newAnswers);
                setRecommendations(generatedRecommendations);
                setCurrentStep('recommendations');

                if (studentInfo) {
                    const s = alResults.subjects;
                    const ol = alResults.olResults;

                    // ── Fire combined prediction: course model picks top N courses,
                    //    university model ranks admission chances for each ──────────
                    await predict({
                        Year:        studentInfo.examYear,
                        Stream:      alResults.stream,

                        Subject_1: s[0]?.name  ?? '',
                        Grade_1:   s[0]?.grade ?? '',
                        Subject_2: s[1]?.name  ?? '',
                        Grade_2:   s[1]?.grade ?? '',
                        Subject_3: s[2]?.name  ?? '',
                        Grade_3:   s[2]?.grade ?? '',

                        Z_Score:     alResults.zScore     ?? 0,
                        Island_Rank: alResults.islandRank ?? 0,
                        District:    studentInfo.district,
                        Gen_Test:    0,

                        'Sinhala/Tamil': ol[0]?.grade ?? '',
                        English:         ol[1]?.grade ?? '',
                        Maths:           ol[2]?.grade ?? '',
                        Science:         ol[3]?.grade ?? '',

                        q1_science_tech:     newAnswers[0]?.answer ?? 0,
                        q2_healthcare:       newAnswers[1]?.answer ?? 0,
                        q3_design:           newAnswers[2]?.answer ?? 0,
                        q4_data:             newAnswers[3]?.answer ?? 0,
                        q5_business:         newAnswers[4]?.answer ?? 0,
                        q6_arts_culture:     newAnswers[5]?.answer ?? 0,
                        q7_nature_env:       newAnswers[6]?.answer ?? 0,
                        q8_hands_on:         newAnswers[7]?.answer ?? 0,
                        q9_innovation:       newAnswers[8]?.answer ?? 0,
                        q10_people_social:   newAnswers[9]?.answer ?? 0,
                        q11_urban_corporate: 0,
                        q12_flexible_path:   0,

                        top_n_courses: 10, // show top 10 AI-recommended courses
                    });
                }
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
        setAiGeneratedQuestions([]);
    };

    const getStepIndex = (): number => {
        switch (currentStep) {
            case 'student-info':    return 0;
            case 'al-results':      return 1;
            case 'career-quiz':     return 2;
            case 'recommendations': return 3;
            case 'aptitude-list':
            case 'aptitude-quiz':   return 4;
            default: return 0;
        }
    };

    const handleStepNav = (index: number) => {
        if (index === 0) setCurrentStep('student-info');
        if (index === 1 && studentInfo) setCurrentStep('al-results');
        if (index === 2 && alResults) setCurrentStep('career-quiz');
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

                {currentStep === 'student-info' && (
                    <StudentInfoForm onSubmit={handleStudentInfoSubmit} initialData={studentInfo} />
                )}

                {currentStep === 'al-results' && (
                    <ALResultsForm onSubmit={handleALResultsSubmit} initialData={alResults} />
                )}

                {currentStep === 'career-quiz' && (
                    <CareerQuiz
                        questionNumber={currentQuizQuestion}
                        totalQuestions={10}
                        onNext={handleQuizAnswer}
                        onPrevious={handleQuizPrevious}
                        currentAnswer={quizAnswers.find(
                            a => a.questionId === quizQuestions[currentQuizQuestion - 1].id
                        )?.answer}
                    />
                )}

                {currentStep === 'recommendations' && (
                    <CourseRecommendations
                        courses={recommendations}
                        onSelectCourse={handleSelectCourse}
                        predicting={predicting}
                        predictionResult={predictionResult}
                        predictionError={predictionError}
                    />
                )}

                {currentStep === 'aptitude-list' && selectedCourse && (
                    <AptitudeTestList
                        course={selectedCourse}
                        onSelectTest={handleSelectTest}
                        onBack={handleBackToRecommendations}
                        onStartAIQuiz={(questions, type) => {
                            setAiGeneratedQuestions(questions);
                            setAiGeneratedType(type);
                            setSelectedTest(null);
                            setCurrentStep('aptitude-quiz');
                        }}
                    />
                )}

                {currentStep === 'aptitude-quiz' && selectedCourse && (selectedTest || aiGeneratedQuestions.length > 0) && (
                    <AptitudeTestQuiz
                        course={selectedCourse}
                        testName={selectedTest ?? undefined}
                        onBack={handleBackToTests}
                        aiQuestions={aiGeneratedQuestions.length > 0 ? aiGeneratedQuestions : undefined}
                        aiQuestionType={aiGeneratedQuestions.length > 0 ? aiGeneratedType : undefined}
                    />
                )}
            </div>
        </AppShell>
    );
}