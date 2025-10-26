'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, BookOpen } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssessmentModal({ isOpen, onClose }: AssessmentModalProps) {
  const handleOptionClick = (option: string) => {
    console.log('Selected option:', option);
    // Handle navigation or further actions here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Start Your Assessment
                </h2>
                <p className="text-gray-600">
                  Please select your educational background to get personalized career recommendations
                </p>
              </div>

              {/* Grid Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: O/L passed without A/L */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick('ol-only')}
                  className="cursor-pointer group"
                >
                  <div className="h-full bg-gradient-to-br from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 rounded-xl p-6 border-2 border-cyan-200 hover:border-cyan-400 transition-all">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        O/L Passed Without A/L
                      </h3>
                      <p className="text-sm text-gray-600">
                        For students who completed O/Level but haven&apos;t taken A/Levels
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Option 2: Sat A/L or With A/L results */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick('al-completed')}
                  className="cursor-pointer group"
                >
                  <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Sat A/L or With A/L Results
                      </h3>
                      <p className="text-sm text-gray-600">
                        For students who have taken A/Levels or have A/Level results
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Footer Note */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Select the option that best describes your current educational status
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
