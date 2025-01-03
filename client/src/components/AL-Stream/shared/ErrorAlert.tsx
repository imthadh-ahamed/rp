import React from "react";
import { AlertCircle } from "lucide-react";
import { ErrorAlertProps } from "../../../types/predictor.types";

export default function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <div className="flex items-start gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="font-medium text-red-800">Error</p>
                <p className="mt-1 text-sm text-red-700">{message}</p>
            </div>
        </div>
    );
}
