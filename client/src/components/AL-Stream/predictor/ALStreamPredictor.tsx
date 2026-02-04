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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {error && (
                    <div className="flex items-start p-4 mb-6 border border-red-200 rounded-xl bg-red-50 shadow-sm animate-in fade-in duration-300">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-red-800 text-sm sm:text-base">{error}</p>
                    </div>
                )}

                {!results ? (
                    <div className="p-6 sm:p-8 lg:p-10 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-2">
                                <div className="flex items-center">
                                    <div className="p-2 bg-teal-100 rounded-lg mr-3">
                                        <BookOpen className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                        Core Subjects
                                    </h2>
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                                    All Required
                                </span>
                            </div>
                            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {baskets.basket1.subjects.map((subject) => (
                                    <div key={subject} className="group relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                                        <div className="relative p-4 rounded-xl bg-white border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-200 hover:shadow-lg">
                                            <label className="block mb-2 text-sm font-bold text-gray-700">
                                                {subject
                                                    .replace("_", " ")
                                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={formData[subject] || ""}
                                                    onChange={(e) =>
                                                        handleMarkChange(subject, e.target.value)
                                                    }
                                                    className="w-full px-4 py-3 pr-12 text-lg font-semibold text-gray-800 bg-gradient-to-br from-gray-50 to-cyan-50/30 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-gray-400"
                                                    placeholder="0-100"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                                                    /100
                                                </span>
                                            </div>
                                        </div>
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

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="group relative flex items-center justify-center flex-1 py-4 px-6 font-bold text-white transition-all rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 hover:from-cyan-600 hover:via-teal-600 hover:to-cyan-700 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
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
                                className="px-8 py-4 font-bold text-gray-700 transition-all border-2 border-gray-300 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-slate-50 hover:border-gray-400 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg"
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
