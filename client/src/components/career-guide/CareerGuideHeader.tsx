'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CareerGuideHeader() {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => router.push('/milestones')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <User className="w-4 h-4" />
          <span>Student Profile</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3">
          Career Guide for Non-Traditional Students
        </h1>
        <p className="text-gray-600 text-lg">
          Explore alternative education and career pathways that match your unique journey
        </p>
      </motion.div>
    </div>
  );
}
