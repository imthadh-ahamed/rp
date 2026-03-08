import React from "react";
import {
    Target,
    GraduationCap,
    BookOpen,
    ExternalLink,
} from "lucide-react";
import { getStreamReferences } from "../../../utils/references";
import { PredictionResult } from "../../../types/predictor.types";

interface StreamComparisonCardProps {
    recommendedStream: string;
    recommendedScore: number;
    customStream: string;
    customScore: number;
    predictorResults: PredictionResult | null;
}

interface StreamResource {
    title: string;
    url: string;
    type: string;
}

interface StreamReferenceData {
    name: string;
    resources: StreamResource[];
    careers: string[];
}

export default function StreamComparisonCard({
    recommendedStream,
    recommendedScore,
    customStream,
    customScore,
    predictorResults,
}: StreamComparisonCardProps) {
    const scoreDiff = customScore - recommendedScore;
    const confidenceDiff = predictorResults
        ? predictorResults.top_recommendations[0].confidence -
        (predictorResults.all_predictions.find(
            (p) => p.stream.toLowerCase() === customStream.toLowerCase()
        )?.confidence || 0)
        : 0;

    const recommendedRefs = getStreamReferences(recommendedStream);
    const customRefs = getStreamReferences(customStream);

    const getRecommendation = () => {
        if (recommendedScore > customScore && confidenceDiff > 20) {
            return {
                icon: "🎯",
                title: "Stick with the Recommended Stream",
                message: `Your predictor score shows ${confidenceDiff.toFixed(
                    1
                )}% higher confidence for ${recommendedStream
                    .replace(/_/g, " ")
                    .toUpperCase()}, and you scored ${Math.abs(scoreDiff).toFixed(
                        1
                    )}% better on its quiz. This is a clear match!`,
                color: "bg-gradient-to-r from-green-500 to-emerald-600",
                recommendation: recommendedStream,
            };
        }

        if (customScore > recommendedScore + 10) {
            return {
                icon: "💡",
                title: "Consider the Custom Stream",
                message: `You scored ${scoreDiff.toFixed(1)}% higher on ${customStream
                    .replace(/_/g, " ")
                    .toUpperCase()}! This suggests strong aptitude. However, your O/L results favor ${recommendedStream
                        .replace(/_/g, " ")
                        .toUpperCase()}. Consider your interests and long-term goals.`,
                color: "bg-gradient-to-r from-blue-500 to-purple-600",
                recommendation: "Both options are viable",
            };
        }

        if (Math.abs(scoreDiff) <= 10) {
            return {
                icon: "⚖️",
                title: "Both Streams Are Good Options",
                message: `Your quiz scores are very close (${Math.abs(
                    scoreDiff
                ).toFixed(
                    1
                )}% difference). Since the predictor recommends ${recommendedStream
                    .replace(/_/g, " ")
                    .toUpperCase()} based on your O/L results, that's likely the safer choice. But follow your passion!`,
                color: "bg-gradient-to-r from-indigo-500 to-blue-600",
                recommendation: recommendedStream,
            };
        }

        return {
            icon: "📊",
            title: "Recommendation Based on Overall Performance",
            message: `Consider both your quiz performance and predictor analysis. ${recommendedStream
                .replace(/_/g, " ")
                .toUpperCase()} has ${confidenceDiff.toFixed(
                    1
                )}% higher confidence from your O/L results.`,
            color: "bg-gradient-to-r from-indigo-600 to-purple-600",
            recommendation: recommendedStream,
        };
    };

    const recommendation = getRecommendation();

    return (
        <div className="p-8 bg-white shadow-xl rounded-2xl border border-slate-100 animate-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-50 rounded-xl">
                    <span className="text-3xl">{recommendation.icon}</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Stream Comparison & Analysis
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Detailed comparison of your performance vs. prediction
                    </p>
                </div>
            </div>

            <div className="grid gap-6 mb-8 lg:grid-cols-2">
                {/* Recommended Stream */}
                <StreamCard
                    title="Recommended by Predictor"
                    stream={recommendedStream}
                    score={recommendedScore}
                    confidence={predictorResults?.top_recommendations[0].confidence}
                    references={recommendedRefs}
                    colorScheme="teal"
                    icon="🥇"
                />

                {/* Custom Stream */}
                <StreamCard
                    title="Your Choice"
                    stream={customStream}
                    score={customScore}
                    confidence={
                        predictorResults?.all_predictions.find(
                            (p) => p.stream.toLowerCase() === customStream.toLowerCase()
                        )?.confidence
                    }
                    references={customRefs}
                    colorScheme="indigo"
                    icon="🔍"
                />
            </div>

            <div className={`${recommendation.color} rounded-2xl p-8 text-white shadow-lg relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative">
                    <h3 className="mb-3 text-2xl font-bold flex items-center gap-3">
                        {recommendation.title}
                    </h3>
                    <p className="mb-6 leading-relaxed text-lg opacity-95 max-w-3xl">{recommendation.message}</p>
                    <div className="inline-flex items-center gap-3 px-5 py-3 border border-white/30 rounded-xl bg-white/20 backdrop-blur-md">
                        <Target className="w-5 h-5 text-white" />
                        <span className="font-bold tracking-wide">
                            Best Choice for A/L:{" "}
                            {recommendation.recommendation.replace(/_/g, " ").toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StreamCardProps {
    title: string;
    stream: string;
    score: number;
    confidence?: number;
    references: StreamReferenceData | null;
    colorScheme: "teal" | "indigo";
    icon: string;
}

function StreamCard({
    title,
    stream,
    score,
    confidence,
    references,
    colorScheme,
    icon,
}: StreamCardProps) {
    // Define color schemes
    const colors = {
        teal: {
            border: "border-teal-100",
            bg: "bg-teal-50/50",
            headerBg: "bg-teal-100/50",
            text: "text-teal-700",
            textDark: "text-teal-900",
            badge: "bg-white text-teal-700 border-teal-100",
            hover: "hover:bg-teal-100/80",
            iconColor: "text-teal-600"
        },
        indigo: {
            border: "border-indigo-100",
            bg: "bg-indigo-50/50",
            headerBg: "bg-indigo-100/50",
            text: "text-indigo-700",
            textDark: "text-indigo-900",
            badge: "bg-white text-indigo-700 border-indigo-100",
            hover: "hover:bg-indigo-100/80",
            iconColor: "text-indigo-600"
        },
    };

    const c = colors[colorScheme];

    return (
        <div className={`border rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:border-transparent ${c.border} ${c.bg}`}>
            <div className={`p-5 border-b ${c.border} ${c.headerBg} flex items-center justify-between`}>
                <div>
                    <p className={`text-xs font-bold tracking-wider uppercase opacity-80 ${c.textDark}`}>{title}</p>
                    <h3 className={`text-xl font-bold ${c.textDark} mt-1`}>
                        {stream.replace(/_/g, " ").toUpperCase()}
                    </h3>
                </div>
                <span className="text-3xl filter drop-shadow-sm">{icon}</span>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className={`text-sm font-medium ${c.text} block mb-1`}>Quiz Score</span>
                        <span className={`text-4xl font-bold ${c.textDark}`}>
                            {score.toFixed(1)}%
                        </span>
                    </div>
                    {confidence !== undefined && (
                        <div className="text-right">
                            <span className={`text-xs font-medium ${c.text} block mb-1 opacity-80`}>Confidence</span>
                            <span className={`text-xl font-bold ${c.text}`}>
                                {confidence.toFixed(1)}%
                            </span>
                        </div>
                    )}
                </div>

                {references && (
                    <div className="space-y-5">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <GraduationCap className={`w-4 h-4 ${c.iconColor}`} />
                                <h4 className={`text-sm font-bold ${c.textDark}`}>
                                    Career Opportunities
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {references.careers.slice(0, 3).map((career, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-3 py-1 text-xs font-semibold border rounded-full ${c.badge}`}
                                    >
                                        {career}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className={`w-4 h-4 ${c.iconColor}`} />
                                <h4 className={`text-sm font-bold ${c.textDark}`}>
                                    Resources
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {references.resources.slice(0, 3).map((resource, idx) => (
                                    <a
                                        key={idx}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-start gap-3 p-3 text-xs transition-all rounded-xl ${c.hover} group`}
                                    >
                                        <ExternalLink
                                            className={`flex-shrink-0 w-3.5 h-3.5 mt-0.5 ${c.iconColor} opacity-70 group-hover:opacity-100`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold ${c.textDark}`}>
                                                {resource.title}
                                            </p>
                                            <p className={`${c.text} opacity-80 mt-0.5`}>{resource.type}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
