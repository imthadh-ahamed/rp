'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
    steps: string[];
    currentStep: number;
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
    return (
        <div className="mb-12">
            <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center flex-1">
                        {/* Circle */}
                        <motion.div
                            animate={{
                                scale: idx === currentStep ? 1.1 : 1,
                                boxShadow: idx <= currentStep ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none'
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all flex-shrink-0 ${
                                idx < currentStep
                                    ? 'bg-green-500 text-white'
                                    : idx === currentStep
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            {idx < currentStep ? '✓' : idx + 1}
                        </motion.div>

                        {/* Label */}
                        <span
                            className={`ml-3 text-sm font-medium whitespace-nowrap ${
                                idx <= currentStep ? 'text-gray-900' : 'text-gray-500'
                            }`}
                        >
                            {step}
                        </span>

                        {/* Connector Line */}
                        {idx < steps.length - 1 && (
                            <motion.div
                                animate={{
                                    backgroundColor: idx < currentStep ? '#22c55e' : '#d1d5db'
                                }}
                                className={`h-1 flex-1 mx-3 rounded-full ${
                                    idx < currentStep ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
