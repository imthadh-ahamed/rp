'use client';

import { motion } from 'framer-motion';

export default function IntroductionSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-6 mb-8 border border-cyan-100"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-3">🌟 Your Path, Your Choice</h2>
      <p className="text-gray-700 leading-relaxed">
        Not everyone follows the traditional university route, and that&apos;s perfectly okay! 
        Whether you&apos;re looking for practical skills, flexible learning, or want to start your own business, 
        there are numerous pathways to a successful career. This guide will help you explore options that 
        align with your goals, interests, and circumstances.
      </p>
    </motion.div>
  );
}
