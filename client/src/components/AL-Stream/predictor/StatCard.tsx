import React from "react";
import { StatCardProps } from "../../../types/predictor.types";

export default function StatCard({ label, value, highlight = false }: StatCardProps) {
    return (
        <div className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-md ${highlight
            ? "bg-white border-cyan-200 shadow-sm ring-1 ring-cyan-100"
            : "bg-white border-slate-200 hover:border-slate-300"
            }`}>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold tracking-tight ${highlight ? "text-cyan-600" : "text-slate-800"
                }`}>
                {typeof value === 'number' ? value.toFixed(2) : value}%
            </p>
        </div>
    );
}
