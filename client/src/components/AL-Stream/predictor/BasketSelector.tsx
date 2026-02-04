import React from "react";
import { BasketSelectorProps } from "../../../types/predictor.types";
import { CheckCircle2, Circle } from "lucide-react";

export default function BasketSelector({
    basket,
    basketKey,
    selectedSubject,
    onSelectSubject,
    formData,
    onMarkChange,
    color,
}: BasketSelectorProps) {
    // We'll use a consistent teal theme for all, but maybe slight variations if needed.
    // For professional look, unified accent color is often better than rainbow.
    // Let's stick to the primary cyan/teal brand.

    return (
        <div className="mb-10">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full"></div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                        {basket.name}
                    </h2>
                </div>
                <p className="text-slate-600 text-sm ml-5">{basket.description}</p>
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {basket.subjects.map((subject) => {
                    const isSelected = selectedSubject === subject;
                    return (
                        <div
                            key={subject}
                            onClick={() => onSelectSubject(basketKey, subject)}
                            className={`
                                group relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                                ${isSelected
                                    ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-teal-50 shadow-lg shadow-cyan-100"
                                    : "border-slate-200 bg-white hover:border-cyan-300 hover:shadow-md"
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-xl"></div>
                            )}

                            <div className="relative flex items-center justify-between mb-3">
                                <span className={`font-bold text-base sm:text-lg ${isSelected ? "text-cyan-700" : "text-slate-700 group-hover:text-cyan-600"}`}>
                                    {subject}
                                </span>
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-cyan-600 bg-cyan-600" : "border-slate-300 group-hover:border-cyan-400"
                                    }`}>
                                    {isSelected && (
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    )}
                                </div>
                            </div>

                            <div className={`
                                overflow-hidden transition-all duration-300 ease-in-out
                                ${isSelected ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"}
                            `}>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData[subject] || ""}
                                        onChange={(e) => onMarkChange(subject, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full pl-4 pr-12 py-2.5 sm:py-3 bg-white border-2 border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300 text-base"
                                        placeholder="Enter Mark"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                        /100
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
