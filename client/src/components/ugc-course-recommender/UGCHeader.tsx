'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UGCHeader() {
    return (
        <div className="mb-8">
            <Link
                href="/dashboard"
                className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors mb-6 group"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    State University Course Selector
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl">
                    Discover eligible UGC programs tailored to your academic profile. Let AI predict the best university courses for you.
                </p>
            </motion.div>
        </div>
    );
}
