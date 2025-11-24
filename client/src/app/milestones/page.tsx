'use client';

import AppShell from '@/components/common/AppShell';
import MilestonesTab from '@/components/milestones/MilestonesTab';
import ProfileTab from '@/components/milestones/ProfileTab';
import { motion } from 'framer-motion';
import { Plus, Target, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type TabType = 'milestones' | 'profile';

export default function MilestonesPage() {
    const [activeTab, setActiveTab] = useState<TabType>('milestones');

    const tabs = [
        { id: 'milestones' as TabType, label: 'My Milestones', icon: Target },
        { id: 'profile' as TabType, label: 'My Profile', icon: User }
    ];

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
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
