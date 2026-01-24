'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Flag, Library, ListTodo, Trophy, ExternalLink } from 'lucide-react';
import { useRef } from 'react';
import { ROADMAP_STEPS } from './constants';

interface VisualRoadmapProps {
    expandedStep: number | null;
    toggleStep: (id: number) => void;
}

export default function VisualRoadmap({ expandedStep, toggleStep }: VisualRoadmapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="relative mb-24" ref={containerRef}>
            {/* Background Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 rounded-full transform md:-translate-x-1/2" />

            {/* Animated Progress Line */}
            <motion.div
                style={{ scaleY }}
                className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 via-pink-600 to-purple-600 origin-top rounded-full transform md:-translate-x-1/2 z-0"
            />

            <div className="space-y-12 md:space-y-24">
                {ROADMAP_STEPS.map((step, index) => {
                    const isEven = index % 2 === 0;
                    const isExpanded = expandedStep === step.id;

                    return (
                        <motion.div
                            key={step.id}
                            id={`step-${step.id}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Content Side */}
                            <div className={`flex-1 w-full md:w-1/2 pl-20 ${isEven ? 'md:pl-24 md:pr-6' : 'md:pr-24 md:pl-6'}`}>
                                <div
                                    className={`bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 relative overflow-hidden group ${isExpanded ? 'ring-2 ring-purple-500 ring-offset-2' : 'hover:shadow-2xl hover:-translate-y-1'
                                        }`}
                                >
                                    {/* Top Accent */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${step.color}`} />

                                    <div className="p-6 md:p-8">
                                        {/* Header Section */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${step.lightColor} ${step.textColor} text-sm font-semibold`}>
                                                <Flag className="w-4 h-4" />
                                                Goal: {step.goal}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                                <Clock className="w-4 h-4" />
                                                {step.duration}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {step.description}
                                        </p>

                                        {/* Expand/Collapse Button */}
                                        <button
                                            onClick={() => toggleStep(step.id)}
                                            className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors mb-2"
                                        >
                                            {isExpanded ? (
                                                <>
                                                    <ChevronUp className="w-4 h-4" />
                                                    Hide Details
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-4 h-4" />
                                                    Show Action Plan & Resources
                                                </>
                                            )}
                                        </button>

                                        {/* Detailed Sections (Accordion) */}
                                        <motion.div
                                            initial={false}
                                            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-6 space-y-6 border-t border-gray-100 mt-4">
                                                {/* Action Plan */}
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                                                        <ListTodo className="w-4 h-4 text-purple-600" />
                                                        Action Plan
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {step.actionPlan.map((action, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${step.color} mt-1.5 flex-shrink-0`} />
                                                                {action}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Resources & Success Criteria Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {/* Resources */}
                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                                                            <Library className="w-4 h-4 text-blue-600" />
                                                            Resources
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {step.resources.map((resource, i) => (
                                                                <li key={i} className="text-gray-600 text-sm">
                                                                    <a
                                                                        href={resource.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1 hover:text-blue-600 hover:underline transition-colors group"
                                                                    >
                                                                        • {resource.title}
                                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Success Criteria */}
                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                                                            <Trophy className="w-4 h-4 text-yellow-600" />
                                                            Success Criteria
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {step.successCriteria.map((criteria, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                                    {criteria}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Center Icon */}
                            <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center mt-8 md:mt-0">
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${step.color} border-4 border-white shadow-lg flex items-center justify-center z-10 transition-transform duration-300 ${isExpanded ? 'scale-110' : ''}`}>
                                    <step.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </div>
                            </div>

                            {/* Empty Side for Balance */}
                            <div className="flex-1 hidden md:block" />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
