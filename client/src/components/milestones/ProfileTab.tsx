'use client';

import ALForm from '@/components/career-guide/ALForm';
import OLForm from '@/components/career-guide/OLForm';
import ConfirmModal from '@/components/common/ConfirmModal';
import QualificationCard from '@/components/profile/QualificationCard';
import profileService from '@/services/profile.service';
import { ALProfile } from '@/types/profile.types';
import { UserData } from '@/utils/userStorage';
import { motion } from 'framer-motion';
import { FileQuestion, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProfileTab() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profile, setProfile] = useState<ALProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isALModalOpen, setIsALModalOpen] = useState(false);
    const [isOLModalOpen, setIsOLModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch user's profile on component mount
    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const { profiles } = await profileService.getAllProfiles();

            // Get the first profile (assuming user has only one profile)
            // In a real app, you'd filter by current user's ID
            if (profiles && profiles.length > 0) {
                const userProfile = profiles[0];
                setProfile(userProfile);

                // Convert ALProfile to UserData format for backward compatibility
                const formattedData: UserData = {
                    age: userProfile.age,
                    gender: userProfile.gender,
                    nativeLanguage: userProfile.nativeLanguage,
                    preferredLanguage: userProfile.preferredLanguage,
                    olResults: userProfile.olResults,
                    alStream: userProfile.alStream || null,
                    alResults: userProfile.alResults || null,
                    otherQualifications: userProfile.otherQualifications || '',
                    ieltsScore: userProfile.ieltsScore || '',
                    interestArea: userProfile.interestArea,
                    careerGoal: userProfile.careerGoal,
                    monthlyIncome: userProfile.monthlyIncome,
                    fundingMethod: userProfile.fundingMethod,
                    availability: userProfile.availability,
                    completionPeriod: userProfile.completionPeriod,
                    studyMethod: userProfile.studyMethod,
                    currentLocation: userProfile.currentLocation,
                    preferredLocations: userProfile.preferredLocations,
                    qualificationType: userProfile.qualificationType
                };
                setUserData(formattedData);
            } else {
                setUserData(null);
                setProfile(null);
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
            setUserData(null);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEdit = () => {
        if (userData?.qualificationType === 'AL') {
            setIsALModalOpen(true);
        } else if (userData?.qualificationType === 'OL') {
            setIsOLModalOpen(true);
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!profile) return;

        try {
            await profileService.deleteProfile(profile._id);
            toast.success('Profile deleted successfully');
            setUserData(null);
            setProfile(null);
            setShowDeleteConfirm(false);
        } catch (error: any) {
            console.error('Error deleting profile:', error);
            toast.error(error.message || 'Failed to delete profile');
        }
    };

    const handleCloseModal = () => {
        setIsALModalOpen(false);
        setIsOLModalOpen(false);
        // Refresh profile data when modal closes (in case it was updated)
        fetchProfile();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    return (
        <>
            {userData ? (
                <QualificationCard
                    userData={userData}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
                >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <FileQuestion className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Details Found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        You haven't submitted your qualification details yet. Take the assessment to get personalized career guidance.
                    </p>
                    <Link
                        href="/career-guide"
                        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Go to Career Guide
                    </Link>
                </motion.div>
            )}

            {/* Edit Modals */}
            <ALForm
                isOpen={isALModalOpen}
                onClose={handleCloseModal}
                onBack={handleCloseModal}
                initialData={userData}
                profileId={profile?._id}
            />
            <OLForm
                isOpen={isOLModalOpen}
                onClose={handleCloseModal}
                onBack={handleCloseModal}
                initialData={userData}
                profileId={profile?._id}
            />

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Profile"
                message="Are you sure you want to delete your qualification details? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
}
