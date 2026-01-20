import React, { useState, useEffect } from "react";
import { API_URL } from "../../../utils/constants";
import QuizStart from "./QuizStart";
import QuizQuestion from "./QuizQuestion";
import QuizSidebar from "./QuizSidebar";
import QuizResults from "./QuizResults";
import StreamComparisonCard from "./StreamComparisonCard";
import { PredictionResult } from "../../../types/predictor.types";

interface Question {
    id: number;
    question: string;
    options: { [key: string]: string };
    question_type: string;
}

interface Quiz {
    stream: string;
    questions: Question[];
    answers: string[];
}

interface QuizResultItem {
    is_correct: boolean;
    user_answer: string;
    correct_answer: string;
}

interface QuizResultsData {
    score: number;
    total: number;
    percentage: number;
    results: QuizResultItem[];
}

interface QuizAppProps {
    initialStream: string | null;
    onBackToPredictor: () => void;
    predictorResults: PredictionResult | null;
    onCustomQuizComplete: (results: QuizResultsData, streamName: string) => void;
    customQuizResults: { results: QuizResultsData; streamName: string } | null;
}

export default function QuizApp({
    initialStream,
    onBackToPredictor,
    predictorResults,
    onCustomQuizComplete,
    customQuizResults,
}: QuizAppProps) {
    const [streams, setStreams] = useState<string[]>([]);
    const [customStream, setCustomStream] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [results, setResults] = useState<QuizResultsData | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showCustomStreamOption, setShowCustomStreamOption] = useState(false);
    const [completedRecommendedQuiz, setCompletedRecommendedQuiz] =
        useState(false);
    const [recommendedQuizResults, setRecommendedQuizResults] = useState<QuizResultsData | null>(null);

    useEffect(() => {
        fetchStreams();
    }, []);

    const fetchStreams = async () => {
        try {
            const response = await fetch(`${API_URL}/quiz/streams`);
            const data = await response.json();
            setStreams(data.streams);
        } catch (error) {
            console.error("Error fetching streams:", error);
            setError("Failed to load streams");
        }
    };

    const generateQuiz = async () => {
        let streamToUse: string;
        if (showCustomStreamOption) {
            streamToUse = customStream.trim();
        } else {
            streamToUse = initialStream || "";
        }

        if (!streamToUse) {
            setError("Please enter a stream name");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/quiz/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stream: streamToUse,
                    num_questions: 10,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate quiz");
            }

            const data = await response.json();
            setQuiz(data);
            setUserAnswers({});
            setResults(null);
            setCurrentQuestion(0);
        } catch (error: any) {
            console.error("Error generating quiz:", error);
            setError(error.message || "Failed to generate quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: number, answer: string) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const submitQuiz = async () => {
        if (!quiz) return;
        const answerArray = quiz.questions.map((q) => userAnswers[q.id] || "");

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/quiz/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers: answerArray,
                    correct_answers: quiz.answers,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit quiz");
            }

            const data = await response.json();
            setResults(data);

            if (quiz.stream.toLowerCase() === initialStream?.toLowerCase()) {
                setCompletedRecommendedQuiz(true);
                setRecommendedQuizResults(data);
            } else {
                onCustomQuizComplete(data, quiz.stream);
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
            setError("Failed to submit quiz");
        } finally {
            setLoading(false);
        }
    };

    const resetQuiz = () => {
        setQuiz(null);
        setUserAnswers({});
        setResults(null);
        setCurrentQuestion(0);
        setError("");

        if (completedRecommendedQuiz) {
            setShowCustomStreamOption(true);
        }
    };

    const handleTryAnotherStream = () => {
        setQuiz(null);
        setUserAnswers({});
        setResults(null);
        setCurrentQuestion(0);
        setError("");
        setShowCustomStreamOption(true);
    };

    if (!quiz && !results) {
        return (
            <QuizStart
                initialStream={initialStream}
                showCustomStreamOption={showCustomStreamOption}
                customStream={customStream}
                setCustomStream={setCustomStream}
                streams={streams}
                loading={loading}
                error={error}
                onGenerateQuiz={generateQuiz}
                onBackToPredictor={onBackToPredictor}
            />
        );
    }

    if (results && quiz) {
        const isCustomQuiz =
            quiz.stream.toLowerCase() !== initialStream?.toLowerCase();
        const showComparison =
            isCustomQuiz && completedRecommendedQuiz && recommendedQuizResults;

        return (
            <div className="w-full h-full">
                <div className="max-w-4xl mx-auto space-y-6">
                    {showComparison && (
                        <StreamComparisonCard
                            recommendedStream={initialStream || ""}
                            recommendedScore={recommendedQuizResults!.percentage}
                            customStream={quiz.stream}
                            customScore={results.percentage}
                            predictorResults={predictorResults}
                        />
                    )}

                    <QuizResults
                        results={results}
                        questions={quiz.questions}
                        streamName={quiz.stream}
                        onRetake={resetQuiz}
                        onBackToPredictor={onBackToPredictor}
                        showTryAnother={!showComparison}
                        onTryAnotherStream={handleTryAnotherStream}
                    />
                </div>
            </div>
        );
    }

    if (!quiz) return null;

    const allAnswered = quiz.questions.every((q) => userAnswers[q.id]);

    // Clamp currentQuestion to valid range
    const safeCurrentQuestion = Math.max(
        0,
        Math.min(currentQuestion, quiz.questions.length - 1)
    );
    const currentQuestionData = quiz.questions[safeCurrentQuestion];

    return (
        <div className="w-full h-full">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <QuizSidebar
                        questions={quiz.questions}
                        userAnswers={userAnswers}
                        currentQuestion={safeCurrentQuestion}
                        onQuestionClick={setCurrentQuestion}
                    />

                    <QuizQuestion
                        question={currentQuestionData}
                        questionNumber={safeCurrentQuestion + 1}
                        totalQuestions={quiz.questions.length}
                        userAnswer={userAnswers[currentQuestionData.id] || ""}
                        onAnswerSelect={handleAnswerSelect}
                        onPrevious={() =>
                            setCurrentQuestion((prev) => Math.max(0, prev - 1))
                        }
                        onNext={() =>
                            setCurrentQuestion((prev) =>
                                Math.min(quiz.questions.length - 1, prev + 1)
                            )
                        }
                        onSubmit={submitQuiz}
                        canGoBack={safeCurrentQuestion > 0}
                        isLastQuestion={safeCurrentQuestion === quiz.questions.length - 1}
                        allAnswered={allAnswered}
                        loading={loading}
                        error={error}
                        userAnswers={userAnswers}
                    />
                </div>
            </div>
        </div>
    );
}
