'use client';

import { motion } from 'framer-motion';
import { Briefcase, Rocket, Target } from 'lucide-react';

export default function ExplanationSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-8 md:p-12 text-white text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why this roadmap works?</h2>
                <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                    This isn't just a curriculum; it's a career acceleration engine designed to bridge the gap between education and employment.
                </p>
            </div>

            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                        <Target className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Holistic Development</h3>
                    <p className="text-gray-600 leading-relaxed">
                        We move beyond theory. By integrating practical skills, soft skills, and industry awareness, we shape well-rounded professionals ready for any challenge.
                    </p>
                </div>

                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Real-world Application</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Every stage is designed with the job market in mind. From internships to portfolio building, you're constantly proving your value to future employers.
                    </p>
                </div>

                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600">
                        <Rocket className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Future-Proofing</h3>
                    <p className="text-gray-600 leading-relaxed">
                        The "Knowledge Expansion" and "Industry Polishing" stages ensure you remain adaptable and relevant in a rapidly evolving tech landscape.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
