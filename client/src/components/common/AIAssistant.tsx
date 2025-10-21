'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Assistant Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white text-2xl cursor-pointer transition-all"
        aria-label="AI Assistant"
      >
        <span className="text-3xl">🤖</span>
      </motion.button>

      {/* Assistant Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤖</span>
              <h3 className="font-bold text-gray-900">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
              <p className="text-sm text-cyan-900">
                👋 Hi! I'm here to help you navigate your career journey. Ask me anything about:
              </p>
            </div>

            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span>Your progress and next steps</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span>Module recommendations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span>Career guidance insights</span>
              </li>
            </ul>

            <button className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium text-sm hover:from-cyan-600 hover:to-teal-600 transition-all shadow-sm">
              Start Chat
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
