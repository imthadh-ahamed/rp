'use client';

import { ROADMAP_STEPS } from './constants';

interface QuickNavigationProps {
    expandedStep: number | null;
    scrollToStep: (id: number) => void;
}

export default function QuickNavigation({ expandedStep, scrollToStep }: QuickNavigationProps) {
    return (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 hidden xl:flex flex-col gap-4 z-50">
            {ROADMAP_STEPS.map((step) => (
                <button
                    key={step.id}
                    onClick={() => scrollToStep(step.id)}
                    className="group flex items-center gap-3 justify-end"
                >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap">
                        {step.title}
                    </span>
                    <div
                        className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-white shadow-sm ${expandedStep === step.id ? `${step.color} scale-125` : 'bg-gray-300 group-hover:bg-gray-400'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}
