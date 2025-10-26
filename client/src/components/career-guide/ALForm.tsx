'use client';

import { motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface ALFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function ALForm({ isOpen, onClose, onBack }: ALFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    alYear: '',
    stream: '',
    subjects: '',
    zScore: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('A/L Form Data:', formData);
    // Handle form submission
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Options</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            A/L Assessment Form
          </h2>
          <p className="text-gray-600">
            Please provide your A/Level information for personalized career guidance
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* A/L Year */}
          <div>
            <label htmlFor="alYear" className="block text-sm font-semibold text-gray-700 mb-2">
              A/L Completed Year
            </label>
            <input
              type="text"
              id="alYear"
              name="alYear"
              value={formData.alYear}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g., 2024"
            />
          </div>

          {/* Stream */}
          <div>
            <label htmlFor="stream" className="block text-sm font-semibold text-gray-700 mb-2">
              Stream
            </label>
            <select
              id="stream"
              name="stream"
              value={formData.stream}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Select your stream</option>
              <option value="physical-science">Physical Science</option>
              <option value="biological-science">Biological Science</option>
              <option value="commerce">Commerce</option>
              <option value="arts">Arts</option>
              <option value="technology">Technology</option>
            </select>
          </div>

          {/* Subjects */}
          <div>
            <label htmlFor="subjects" className="block text-sm font-semibold text-gray-700 mb-2">
              Subjects
            </label>
            <textarea
              id="subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="List your A/L subjects"
            />
          </div>

          {/* Z-Score */}
          <div>
            <label htmlFor="zScore" className="block text-sm font-semibold text-gray-700 mb-2">
              Z-Score (Optional)
            </label>
            <input
              type="text"
              id="zScore"
              name="zScore"
              value={formData.zScore}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g., 1.8524"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
            >
              Submit Assessment
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
