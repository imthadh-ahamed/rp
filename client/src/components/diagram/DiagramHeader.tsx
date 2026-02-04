'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Roadmap } from '@/types/diagram.types';

interface DiagramHeaderProps {
    roadmap?: Roadmap | null;
}

export default function DiagramHeader({ roadmap }: DiagramHeaderProps) {
    return (
        <div className="mb-16 text-center">
            <Link
                href="/course-suggestion"
                className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-8 group"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Courses</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {roadmap?.courseName ? (
                        <>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                {roadmap.courseName}
                            </span>
                        </>
                    ) : (
                        <>
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">"Learn-to-Earn"</span> Pathway
                        </>
                    )}
                </h1>
                {roadmap?.university && (
                    <p className="text-lg text-gray-600 mb-3 font-medium">
                        {roadmap.university}
                    </p>
                )}
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {roadmap?.careerGoal ? (
                        <>
                            A strategic roadmap to achieve your career goal: <span className="font-semibold text-purple-600">{roadmap.careerGoal}</span>
                        </>
                    ) : (
                        'A strategic, step-by-step roadmap designed to transform you from a beginner into a highly employable professional.'
                    )}
                </p>
            </motion.div>
        </div>
    );
}
