"use client"

import { RootState } from "@/redux/store";
import { CurrentUser } from "@/types/currentUser";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function WelcomeSection() {
  const user = useSelector((state: RootState) => state.user.userData) as CurrentUser | null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl shadow-lg p-7 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-cyan-50 text-lg md:text-xl font-medium mb-3">
              Let's shape your future smarter.
            </p>
            <p className="text-white/90 text-base md:text-lg max-w-3xl leading-relaxed">
              🌟 Your journey to the right career path starts here — explore your academic strengths, discover opportunities, and unlock your full potential with AspireAI.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
