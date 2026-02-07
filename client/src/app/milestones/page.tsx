'use client';

import AppShell from '@/components/common/AppShell';
import MilestoneDetailsView from '@/components/milestones/MilestoneDetailsView';
import MilestonesTab from '@/components/milestones/MilestonesTab';
import ProfileTab from '@/components/milestones/ProfileTab';
import { motion } from 'framer-motion';
import { Plus, Target, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

type TabType = 'milestones' | 'profile';

function MilestonesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const milestoneId = searchParams.get('milestoneId');
    const tabParam = searchParams.get('tab') as TabType | null;
    const [activeTab, setActiveTab] = useState<TabType>(tabParam || 'milestones');

    const tabs = [
        { id: 'milestones' as TabType, label: 'My Milestones', icon: Target },
        { id: 'profile' as TabType, label: 'My Profile', icon: User }
    ];

    const handleBackToList = () => {
        router.push('/milestones');
    };

    // If milestoneId is present, show milestone details
    if (milestoneId) {
        return (
            <AppShell>
                <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <MilestoneDetailsView
                            milestoneId={milestoneId}
                            onBack={handleBackToList}
                        />
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href="/career-guide"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Career Guide</span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                {activeTab === 'milestones' ? (
                                    <>
                                        <Target className="w-8 h-8 text-purple-600" />
                                        My Milestones
                                    </>
                                ) : (
                                    <>
                                        <User className="w-8 h-8 text-purple-600" />
                                        My Profile
                                    </>
                                )}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {activeTab === 'milestones'
                                    ? 'Track your progress on your learning journey.'
                                    : 'Manage your qualification details and career preferences.'}
                            </p>
                        </div>
                        {activeTab === 'milestones' && (
                            <Link
                                href="/career-guide"
                                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                <Plus className="w-5 h-5" />
                                Add Milestone
                            </Link>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                        group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${isActive
                                                    ? 'border-purple-600 text-purple-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }
                      `}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'milestones' ? <MilestonesTab /> : <ProfileTab />}
                    </motion.div>
                </div>
            </div>
        </AppShell>
    );
}

export default function MilestonesPage() {
    return (
        <Suspense fallback={
            <AppShell>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-gray-600">Loading...</div>
                </div>
            </AppShell>
        }>
            <MilestonesContent />
        </Suspense>
    );
}
