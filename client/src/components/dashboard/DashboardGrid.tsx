'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const gridItems = [
  {
    emoji: "🎓",
    title: "A/L Stream Guidance",
    description: "Analyze O/L results to recommend the best stream.",
    buttonText: "Explore",
    href: "#"
  },
  {
    emoji: "🏛️",
    title: "State University Course Selector",
    description: "Predict top 15 UGC programs using AI.",
    buttonText: "Explore",
    href: "#"
  },
  {
    emoji: "🚀",
    title: "Career Guide for Non-Traditional Students",
    description: "Show alternative education options.",
    buttonText: "Explore",
    href: "/career-guide"
  },
  {
    emoji: "💡",
    title: "Soft Skill Developer",
    description: "Assess and enhance communication, leadership, teamwork skills.",
    buttonText: "Explore",
    href: "#"
  }
];

export default function DashboardGrid() {
  const router = useRouter();

  const handleCardClick = (href: string) => {
    if (href !== '#') {
      router.push(href);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {gridItems.map((item, idx) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group"
        >
          <div 
            className="h-full rounded-2xl bg-white shadow-md hover:shadow-xl border border-gray-100 p-6 transition-all cursor-pointer"
            onClick={() => handleCardClick(item.href)}
          >
            {/* Header with emoji */}
            <div className="flex justify-between items-start mb-4">
              <div className="text-5xl">{item.emoji}</div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {item.description}
            </p>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(item.href);
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium text-sm hover:from-cyan-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md"
            >
              {item.buttonText}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
