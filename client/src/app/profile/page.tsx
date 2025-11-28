'use client';

import AppShell from '@/components/common/AppShell';
import ALForm from '@/components/career-guide/ALForm';
import OLForm from '@/components/career-guide/OLForm';
import QualificationCard from '@/components/profile/QualificationCard';
import { clearUserData, getUserData, UserData } from '@/utils/userStorage';
import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isALModalOpen, setIsALModalOpen] = useState(false);
  const [isOLModalOpen, setIsOLModalOpen] = useState(false);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  const handleEdit = () => {
    if (userData?.qualificationType === 'AL') {
      setIsALModalOpen(true);
    } else if (userData?.qualificationType === 'OL') {
      setIsOLModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your qualification details? This action cannot be undone.')) {
      clearUserData();
      setUserData(null);
    }
  };

  const handleCloseModal = () => {
    setIsALModalOpen(false);
    setIsOLModalOpen(false);
    // Refresh data after edit
    const data = getUserData();
    setUserData(data);
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your qualification details and career preferences.</p>
          </div>

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
        </div>
      </div>

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
    </AppShell>
  );
}
