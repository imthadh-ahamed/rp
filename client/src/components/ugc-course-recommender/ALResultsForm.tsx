'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export interface ALResultsData {
    stream: string;
    subjects: Array<{
        name: string;
        grade: string;
    }>;
    zScore?: number;
    islandRank?: number;
    districtRank?: number;
}

interface ALResultsFormProps {
    onSubmit: (data: ALResultsData) => void;
    isLoading?: boolean;
}

const streams = ['Physical Science', 'Biological Science', 'Commerce', 'Arts'];

const subjectsByStream: Record<string, string[]> = {
    'Physical Science': ['Physics', 'Chemistry', 'Mathematics', 'Combined Mathematics'],
    'Biological Science': ['Physics', 'Chemistry', 'Biology', 'Combined Mathematics'],
    'Commerce': ['Accounting', 'Business Studies', 'Economics'],
    'Arts': ['History', 'Geography', 'Sinhala Literature', 'English Literature']
};

const grades = ['A', 'B', 'C', 'S', 'F'];

export default function ALResultsForm({ onSubmit, isLoading = false }: ALResultsFormProps) {
    const [formData, setFormData] = useState<ALResultsData>({
        stream: '',
        subjects: [],
        zScore: undefined,
        islandRank: undefined,
        districtRank: undefined,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleStreamChange = (stream: string) => {
        setFormData(prev => ({
            ...prev,
            stream,
            subjects: subjectsByStream[stream].map(name => ({ name, grade: '' }))
        }));
        if (errors.stream) setErrors(prev => ({ ...prev, stream: '' }));
    };

    const handleGradeChange = (subjectIndex: number, grade: string) => {
        setFormData(prev => {
            const newSubjects = [...prev.subjects];
            newSubjects[subjectIndex].grade = grade;
            return { ...prev, subjects: newSubjects };
        });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.stream) {
            newErrors.stream = 'Please select a stream';
        }

        if (!formData.subjects.every(s => s.grade)) {
            newErrors.subjects = 'All subjects must have a grade selected';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">A/L Examination Results</h2>
            <p className="text-gray-600 mb-8">Enter your Advanced Level examination details including stream, subjects, and grades.</p>

            {/* Stream Selection */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    A/L Stream <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.stream}
                    onChange={(e) => handleStreamChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all appearance-none bg-white ${
                        errors.stream
                            ? 'border-red-500 focus:ring-red-200 text-black'
                            : formData.stream ? 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-black' : 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-gray-400'
                    }`}
                >
                    <option value="">Select your stream</option>
                    {streams.map(stream => (
                        <option key={stream} value={stream}>{stream}</option>
                    ))}
                </select>
                {errors.stream && <p className="text-red-500 text-sm mt-2">{errors.stream}</p>}
            </div>

            {/* Subject Grades */}
            {formData.subjects.length > 0 && (
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Subject Grades <span className="text-red-500">*</span>
                    </label>
                    {formData.subjects.map((subject, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700 flex-1">{subject.name}</span>
                            <div className="flex gap-2">
                                {grades.map(grade => (
                                    <button
                                        key={grade}
                                        type="button"
                                        onClick={() => handleGradeChange(idx, grade)}
                                        className={`w-12 h-12 rounded-lg font-bold text-sm transition-all ${
                                            subject.grade === grade
                                                ? 'bg-cyan-500 text-white border-2 border-cyan-600'
                                                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-400'
                                        }`}
                                    >
                                        {grade}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {errors.subjects && <p className="text-red-500 text-sm mt-2">{errors.subjects}</p>}
                </div>
            )}

            {/* Estimated GPA & Ranks */}
            {formData.subjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Z-Score (Optional)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g., 1.50"
                            step="0.01"
                            value={formData.zScore || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                zScore: e.target.value ? parseFloat(e.target.value) : undefined
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 focus:outline-none transition-all placeholder:text-gray-400 text-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Island Rank (Optional)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g., 500"
                            value={formData.islandRank || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                islandRank: e.target.value ? parseInt(e.target.value) : undefined
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 focus:outline-none transition-all placeholder:text-gray-400 text-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            District Rank (Optional)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g., 50"
                            value={formData.districtRank || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                districtRank: e.target.value ? parseInt(e.target.value) : undefined
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 focus:outline-none transition-all placeholder:text-gray-400 text-black"
                        />
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        Next: Career Quiz
                        <ChevronRight className="w-5 h-5" />
                    </>
                )}
            </motion.button>
        </motion.form>
    );
}
