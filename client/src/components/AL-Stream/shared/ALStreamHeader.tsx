"use client";

import { motion } from "framer-motion";

interface ALStreamHeaderProps {
    title?: string;
    subtitle?: string;
}

export default function ALStreamHeader({
    title = "A/L Stream Guidance",
    subtitle = "Analyze O/L results to recommend the best stream"
}: ALStreamHeaderProps) {
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
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">🎓</span>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                {title}
                            </h1>
                        </div>
                        <p className="text-cyan-50 text-lg md:text-xl font-medium">
                            {subtitle}
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
