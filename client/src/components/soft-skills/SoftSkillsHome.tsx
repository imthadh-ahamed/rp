"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const skills = [
  {
    emoji: "🎙️",
    title: "Communication Skills",
    description:
      "AI-powered voice assessment. Answer 4 questions verbally and get scored on clarity, vocabulary, fluency, structure, and confidence.",
    questions: 4,
    duration: "15 min",
    type: "Speaking",
    href: "/soft-skills/communication",
    color: "from-indigo-500 to-violet-600",
    badge: "Top Skill",
  },
  {
    emoji: "🧠",
    title: "Problem Solving Skill",
    description:
      "15-question Likert scale survey assessing your logical, analytical, and critical problem-solving abilities.",
    questions: 15,
    duration: "15 min",
    type: "Choice",
    href: "/soft-skills/problem-solving",
    color: "from-sky-500 to-blue-600",
    badge: "Top #2",
  },
  {
    emoji: "✍️",
    title: "Critical Thinking Skill",
    description:
      "Essay-based evaluation to assess your depth of reasoning, argumentation, and analytical thinking skills.",
    questions: 5,
    duration: "15 min",
    type: "Essay",
    href: "/soft-skills/critical-thinking",
    color: "from-emerald-500 to-teal-600",
    badge: "Top #3",
  },
];

export default function SoftSkillsHome() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
          <span className="text-cyan-600 text-xs font-medium tracking-wide uppercase">
            Soft Skill Developer
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
          Assess & Enhance Your Soft Skills
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
          Sri Lanka&apos;s AI-powered platform to evaluate communication, problem
          solving, and critical thinking skills — with personalized learning
          recommendations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skills.map((skill, idx) => (
          <motion.div
            key={skill.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => router.push(skill.href)}
            className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all"
          >
            <div className={`h-2 w-full bg-gradient-to-r ${skill.color}`} />
            <div className="p-6 space-y-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${skill.color}`}
              >
                {skill.badge}
              </span>
              <div>
                <div className="text-4xl mb-2">{skill.emoji}</div>
                <h3 className="font-bold text-lg text-gray-900">{skill.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                  {skill.description}
                </p>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-100 pt-4">
                <div className="text-center">
                  <p className="font-bold text-gray-800">{skill.questions}</p>
                  <p className="text-gray-400 text-xs">Questions</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">{skill.duration}</p>
                  <p className="text-gray-400 text-xs">Duration</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">{skill.type}</p>
                  <p className="text-gray-400 text-xs">Test Type</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r ${skill.color} shadow-sm hover:shadow-md transition-all`}
              >
                Start Evaluation
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
