'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface StudentInfoFormProps {
    onSubmit: (data: StudentInfoData) => void;
    isLoading?: boolean;
}

export interface StudentInfoData {
    fullName: string;
    age: number;
    district: string;
    schoolName: string;
    email: string;
    phoneNumber: string;
    examYear: number;
}

const districts = [
    'Ampara',
    'Anuradhapura',
    'Badulla',
    'Batticaloa',
    'Colombo',
    'Galle',
    'Gampaha',
    'Hambantota',
    'Jaffna',
    'Kalutara',
    'Kandy',
    'Kegalle',
    'Kilinochchi',
    'Kurunegala',
    'Mannar',
    'Matale',
    'Matara',
    'Monaragala',
    'Mullaitivu',
    'Nuwara Eliya',
    'Polonnaruwa',
    'Puttalam',
    'Ratnapura',
    'Trincomalee',
    'Vavuniya',
];

const PAST_YEARS = 6; // how many years before the current year to show
const FUTURE_YEARS = 4; // how many years after the current year to show

const currentYear = new Date().getFullYear();
const startYear = currentYear - PAST_YEARS;
const endYear = currentYear + FUTURE_YEARS;

const examYears = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

export default function StudentInfoForm({ onSubmit, isLoading = false }: StudentInfoFormProps) {
    const [formData, setFormData] = useState<StudentInfoData>({
        fullName: '',
        age: 18,
        district: '',
        schoolName: '',
        email: '',
        phoneNumber: '',
        examYear: new Date().getFullYear(),
    });

    const [errors, setErrors] = useState<Partial<Record<keyof StudentInfoData, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof StudentInfoData, string>> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        if (formData.age < 15 || formData.age > 24) {
            newErrors.age = 'Age must be between 15 and 24';
        }
        if (!formData.district) {
            newErrors.district = 'Please select a district';
        }
        if (!formData.schoolName.trim()) {
            newErrors.schoolName = 'School name is required';
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phoneNumber.match(/^[0-9]{10}$/)) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof StudentInfoData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
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
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl transition-shadow duration-300 hover:shadow-2xl"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Information</h2>
            <p className="text-gray-600 mb-8">Please provide your personal details to get started with your university course recommendations.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Full Name */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-gray-400 transform-gpu hover:shadow-sm hover:border-cyan-300 ${
                            errors.fullName
                                ? 'border-red-500 focus:ring-red-200 text-black shadow-inner'
                                : 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-black'
                        }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Age */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
                        Age <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="15"
                        max="30"
                        placeholder="18"
                        value={formData.age}
                        onChange={(e) => handleChange('age', parseInt(e.target.value) || 18)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-gray-400 transform-gpu hover:shadow-sm hover:border-cyan-300 ${
                            errors.age
                                ? 'border-red-500 focus:ring-red-200 text-black shadow-inner'
                                : 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-black'
                        }`}
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                {/* District */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
                        District <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.district}
                        onChange={(e) => handleChange('district', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-cyan-100 focus:outline-none transition-all appearance-none bg-white transform-gpu hover:shadow-sm hover:border-cyan-300 ${
                            errors.district
                                ? 'border-red-500 focus:ring-red-200 text-black'
                                : formData.district ? 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-black' : 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-gray-400'
                        }`}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2306b6d4' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            paddingRight: '36px'
                        }}
                    >
                        <option value="">Select your district</option>
                        {districts.map(district => (
                            <option key={district} value={district} className="hover:bg-cyan-100 hover:text-cyan-900 focus:bg-cyan-500 focus:text-white">{district}</option>
                        ))}
                    </select>
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>

                {/* School Name */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
                        School Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Your school name"
                        value={formData.schoolName}
                        onChange={(e) => handleChange('schoolName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-gray-400 transform-gpu hover:shadow-sm hover:border-cyan-300 ${
                            errors.schoolName
                                ? 'border-red-500 focus:ring-red-200 text-black shadow-inner'
                                : 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-black'
                        }`}
                    />
                    {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                </div>

                {/* Email */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-gray-400 transform-gpu hover:shadow-sm hover:border-cyan-300 ${
                            errors.email
                                ? 'border-red-500 focus:ring-red-200 text-black shadow-inner'
                                : 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-black'
                        }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        placeholder="07X XXX XXXX"
                        value={formData.phoneNumber}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-gray-400 transform-gpu hover:shadow-sm hover:border-cyan-300 ${
                            errors.phoneNumber
                                ? 'border-red-500 focus:ring-red-200 text-black shadow-inner'
                                : 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-black'
                        }`}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>

                {/* Exam Year */}
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
                        A/L Examination Year <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.examYear}
                        onChange={(e) => handleChange('examYear', parseInt(e.target.value))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-cyan-100 focus:outline-none transition-all appearance-none bg-white transform-gpu hover:shadow-sm hover:border-cyan-300 ${
                            formData.examYear ? 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-black' : 'border-gray-300 focus:ring-cyan-200 focus:border-cyan-500 text-gray-400'
                        }`}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2306b6d4' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            paddingRight: '36px'
                        }}
                    >
                        {examYears.map(year => (
                            <option key={year} value={year} className="hover:bg-cyan-100 hover:text-cyan-900 focus:bg-cyan-500 focus:text-white">{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Submit Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <span className="flex items-center gap-2">
                            <span className="transition-transform transform group-hover:translate-x-1">Next: A/L Results</span>
                            <ChevronRight className="w-5 h-5 transition-transform transform group-hover:translate-x-2" />
                        </span>
                    </>
                )}
            </motion.button>
        </motion.form>
    );
}
