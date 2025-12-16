'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/BG.png"
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Floating Background Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl animate-pulse z-[1]"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000 z-[1]"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-300/15 rounded-full blur-2xl z-[1]"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 p-8 max-w-5xl mx-auto">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.div 
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/AspireAI.png"
              alt="AspireAI Logo"
              width={250}
              height={250}
              priority
              className="drop-shadow-2xl"
            />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2"
          >
            Empowering every student with intelligent, personalized career guidance
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover your best A/L stream, university course, and career path — powered by AI.
          </motion.p>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex gap-6 items-center justify-center flex-col sm:flex-row">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-10 py-4 font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-2xl text-center inline-block"
              >
                Sign In
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto rounded-xl border-2 border-cyan-500 text-cyan-600 px-10 py-4 font-semibold hover:bg-cyan-50 hover:border-cyan-600 hover:shadow-lg transition-all duration-300 text-center inline-block"
              >
                Create Account
              </Link>
            </motion.div>
          </div>

          {/* Progressive Callout */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-base text-gray-600 flex items-center justify-center"
          >
            <span className="text-xl">💡</span>
            <span>New here? Start your AI-powered journey today.</span>
          </motion.p>
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12 max-w-4xl mx-auto"
        >
          {[
            { emoji: "🎓", text: "A/L Stream Guidance", link:"#" },
            { emoji: "🏛️", text: "University Selection", link:"#" },
            { emoji: "🚀", text: "Career Pathways", link:"#" },
            { emoji: "💡", text: "Skill Development", link:"/skill-development" }
          ].map((feature, idx) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-xl transition-all border border-cyan-100"
            >
              <a href={feature.link} className="flex flex-col items-center space-y-2">
              <div className="text-3xl mb-2">{feature.emoji}</div>
              <p className="text-sm font-medium text-gray-700">{feature.text}</p>

              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        {/* <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-cyan-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
}

