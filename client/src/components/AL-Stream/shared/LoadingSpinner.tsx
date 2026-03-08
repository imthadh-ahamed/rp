"use client";
import React from "react";
import { LoadingSpinnerProps } from "../../../types/predictor.types";

export default function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="relative w-16 h-16 mx-auto">
                    {/* Outer pulsing ring */}
                    <div className="absolute inset-0 border-4 border-cyan-200 rounded-full animate-pulse"></div>

                    {/* Spinning gradient ring */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-cyan-600 border-r-teal-600 rounded-full animate-spin"></div>

                    {/* Inner pulsing dot */}
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full"></div>
                </div>
                <p className="mt-6 text-gray-700 font-medium animate-pulse">{message}</p>
            </div>
        </div>
    );
}
