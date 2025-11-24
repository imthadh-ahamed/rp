'use client';

import ALForm from '@/components/career-guide/ALForm';
import OLForm from '@/components/career-guide/OLForm';
import ConfirmModal from '@/components/common/ConfirmModal';
import QualificationCard from '@/components/profile/QualificationCard';
import { MOCK_USER_DATA } from '@/utils/mockUserData';
import { UserData } from '@/utils/userStorage';
import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProfileTab() {
    const [userData, setUserData] = useState<UserData | null>(MOCK_USER_DATA);
    const [isALModalOpen, setIsALModalOpen] = useState(false);
    const [isOLModalOpen, setIsOLModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    const confirmDelete = () => {
        setUserData(MOCK_USER_DATA);
    };

    const handleCloseModal = () => {
        setIsALModalOpen(false);
        setIsOLModalOpen(false);
    };

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
            />
            <OLForm
                isOpen={isOLModalOpen}
                onClose={handleCloseModal}
                onBack={handleCloseModal}
                initialData={userData}
            />

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Reset Profile"
                message="Are you sure you want to reset your qualification details to default? This will restore the sample data."
                confirmText="Reset"
                cancelText="Cancel"
                variant="warning"
            />
        </>
    );
}
