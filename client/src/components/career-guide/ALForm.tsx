'use client';

import { motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { saveUserData, UserData } from '@/utils/userStorage';
import profileService from '@/services/profile.service';
import { CreateALProfileRequest } from '@/types/profile.types';

interface ALFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  initialData?: UserData | null;
  profileId?: string;
}

export default function ALForm({ isOpen, onClose, onBack, initialData, profileId }: ALFormProps) {
  const router = useRouter();
  const initialState = {
    age: '',
    gender: '',
    nativeLanguage: '',
    preferredLanguage: '',
    olResults: '',
    alStream: '',
    alResults: '',
    otherQualifications: '',
    ieltsScore: '',
    interestArea: '',
    careerGoal: '',
    monthlyIncome: '',
    fundingMethod: '',
    availability: '',
    completionPeriod: '',
    studyMethod: '',
    currentLocation: '',
    preferredLocations: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Map UserData to form state (ensure all fields exist)
        setFormData({
          age: initialData.age || '',
          gender: initialData.gender || '',
          nativeLanguage: initialData.nativeLanguage || '',
          preferredLanguage: initialData.preferredLanguage || '',
          olResults: initialData.olResults || '',
          alStream: initialData.alStream || '',
          alResults: initialData.alResults || '',
          otherQualifications: initialData.otherQualifications || '',
          ieltsScore: initialData.ieltsScore || '',
          interestArea: initialData.interestArea || '',
          careerGoal: initialData.careerGoal || '',
          monthlyIncome: initialData.monthlyIncome || '',
          fundingMethod: initialData.fundingMethod || '',
          availability: initialData.availability || '',
          completionPeriod: initialData.completionPeriod || '',
          studyMethod: initialData.studyMethod || '',
          currentLocation: initialData.currentLocation || '',
          preferredLocations: initialData.preferredLocations || ''
        });
      } else {
        setFormData(initialState);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    let isValid = true;

    // Helper to check if empty
    const checkRequired = (field: keyof typeof formData, label: string) => {
      if (!formData[field].trim()) {
        newErrors[field] = `${label} is required`;
        isValid = false;
      }
    };

    checkRequired('age', 'Age');
    checkRequired('gender', 'Gender');
    checkRequired('nativeLanguage', 'Native Language');
    checkRequired('preferredLanguage', 'Preferred Language');
    checkRequired('olResults', 'O/L Results');
    checkRequired('alStream', 'A/L Stream');
    checkRequired('alResults', 'A/L Results');
    checkRequired('interestArea', 'Interest Area');
    checkRequired('careerGoal', 'Career Goal');
    checkRequired('monthlyIncome', 'Monthly Income');
    checkRequired('fundingMethod', 'Funding Method');
    checkRequired('availability', 'Availability');
    checkRequired('completionPeriod', 'Completion Period');
    checkRequired('studyMethod', 'Study Method');
    checkRequired('currentLocation', 'Current Location');
    checkRequired('preferredLocations', 'Preferred Locations');

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);

      try {
        const submissionData: CreateALProfileRequest = {
          age: formData.age,
          gender: formData.gender as 'Male' | 'Female' | 'Other',
          nativeLanguage: formData.nativeLanguage as 'English' | 'Sinhala' | 'Tamil',
          preferredLanguage: formData.preferredLanguage as 'English' | 'Sinhala' | 'Tamil',
          olResults: formData.olResults,
          alStream: formData.alStream as any,
          alResults: formData.alResults,
          otherQualifications: formData.otherQualifications,
          ieltsScore: formData.ieltsScore,
          interestArea: formData.interestArea as any,
          careerGoal: formData.careerGoal,
          monthlyIncome: formData.monthlyIncome,
          fundingMethod: formData.fundingMethod as 'Self-funded' | 'Need scholarship',
          availability: formData.availability as 'Weekday' | 'Weekend',
          completionPeriod: formData.completionPeriod as any,
          studyMethod: formData.studyMethod as 'Hybrid' | 'Online' | 'Onsite',
          currentLocation: formData.currentLocation,
          preferredLocations: formData.preferredLocations
        };

        let profile;
        if (profileId) {
          // Update existing profile
          profile = await profileService.updateProfile(profileId, submissionData);
          toast.success('Profile updated successfully!');
        } else {
          // Create new profile
          profile = await profileService.createProfile(submissionData);
          toast.success('Profile created successfully!');
        }

        // Also save to local storage for backward compatibility
        const localData: UserData = {
          ...formData,
          qualificationType: 'AL'
        };
        saveUserData(localData);

        onClose();
        // Navigate to course-suggestion page for both create and update
        router.push('/course-suggestion');
      } catch (error: any) {
        console.error('Error saving profile:', error);
        toast.error(error.message || 'Failed to save profile');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name as keyof typeof formData]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  if (!isOpen) return null;

  // Common input class with darker text for visibility
  const inputClass = (error?: string) => `w-full px-4 py-2 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} rounded-lg focus:ring-2 text-gray-900 placeholder-gray-500 transition-all`;

  const ErrorMsg = ({ error }: { error?: string }) => {
    if (!error) return null;
    return <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Options</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Career Guidance Assessment
          </h2>
          <p className="text-gray-600">
            Please provide your details for personalized career guidance
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>

          {/* Personal Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="text" name="age" value={formData.age} onChange={handleChange} className={inputClass(errors.age)} />
                <ErrorMsg error={errors.age} />
              </div>
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass(errors.gender)}>
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ErrorMsg error={errors.gender} />
              </div>
              {/* Native Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Native Language</label>
                <select name="nativeLanguage" value={formData.nativeLanguage} onChange={handleChange} className={inputClass(errors.nativeLanguage)}>
                  <option value="" disabled>Select Language</option>
                  <option value="English">English</option>
                  <option value="Sinhala">Sinhala</option>
                  <option value="Tamil">Tamil</option>
                </select>
                <ErrorMsg error={errors.nativeLanguage} />
              </div>
              {/* Preferred Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language for Study</label>
                <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className={inputClass(errors.preferredLanguage)}>
                  <option value="" disabled>Select Language</option>
                  <option value="English">English</option>
                  <option value="Sinhala">Sinhala</option>
                  <option value="Tamil">Tamil</option>
                </select>
                <ErrorMsg error={errors.preferredLanguage} />
              </div>
            </div>
          </div>

          {/* Educational Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Educational Details</h3>

            {/* O/L Results */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">O/L Results (Maths, English, Science, ICT)</label>
              <textarea name="olResults" value={formData.olResults} onChange={handleChange} className={inputClass(errors.olResults)} rows={2} placeholder="e.g., Maths: A, English: B..." />
              <ErrorMsg error={errors.olResults} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* A/L Stream */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">A/L Stream</label>
                <select name="alStream" value={formData.alStream} onChange={handleChange} className={inputClass(errors.alStream)}>
                  <option value="" disabled>Select Stream</option>
                  <option value="Bio Science">Bio Science</option>
                  <option value="Physical Science">Physical Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                  <option value="Engineering Technology">Engineering Technology</option>
                  <option value="Bio-systems Technology">Bio-systems Technology</option>
                </select>
                <ErrorMsg error={errors.alStream} />
              </div>
              {/* IELTS Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IELTS Score</label>
                <input type="number" step="0.5" name="ieltsScore" value={formData.ieltsScore} onChange={handleChange} className={inputClass(errors.ieltsScore)} placeholder="e.g. 6.5" />
                <ErrorMsg error={errors.ieltsScore} />
              </div>
            </div>

            {/* A/L Results */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">A/L Results</label>
              <textarea name="alResults" value={formData.alResults} onChange={handleChange} className={inputClass(errors.alResults)} rows={2} placeholder="Enter your results..." />
              <ErrorMsg error={errors.alResults} />
            </div>

            {/* Other Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Qualifications</label>
              <textarea name="otherQualifications" value={formData.otherQualifications} onChange={handleChange} className={inputClass(errors.otherQualifications)} rows={2} placeholder="Any other diplomas or certificates..." />
              <ErrorMsg error={errors.otherQualifications} />
            </div>
          </div>

          {/* Career & Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Career & Preferences</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Interest Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Area</label>
                <select name="interestArea" value={formData.interestArea} onChange={handleChange} className={inputClass(errors.interestArea)}>
                  <option value="" disabled>Select Interest Area</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Business & Management">Business & Management</option>
                  <option value="Engineering/Technology">Engineering/Technology</option>
                  <option value="Arts & Design">Arts & Design</option>
                  <option value="Healthcare/Medicine">Healthcare/Medicine</option>
                  <option value="Education/Teaching">Education/Teaching</option>
                  <option value="Agriculture/Environment">Agriculture/Environment</option>
                </select>
                <ErrorMsg error={errors.interestArea} />
              </div>
              {/* Monthly Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
                <input type="text" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className={inputClass(errors.monthlyIncome)} placeholder="e.g. 50000 LKR" />
                <ErrorMsg error={errors.monthlyIncome} />
              </div>
            </div>

            {/* Career Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Career Goal</label>
              <textarea name="careerGoal" value={formData.careerGoal} onChange={handleChange} className={inputClass(errors.careerGoal)} rows={2} placeholder="Describe your career aspirations..." />
              <ErrorMsg error={errors.careerGoal} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Funding Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funding Method</label>
                <select name="fundingMethod" value={formData.fundingMethod} onChange={handleChange} className={inputClass(errors.fundingMethod)}>
                  <option value="" disabled>Select Funding Method</option>
                  <option value="Self-funded">Self-funded</option>
                  <option value="Need scholarship">Need scholarship</option>
                </select>
                <ErrorMsg error={errors.fundingMethod} />
              </div>
              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select name="availability" value={formData.availability} onChange={handleChange} className={inputClass(errors.availability)}>
                  <option value="" disabled>Select Availability</option>
                  <option value="Weekday">Weekday</option>
                  <option value="Weekend">Weekend</option>
                </select>
                <ErrorMsg error={errors.availability} />
              </div>
            </div>
          </div>

          {/* Logistics Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Logistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Target Completion Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Completion Period</label>
                <select name="completionPeriod" value={formData.completionPeriod} onChange={handleChange} className={inputClass(errors.completionPeriod)}>
                  <option value="" disabled>Select Period</option>
                  <option value="< 1 year">&lt; 1 year</option>
                  <option value="1–2 years">1–2 years</option>
                  <option value="2-3 years">2-3 years</option>
                  <option value="3-4 years">3-4 years</option>
                  <option value="4+ years">4+ years</option>
                </select>
                <ErrorMsg error={errors.completionPeriod} />
              </div>
              {/* Study Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Study Method</label>
                <select name="studyMethod" value={formData.studyMethod} onChange={handleChange} className={inputClass(errors.studyMethod)}>
                  <option value="" disabled>Select Method</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Online">Online</option>
                  <option value="Onsite">Onsite</option>
                </select>
                <ErrorMsg error={errors.studyMethod} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                <input type="text" name="currentLocation" value={formData.currentLocation} onChange={handleChange} className={inputClass(errors.currentLocation)} placeholder="City, Country" />
                <ErrorMsg error={errors.currentLocation} />
              </div>
              {/* Preferred Locations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Locations</label>
                <input type="text" name="preferredLocations" value={formData.preferredLocations} onChange={handleChange} className={inputClass(errors.preferredLocations)} placeholder="Cities or Countries" />
                <ErrorMsg error={errors.preferredLocations} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <motion.button
              type="button"
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
