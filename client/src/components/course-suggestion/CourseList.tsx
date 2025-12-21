'use client';

import { motion } from 'framer-motion';
import { Clock, Star, Eye, BookOpen, DollarSign, Loader2, AlertCircle, MapPin, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import CourseDetailModal from './CourseDetailModal';
import profileService from '@/services/profile.service';
import { Recommendation } from '@/types/profile.types';
import Link from 'next/link';

export default function CourseList() {
    const [courses, setCourses] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Recommendation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setValidationErrors([]);
            
            // API now returns only the logged-in user's profiles (already filtered)
            const { profiles } = await profileService.getAllProfiles();

            if (profiles && profiles.length > 0) {
                // Get recommendations from the most recent profile
                const sortedProfiles = profiles.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                const latestProfile = sortedProfiles[0];
                
                // Check if the recommendations contain validation errors
                if (latestProfile.recommendations && Array.isArray(latestProfile.recommendations)) {
                    // Check if it's an error response (validation errors from backend)
                    const firstItem = latestProfile.recommendations[0];
                    if (firstItem && typeof firstItem === 'string') {
                        // It's a validation error
                        setValidationErrors(latestProfile.recommendations as unknown as string[]);
                        setError("We couldn't find suitable courses based on your criteria");
                    } else if (latestProfile.recommendations.length > 0) {
                        setCourses(latestProfile.recommendations);
                    } else {
                        setError("No course recommendations found for your profile");
                    }
                } else {
                    setError("No recommendations available. Please try updating your profile.");
                }
            } else {
                setError("No profiles found. Please create a profile first.");
            }
        } catch (err: any) {
            console.error("Error fetching recommendations:", err);
            setError(err.message || "Failed to load recommendations. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewCourse = (course: Recommendation) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading your personalized recommendations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-4 max-w-md">{error}</p>
                
                {validationErrors.length > 0 && (
                    <div className="w-full max-w-lg mb-6">
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <div className="flex items-start">
                                <Info className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div className="text-left">
                                    <h4 className="text-sm font-semibold text-amber-800 mb-2">
                                        Why aren't there any recommendations?
                                    </h4>
                                    <ul className="space-y-1 text-sm text-amber-700">
                                        {validationErrors.map((err, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{err}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div className="text-left text-sm text-blue-900">
                                    <p className="font-medium mb-1">Suggestions:</p>
                                    <ul className="space-y-1 text-blue-800">
                                        <li>• Try selecting a different location in Sri Lanka (e.g., Colombo, Kandy, Galle)</li>
                                        <li>• Adjust your career goals to explore more options</li>
                                        <li>• Consider changing your study method preferences</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="flex gap-3">
                    <Link
                        href="/milestones?tab=profile"
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        Update Profile
                    </Link>
                    <button
                        onClick={fetchRecommendations}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Recommendations Yet</h3>
                <p className="text-gray-600 max-w-md">
                    We couldn't find any course recommendations for you. Please ensure your profile is complete.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                    <motion.div
                        key={course.id || course._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                        {/* Header / Banner */}
                        <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex flex-col justify-between">
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-sm">
                                <Star className="w-4 h-4 text-yellow-300 mr-1 fill-yellow-300" />
                                <span className="text-sm font-bold text-white">{course.match_score.toFixed(0)}% Match</span>
                            </div>
                            <div className="text-white/80 text-sm font-medium uppercase tracking-wider line-clamp-1">
                                {course.department}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.tags.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors" title={course.course_name}>
                                {course.course_name}
                            </h3>
                            <p className="text-gray-600 font-medium mb-4 line-clamp-1" title={course.university}>
                                {course.university}
                            </p>

                            <div className="mt-auto space-y-3">
                                <div className="flex items-center justify-between text-gray-500 text-sm border-t pt-4">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {course.duration}
                                    </div>
                                    <div className="flex items-center">
                                        <BookOpen className="w-4 h-4 mr-1" />
                                        {course.study_method}
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    {course.course_fee === 'None' || !course.course_fee ? 'Not Available' : course.course_fee}
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCourse(course);
                                }}
                                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium group-hover:bg-purple-600 group-hover:text-white"
                            >
                                <Eye className="w-4 h-4" />
                                View Details
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <CourseDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                course={selectedCourse}
            />
        </>
    );
}
