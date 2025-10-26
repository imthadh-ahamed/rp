'use client';

import { motion } from 'framer-motion';

const successStories = [
  {
    name: "Chaminda Silva",
    path: "Vocational Training → Software Developer",
    story: "After completing a coding bootcamp, I landed my dream job at a tech company within 6 months.",
    avatar: "👨‍💻"
  },
  {
    name: "Nishantha Perera",
    path: "Online Courses → Digital Marketer",
    story: "I learned digital marketing through online courses while working full-time. Now I run my own agency.",
    avatar: "👩‍💼"
  },
  {
    name: "Kasun Fernando",
    path: "Apprenticeship → Master Electrician",
    story: "Started as an apprentice, now I own my electrical contracting business with 10 employees.",
    avatar: "⚡"
  }
];

export default function SuccessStories() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {successStories.map((story, idx) => (
          <motion.div
            key={story.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
          >
            <div className="text-5xl mb-4">{story.avatar}</div>
            <h3 className="font-bold text-gray-900 mb-1">{story.name}</h3>
            <p className="text-sm text-cyan-600 font-medium mb-3">{story.path}</p>
            <p className="text-sm text-gray-600 italic">&quot;{story.story}&quot;</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
