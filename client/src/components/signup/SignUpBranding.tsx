'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function SignUpBranding() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-50 via-cyan-100 to-teal-100 items-center justify-center p-12 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="text-center relative z-10">
        <motion.div
          className="flex justify-center mb-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Image
              src="/AspireAI.png"
              alt="AspireAI Logo"
              width={400}
              height={400}
              priority
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
        
        <motion.p
          className="text-xl font-medium text-gray-700 italic mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          "Shaping your future, smarter"
        </motion.p>
        
        <motion.h2
          className="text-3xl font-semibold text-gray-800 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Join Us Today!
        </motion.h2>
        
        <motion.p
          className="text-gray-600 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Create an account and start your journey
        </motion.p>
      </div>
    </div>
  );
}
