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
    const [profiles, setProfiles] = useState<ALProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isALModalOpen, setIsALModalOpen] = useState(false);
    const [isOLModalOpen, setIsOLModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editingProfile, setEditingProfile] = useState<ALProfile | null>(null);
    const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);

    // Fetch user's profiles on component mount
    const fetchProfiles = async () => {
        try {
            setIsLoading(true);
            // API returns only the logged-in user's profiles
            const { profiles: fetchedProfiles } = await profileService.getAllProfiles();
            setProfiles(fetchedProfiles || []);
        } catch (error: any) {
            console.error('Error fetching profiles:', error);
            toast.error('Failed to load profile data');
            setProfiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleEdit = (profile: ALProfile) => {
        setEditingProfile(profile);
        if (profile.qualificationType === 'AL') {
            setIsALModalOpen(true);
        } else if (profile.qualificationType === 'OL') {
            setIsOLModalOpen(true);
        }
    };

    const handleDelete = (profileId: string) => {
        setDeletingProfileId(profileId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!deletingProfileId) return;

        try {
            await profileService.deleteProfile(deletingProfileId);
            toast.success('Profile deleted successfully');
            setShowDeleteConfirm(false);
            setDeletingProfileId(null);
            // Refresh profiles after deletion
            fetchProfiles();
        } catch (error: any) {
            console.error('Error deleting profile:', error);
            toast.error(error.message || 'Failed to delete profile');
        }
    };

    const handleCloseModal = () => {
        setIsALModalOpen(false);
        setIsOLModalOpen(false);
        setEditingProfile(null);
        // Refresh profile data when modal closes (in case it was updated)
        fetchProfiles();
    };

    const convertToUserData = (profile: ALProfile): UserData => {
        return {
            age: profile.age,
            gender: profile.gender,
            nativeLanguage: profile.nativeLanguage,
            preferredLanguage: profile.preferredLanguage,
            olResults: profile.olResults,
            alStream: profile.alStream || null,
            alResults: profile.alResults || null,
            otherQualifications: profile.otherQualifications || '',
            ieltsScore: profile.ieltsScore || '',
            interestArea: profile.interestArea,
            careerGoal: profile.careerGoal,
            monthlyIncome: profile.monthlyIncome,
            fundingMethod: profile.fundingMethod,
            availability: profile.availability,
            completionPeriod: profile.completionPeriod,
            studyMethod: profile.studyMethod,
            currentLocation: profile.currentLocation,
            preferredLocations: profile.preferredLocations,
            qualificationType: profile.qualificationType
        };
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
            {profiles.length > 0 ? (
                <div className="space-y-6">
                    {profiles.map((profile, index) => (
                        <QualificationCard
                            key={profile._id}
                            userData={convertToUserData(profile)}
                            onEdit={() => handleEdit(profile)}
                            onDelete={() => handleDelete(profile._id)}
                        />
                    ))}
                </div>
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
                initialData={editingProfile ? convertToUserData(editingProfile) : undefined}
                profileId={editingProfile?._id}
            />
            <OLForm
                isOpen={isOLModalOpen}
                onClose={handleCloseModal}
                onBack={handleCloseModal}
                initialData={editingProfile ? convertToUserData(editingProfile) : undefined}
                profileId={editingProfile?._id}
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
