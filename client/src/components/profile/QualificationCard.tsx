'use client';

import { UserData } from '@/utils/userStorage';
import { motion } from 'framer-motion';
import { Edit2, Trash2, GraduationCap, MapPin, Target } from 'lucide-react';

interface QualificationCardProps {
  userData: UserData;
  onEdit: () => void;
  onDelete: () => void;
}

export default function QualificationCard({ userData, onEdit, onDelete }: QualificationCardProps) {
  const isAL = userData.qualificationType === 'AL';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {isAL ? 'Advanced Level Qualification' : 'Ordinary Level Qualification'}
            </h3>
            <p className="text-purple-100 text-sm">
              {isAL ? userData.alStream : 'O/L Completed'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Edit Details"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded-lg transition-colors"
            title="Delete Details"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Results</h4>
            <p className="text-gray-900 font-medium whitespace-pre-wrap">
              {isAL ? userData.alResults : userData.olResults}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Interest Area</h4>
            <div className="flex items-center gap-2 text-gray-900">
              <Target className="w-4 h-4 text-purple-500" />
              {userData.interestArea}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Career Goal</h4>
            <p className="text-gray-900">{userData.careerGoal}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Location Preference</h4>
            <div className="flex items-center gap-2 text-gray-900">
              <MapPin className="w-4 h-4 text-red-500" />
              {userData.preferredLocations}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
