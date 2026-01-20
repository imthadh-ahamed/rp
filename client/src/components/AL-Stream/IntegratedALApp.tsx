"use client";

import React, { useState } from "react";
import ALStreamPredictor from "./predictor/ALStreamPredictor";
import QuizApp from "./quiz/QuizApp";
import ALStreamHeader from "./shared/ALStreamHeader";
import { PredictionResult } from "../../types/predictor.types";

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

interface CustomQuizResults {
  results: QuizResultsData;
  streamName: string;
}

export default function IntegratedALApp() {
  const [currentView, setCurrentView] = useState<"predictor" | "quiz">("predictor");
  const [recommendedStream, setRecommendedStream] = useState<string | null>(null);
  const [predictorResults, setPredictorResults] = useState<PredictionResult | null>(null);
  const [customQuizResults, setCustomQuizResults] = useState<CustomQuizResults | null>(null);

  const handleTakeQuiz = (stream: string) => {
    setRecommendedStream(stream);
    setCurrentView("quiz");
  };

  const handleBackToPredictor = () => {
    setCurrentView("predictor");
    setRecommendedStream(null);
    setCustomQuizResults(null);
  };

  const handleCustomQuizComplete = (results: QuizResultsData, streamName: string) => {
    setCustomQuizResults({ results, streamName });
  };

  return (
    <div>
      {/* Header - only show on predictor view */}
      {currentView === "predictor" && <ALStreamHeader />}

      {currentView === "predictor" && (
        <ALStreamPredictor
          onTakeQuiz={handleTakeQuiz}
          setPredictorResults={setPredictorResults}
        />
      )}
      {currentView === "quiz" && (
        <QuizApp
          initialStream={recommendedStream}
          onBackToPredictor={handleBackToPredictor}
          predictorResults={predictorResults}
          onCustomQuizComplete={handleCustomQuizComplete}
          customQuizResults={customQuizResults}
        />
      )}
    </div>
  );
}

