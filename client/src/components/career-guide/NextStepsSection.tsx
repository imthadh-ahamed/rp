'use client';

import { motion } from 'framer-motion';

export default function NextStepsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl p-8 text-white mb-8"
    >
      <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="mb-6 text-cyan-50">
        Take our personalized assessment to discover which alternative pathway suits you best. 
        We&apos;ll analyze your interests, skills, and goals to provide customized recommendations.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-cyan-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
      >
        Start Assessment
      </motion.button>
    </motion.div>
  );
}
