"use client";
import React from "react";
import { LoadingSpinnerProps } from "../../../types/predictor.types";

export default function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="w-12 h-12 mx-auto border-b-2 border-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">{message}</p>
            </div>
        </div>
    );
}
