'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CourseSuggestionHeader() {
    return (
        <div className="mb-8">
            <Link
                href="/career-guide"
                className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6 group"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Career Guide</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Recommended Courses for You
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl">
                    Based on your profile and preferences, we've curated a list of courses that align with your career goals.
                </p>
            </motion.div>
        </div>
    );
}
