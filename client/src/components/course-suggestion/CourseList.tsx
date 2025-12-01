'use client';

import { motion } from 'framer-motion';
import { Clock, Star, Eye, BookOpen, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import CourseDetailModal from './CourseDetailModal';
import profileService from '@/services/profile.service';
import { Recommendation } from '@/types/profile.types';

export default function CourseList() {
    const [courses, setCourses] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Recommendation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setIsLoading(true);
            const { profiles } = await profileService.getAllProfiles();

            if (profiles && profiles.length > 0) {
                // Get recommendations from the most recent profile
                // Assuming the API returns profiles sorted or we pick the first one
                // We can also sort by createdAt if needed
                const sortedProfiles = profiles.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                const latestProfile = sortedProfiles[0];
                if (latestProfile.recommendations && latestProfile.recommendations.length > 0) {
                    setCourses(latestProfile.recommendations);
                } else {
                    setError("No recommendations found in your profile.");
                }
            } else {
                setError("No profiles found. Please create a profile first.");
            }
        } catch (err: any) {
            console.error("Error fetching recommendations:", err);
            setError(err.message || "Failed to load recommendations.");
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
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-6 max-w-md">{error}</p>
                <button
                    onClick={fetchRecommendations}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                    Try Again
                </button>
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
                                    {course.course_fee}
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
