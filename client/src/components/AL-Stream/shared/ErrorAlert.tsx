import React from "react";
import { AlertCircle } from "lucide-react";
import { ErrorAlertProps } from "../../../types/predictor.types";

export default function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="relative overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl shadow-lg">
                {/* Animated background pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-100/20 to-transparent animate-pulse"></div>

                <div className="relative flex items-start gap-3 p-4">
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="p-1 bg-red-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-red-800 mb-0.5">Error</p>
                        <p className="text-sm text-red-700 leading-relaxed">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
