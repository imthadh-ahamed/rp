'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import CourseDetailModal from './CourseDetailModal';

// Mock data for suggested courses
const SUGGESTED_COURSES = [
    {
        id: 1,
        title: 'BSc (Hons) in Computer Science',
        institution: 'University of Westminster',
        duration: '3 Years',
        location: 'Colombo',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800',
        tags: ['IT', 'Software Engineering', 'Full-time']
    },
    {
        id: 2,
        title: 'Higher Diploma in Business Management',
        institution: 'NIBM',
        duration: '18 Months',
        location: 'Kandy',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
        tags: ['Business', 'Management', 'Part-time']
    },
    {
        id: 3,
        title: 'Certificate in Digital Marketing',
        institution: 'SLIM',
        duration: '6 Months',
        location: 'Online',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800',
        tags: ['Marketing', 'Digital', 'Short Course']
    },
    {
        id: 4,
        title: 'BEng (Hons) in Software Engineering',
        institution: 'IIT',
        duration: '4 Years',
        location: 'Colombo',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&q=80&w=800',
        tags: ['Engineering', 'Software', 'Internship']
    },
    {
        id: 5,
        title: 'Diploma in Graphic Design',
        institution: 'AMDT',
        duration: '1 Year',
        location: 'Colombo',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?auto=format&fit=crop&q=80&w=800',
        tags: ['Design', 'Creative', 'Portfolio']
    },
    {
        id: 6,
        title: 'BSc in Data Science',
        institution: 'SLIIT',
        duration: '4 Years',
        location: 'Malabe',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        tags: ['Data', 'Analytics', 'Math']
    }
];

export default function CourseList() {
    const [selectedCourse, setSelectedCourse] = useState<typeof SUGGESTED_COURSES[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewCourse = (course: typeof SUGGESTED_COURSES[0]) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SUGGESTED_COURSES.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
                    >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-sm">
                                <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                                <span className="text-sm font-semibold text-gray-800">{course.rating}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-gray-600 font-medium mb-4">
                                {course.institution}
                            </p>

                            <div className="flex items-center justify-between text-gray-500 text-sm border-t pt-4 mb-4">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {course.duration}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {course.location}
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCourse(course);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium group-hover:bg-purple-600 group-hover:text-white"
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
