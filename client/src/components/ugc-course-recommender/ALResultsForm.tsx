'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export interface ALResultsData {
    stream: string;
    subjects: Array<{
        name: string;
        code: number;
        grade: string;
    }>;
    olLanguage: 'Sinhala' | 'Tamil';
    olResults: Array<{
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

const streams = ['Physical Science', 'Biological Science', 'Commerce', 'Arts', 'Engineering Technology', 'Bio Technology'];

const allSubjects: Record<number, string> = {
    1: 'Physics',
    2: 'Chemistry',
    7: 'Mathematics',
    8: 'Agricultural Science',
    9: 'Biology',
    10: 'Combined Mathematics',
    11: 'Higher Mathematics',
    13: 'General English',
    14: 'Civil Technology',
    15: 'Mechanical Technology',
    16: 'Electrical',
    17: 'Food Technology',
    18: 'Agro Technology',
    19: 'Bio Resource Technology',
    20: 'Information & Communication Technology (ICT)',
    21: 'Economics',
    22: 'Geography',
    23: 'Political Science',
    24: 'Logic & Scientific Method',
    25: 'History of India',
    26: 'History of Europe',
    27: 'History of Modern World',
    28: 'Home Economics',
    29: 'Communication & Media Studies',
    31: 'Business Statistics',
    32: 'Business Studies',
    33: 'Accounting',
    41: 'Buddhism',
    42: 'Hinduism',
    43: 'Christianity',
    44: 'Islam',
    45: 'Buddhist Civilization',
    46: 'Hindu Civilization',
    47: 'Islamic Civilization',
    48: 'Greek & Roman Civilization',
    49: 'Christian Civilization',
    51: 'Art',
    52: 'Dancing (Indigenous)',
    53: 'Dancing (Bharatha)',
    54: 'Oriental Music',
    55: 'Carnatic Music',
    56: 'Western Music',
    57: 'Drama & Theatre (Sinhala)',
    58: 'Drama & Theatre (Tamil)',
    59: 'Drama & Theatre (English)',
    65: 'Engineering Technology',
    66: 'Bio Systems Technology',
    67: 'Science for Technology',
    71: 'Sinhala Language',
    72: 'Tamil Language',
    73: 'English (Subject)',
    74: 'Pali',
    75: 'Sanskrit',
    78: 'Arabic',
    79: 'Malay',
    81: 'French',
    82: 'German',
    83: 'Russian',
    84: 'Hindi',
    86: 'Chinese',
    87: 'Japanese',
    88: 'Korean'
};

// Available subjects for dropdown selection by stream
const availableSubjectsByStream: Record<string, Array<{ code: number; name: string }>> = {
    'Physical Science': [
        { code: 1, name: 'Physics' },
        { code: 2, name: 'Chemistry' },
        { code: 7, name: 'Mathematics' },
        { code: 10, name: 'Combined Mathematics' },
        { code: 11, name: 'Higher Mathematics' },
        { code: 13, name: 'General English' },
        { code: 20, name: 'Information & Communication Technology (ICT)' },
        { code: 24, name: 'Logic & Scientific Method' },
        { code: 67, name: 'Science for Technology' }
    ],
    'Biological Science': [
        { code: 1, name: 'Physics' },
        { code: 2, name: 'Chemistry' },
        { code: 9, name: 'Biology' },
        { code: 8, name: 'Agricultural Science' },
        { code: 10, name: 'Combined Mathematics' },
        { code: 13, name: 'General English' },
        { code: 20, name: 'Information & Communication Technology (ICT)' },
        { code: 67, name: 'Science for Technology' }
    ],
    'Commerce': [
        { code: 33, name: 'Accounting' },
        { code: 32, name: 'Business Studies' },
        { code: 21, name: 'Economics' },
        { code: 31, name: 'Business Statistics' },
        { code: 7, name: 'Mathematics' },
        { code: 10, name: 'Combined Mathematics' },
        { code: 13, name: 'General English' },
        { code: 29, name: 'Communication & Media Studies' }
    ],
    'Arts': [
        { code: 71, name: 'Sinhala Language' },
        { code: 72, name: 'Tamil Language' },
        { code: 73, name: 'English (Subject)' },
        { code: 22, name: 'Geography' },
        { code: 23, name: 'Political Science' },
        { code: 25, name: 'History of India' },
        { code: 26, name: 'History of Europe' },
        { code: 27, name: 'History of Modern World' },
        { code: 24, name: 'Logic & Scientific Method' },
        { code: 28, name: 'Home Economics' },
        { code: 29, name: 'Communication & Media Studies' },
        { code: 41, name: 'Buddhism' },
        { code: 42, name: 'Hinduism' },
        { code: 43, name: 'Christianity' },
        { code: 44, name: 'Islam' },
        { code: 45, name: 'Buddhist Civilization' },
        { code: 46, name: 'Hindu Civilization' },
        { code: 47, name: 'Islamic Civilization' },
        { code: 48, name: 'Greek & Roman Civilization' },
        { code: 49, name: 'Christian Civilization' },
        { code: 51, name: 'Art' },
        { code: 52, name: 'Dancing (Indigenous)' },
        { code: 53, name: 'Dancing (Bharatha)' },
        { code: 54, name: 'Oriental Music' },
        { code: 55, name: 'Carnatic Music' },
        { code: 56, name: 'Western Music' },
        { code: 57, name: 'Drama & Theatre (Sinhala)' },
        { code: 58, name: 'Drama & Theatre (Tamil)' },
        { code: 59, name: 'Drama & Theatre (English)' },
        { code: 74, name: 'Pali' },
        { code: 75, name: 'Sanskrit' },
        { code: 78, name: 'Arabic' },
        { code: 79, name: 'Malay' },
        { code: 81, name: 'French' },
        { code: 82, name: 'German' },
        { code: 83, name: 'Russian' },
        { code: 84, name: 'Hindi' },
        { code: 86, name: 'Chinese' },
        { code: 87, name: 'Japanese' },
        { code: 88, name: 'Korean' }
    ],
    'Engineering Technology': [
        { code: 1, name: 'Physics' },
        { code: 2, name: 'Chemistry' },
        { code: 7, name: 'Mathematics' },
        { code: 14, name: 'Civil Technology' },
        { code: 15, name: 'Mechanical Technology' },
        { code: 16, name: 'Electrical' },
        { code: 13, name: 'General English' },
        { code: 20, name: 'Information & Communication Technology (ICT)' },
        { code: 67, name: 'Science for Technology' }
    ],
    'Bio Technology': [
        { code: 1, name: 'Physics' },
        { code: 2, name: 'Chemistry' },
        { code: 9, name: 'Biology' },
        { code: 8, name: 'Agricultural Science' },
        { code: 18, name: 'Agro Technology' },
        { code: 19, name: 'Bio Resource Technology' },
        { code: 66, name: 'Bio Systems Technology' },
        { code: 13, name: 'General English' },
        { code: 67, name: 'Science for Technology' }
    ]
};

const olSubjects = [
    { name: 'Sinhala/Tamil', key: 'sinhala' },
    { name: 'English', key: 'english' },
    { name: 'Maths', key: 'maths' },
    { name: 'Science', key: 'science' }
];

const grades = ['A', 'B', 'C', 'S', 'F'];

export default function ALResultsForm({ onSubmit, isLoading = false }: ALResultsFormProps) {
    const [formData, setFormData] = useState<ALResultsData>({
        stream: '',
        subjects: [],
        olLanguage: 'Sinhala',
        olResults: [
            { name: 'Sinhala Language', grade: '' },
            { name: 'English', grade: '' },
            { name: 'Maths', grade: '' },
            { name: 'Science', grade: '' }
        ],
        zScore: undefined,
        islandRank: undefined,
        districtRank: undefined,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleStreamChange = (stream: string) => {
        setFormData(prev => ({
            ...prev,
            stream,
            subjects: []
        }));
        if (errors.stream) setErrors(prev => ({ ...prev, stream: '' }));
    };

    const handleLanguageChange = (language: 'Sinhala' | 'Tamil') => {
        setFormData(prev => {
            const newOLResults = [...prev.olResults];
            newOLResults[0] = { name: `${language} Language`, grade: '' };
            return {
                ...prev,
                olLanguage: language,
                olResults: newOLResults
            };
        });
    };

    const handleSubjectSelect = (index: number, subjectCode: number) => {
        const subject = availableSubjectsByStream[formData.stream]?.find(s => s.code === subjectCode);
        if (subject) {
            setFormData(prev => {
                const newSubjects = [...prev.subjects];
                newSubjects[index] = { ...subject, grade: '' };
                return { ...prev, subjects: newSubjects };
            });
        }
    };

    const handleGradeChange = (subjectIndex: number, grade: string) => {
        setFormData(prev => {
            const newSubjects = [...prev.subjects];
            newSubjects[subjectIndex].grade = grade;
            return { ...prev, subjects: newSubjects };
        });
    };

    const handleOLGradeChange = (olIndex: number, grade: string) => {
        setFormData(prev => {
            const newOLResults = [...prev.olResults];
            newOLResults[olIndex].grade = grade;
            return { ...prev, olResults: newOLResults };
        });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.stream) {
            newErrors.stream = 'Please select a stream';
        }

        if (formData.subjects.length < 3) {
            newErrors.subjects = 'Please select 3 subjects';
        }

        if (!formData.subjects.every((s: any) => s.grade)) {
            newErrors.subjects = 'All A/L subjects must have a grade selected';
        }

        if (!formData.olLanguage) {
            newErrors.olLanguage = 'Please select a language (Sinhala or Tamil)';
        }

        if (!formData.olResults.every((s: any) => s.grade)) {
            newErrors.olResults = 'All O/L subjects must have a grade selected';
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

            {/* A/L Subject Selection and Grades */}
            {formData.stream && (
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Select 3 A/L Subjects <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-600 mb-4">Choose exactly 3 subjects from the available options for {formData.stream}</p>
                    
                    {/* Subject Selection Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[0, 1, 2].map((idx) => (
                            <div key={idx}>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Subject {idx + 1}
                                </label>
                                <select
                                    value={formData.subjects[idx]?.code || ''}
                                    onChange={(e) => handleSubjectSelect(idx, parseInt(e.target.value))}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all appearance-none bg-white text-sm ${
                                        errors.subjects && !formData.subjects[idx]
                                            ? 'border-red-500 focus:ring-red-200'
                                            : formData.subjects[idx] ? 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-black' : 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-gray-400'
                                    }`}
                                >
                                    <option value="">Select subject</option>
                                    {availableSubjectsByStream[formData.stream]?.map(subject => (
                                        <option key={subject.code} value={subject.code}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Subject Grades */}
                    {formData.subjects.length === 3 && formData.subjects.every((s: any) => s.code) && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Subject Grades</h3>
                            {formData.subjects.map((subject: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-700">{subject.name}</span>
                                        <span className="ml-2 text-sm text-gray-500">Code: {subject.code}</span>
                                    </div>
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
                        </div>
                    )}

                    {errors.subjects && <p className="text-red-500 text-sm mt-2">{errors.subjects}</p>}
                </div>
            )}

            {/* O/L Results Section */}
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    O/L Results <span className="text-red-500">*</span>
                </label>

                {/* Language Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Language <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => handleLanguageChange('Sinhala')}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                                formData.olLanguage === 'Sinhala'
                                    ? 'bg-cyan-500 text-white border-2 border-cyan-600'
                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-400'
                            }`}
                        >
                            Sinhala
                        </button>
                        <button
                            type="button"
                            onClick={() => handleLanguageChange('Tamil')}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                                formData.olLanguage === 'Tamil'
                                    ? 'bg-cyan-500 text-white border-2 border-cyan-600'
                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-400'
                            }`}
                        >
                            Tamil
                        </button>
                    </div>
                    {errors.olLanguage && <p className="text-red-500 text-sm mt-2">{errors.olLanguage}</p>}
                </div>

                {/* O/L Subject Grades */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                        O/L Subjects
                    </h3>
                    {/* All O/L Subjects */}
                    {[
                        { name: `${formData.olLanguage} Language`, idx: 0 },
                        { name: 'English', idx: 1 },
                        { name: 'Maths', idx: 2 },
                        { name: 'Science', idx: 3 }
                    ].map((subject: any) => (
                        <div key={subject.idx} className="flex items-center justify-between gap-4 mb-4 p-4 bg-white rounded-lg">
                            <span className="font-medium text-gray-700 flex-1">{subject.name}</span>
                            <div className="flex gap-2">
                                {grades.map(grade => (
                                    <button
                                        key={grade}
                                        type="button"
                                        onClick={() => {
                                            if (subject.idx === 0) {
                                                // Language subject
                                                const languageSubjectName = `${formData.olLanguage} Language`;
                                                setFormData(prev => {
                                                    const newOLResults = [...prev.olResults];
                                                    newOLResults[0] = { name: languageSubjectName, grade: grade };
                                                    return { ...prev, olResults: newOLResults };
                                                });
                                            } else {
                                                // Other subjects
                                                handleOLGradeChange(subject.idx, grade);
                                            }
                                        }}
                                        className={`w-12 h-12 rounded-lg font-bold text-sm transition-all ${
                                            formData.olResults[subject.idx]?.grade === grade
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
                </div>
                {errors.olResults && <p className="text-red-500 text-sm mt-4">{errors.olResults}</p>}
            </div>

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
