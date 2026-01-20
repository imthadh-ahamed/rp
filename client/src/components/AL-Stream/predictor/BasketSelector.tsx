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
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {basket.name}
                    <div className="h-px flex-1 bg-slate-200 ml-4"></div>
                </h2>
                <p className="text-slate-500 text-sm mt-1">{basket.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {basket.subjects.map((subject) => {
                    const isSelected = selectedSubject === subject;
                    return (
                        <div
                            key={subject}
                            onClick={() => onSelectSubject(basketKey, subject)}
                            className={`
                                relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group
                                ${isSelected
                                    ? "border-cyan-500 bg-cyan-50/30 ring-2 ring-cyan-100 shadow-md"
                                    : "border-slate-100 bg-white hover:border-cyan-200 hover:shadow-sm"
                                }
                            `}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`font-semibold text-lg ${isSelected ? "text-cyan-700" : "text-slate-700 group-hover:text-cyan-600"}`}>
                                    {subject}
                                </span>
                                {isSelected ? (
                                    <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-cyan-300" />
                                )}
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
                                        className="w-full pl-4 pr-12 py-2.5 bg-white border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                        placeholder="Enter Mark"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
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
