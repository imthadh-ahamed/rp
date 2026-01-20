import React, { useState, useEffect } from "react";
import { AlertCircle, BookOpen, Brain } from "lucide-react";
import { API_URL } from "../../../utils/constants";
import BasketSelector from "./BasketSelector";
import PredictorResults from "./PredictorResults";
import LoadingSpinner from "../shared/LoadingSpinner";
import {
    ALStreamPredictorProps,
    BasketConfig,
    PredictionResult,
    FormData,
    SelectedSubjects
} from "../../../types/predictor.types";

export default function ALStreamPredictor({ onTakeQuiz, setPredictorResults }: ALStreamPredictorProps) {
    const [baskets, setBaskets] = useState<BasketConfig | null>(null);
    const [formData, setFormData] = useState<FormData>({});
    const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubjects>({
        basket2: null,
        basket3: null,
        basket4: null,
    });
    const [results, setResults] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBaskets();
    }, []);

    const fetchBaskets = async () => {
        try {
            const response = await fetch(`${API_URL}/predict/baskets`);
            const data = await response.json();
            setBaskets(data);

            const initialData: FormData = {};
            Object.values(data).forEach((basket: any) => {
                basket.subjects.forEach((subject: string) => {
                    initialData[subject] = 0;
                });
            });
            setFormData(initialData);
        } catch (err) {
            setError("Failed to load subject configuration");
        }
    };

    const handleMarkChange = (subject: string, value: string) => {
        const mark = parseFloat(value) || 0;
        if (mark >= 0 && mark <= 100) {
            setFormData((prev) => ({ ...prev, [subject]: mark }));
        }
    };

    const handleSubjectSelect = (basket: string, subject: string) => {
        setSelectedSubjects((prev) => ({ ...prev, [basket]: subject })); // Key access might need typing if dynamic

        if (!baskets) return;
        const basketKey = basket as keyof BasketConfig;
        const basketSubjects = baskets[basketKey].subjects;
        const updatedData = { ...formData };
        basketSubjects.forEach((subj) => {
            updatedData[subj] = 0;
        });
        setFormData(updatedData);
    };

    const handleSubmit = async () => {
        if (!baskets) return;
        setLoading(true);
        setError(null);
        setResults(null);

        const coreSubjects = baskets.basket1.subjects;
        const missingCore = coreSubjects.filter(
            (subj) => !formData[subj] || formData[subj] === 0
        );

        if (missingCore.length > 0) {
            setError("Please enter marks for all core subjects");
            setLoading(false);
            return;
        }

        if (
            !selectedSubjects.basket2 ||
            !selectedSubjects.basket3 ||
            !selectedSubjects.basket4
        ) {
            setError("Please select one subject from each basket");
            setLoading(false);
            return;
        }

        const selectedWithoutMarks: string[] = [];
        (["basket2", "basket3", "basket4"] as const).forEach((basket) => {
            const subject = selectedSubjects[basket];
            if (subject && (!formData[subject] || formData[subject] === 0)) {
                selectedWithoutMarks.push(subject);
            }
        });

        if (selectedWithoutMarks.length > 0) {
            setError("Please enter marks for all selected subjects");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/predict/stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setResults(data);
                if (setPredictorResults) {
                    setPredictorResults(data);
                }
            } else {
                setError(data.error || "Prediction failed");
            }
        } catch (err) {
            setError("Failed to connect to prediction service");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        const resetData: FormData = {};
        Object.keys(formData).forEach((key) => {
            resetData[key] = 0;
        });
        setFormData(resetData);
        setSelectedSubjects({ basket2: null, basket3: null, basket4: null });
        setResults(null);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!baskets) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner />
        </div>
    );

    return (
        <div>
            <div className="max-w-6xl mx-auto">

                {error && (
                    <div className="flex items-start p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {!results ? (
                    <div className="p-8 bg-white shadow-lg rounded-xl">
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <BookOpen className="w-6 h-6 mr-2 text-teal-600" />
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Core Subjects
                                </h2>
                                <span className="ml-3 text-sm font-semibold text-red-600">
                                    (All Required)
                                </span>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {baskets.basket1.subjects.map((subject) => (
                                    <div key={subject} className="p-4 rounded-lg bg-cyan-50">
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                                            {subject
                                                .replace("_", " ")
                                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData[subject] || ""}
                                            onChange={(e) =>
                                                handleMarkChange(subject, e.target.value)
                                            }
                                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="0-100"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <BasketSelector
                            basket={baskets.basket2}
                            basketKey="basket2"
                            selectedSubject={selectedSubjects.basket2}
                            onSelectSubject={handleSubjectSelect}
                            formData={formData}
                            onMarkChange={handleMarkChange}
                            color="green"
                        />

                        <BasketSelector
                            basket={baskets.basket3}
                            basketKey="basket3"
                            selectedSubject={selectedSubjects.basket3}
                            onSelectSubject={handleSubjectSelect}
                            formData={formData}
                            onMarkChange={handleMarkChange}
                            color="purple"
                        />

                        <BasketSelector
                            basket={baskets.basket4}
                            basketKey="basket4"
                            selectedSubject={selectedSubjects.basket4}
                            onSelectSubject={handleSubjectSelect}
                            formData={formData}
                            onMarkChange={handleMarkChange}
                            color="orange"
                        />

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center justify-center flex-1 py-4 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-md hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-5 h-5 mr-2" />
                                        Predict My Stream
                                    </>
                                )}
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-8 py-4 font-semibold text-gray-700 transition-colors border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                ) : (
                    <PredictorResults
                        results={results}
                        onTakeQuiz={onTakeQuiz!}
                        onReset={resetForm}
                    />
                )}
            </div>
        </div>
    );
}
