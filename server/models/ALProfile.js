import mongoose from 'mongoose';

const alProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    qualificationType: {
        type: String,
        default: 'AL',
        enum: ['AL']
    },
    // Personal Details
    age: {
        type: String,
        required: [true, 'Age is required'],
        trim: true
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female', 'Other']
    },
    nativeLanguage: {
        type: String,
        required: [true, 'Native language is required'],
        enum: ['English', 'Sinhala', 'Tamil']
    },
    preferredLanguage: {
        type: String,
        required: [true, 'Preferred language is required'],
        enum: ['English', 'Sinhala', 'Tamil']
    },
    // Educational Details
    olResults: {
        type: String,
        required: [true, 'O/L results are required'],
        trim: true
    },
    alStream: {
        type: String,
        enum: ['Bio Science', 'Physical Science', 'Commerce', 'Arts', 'Engineering Technology', 'Bio-systems Technology'],
        default: null
    },
    alResults: {
        type: String,
        trim: true,
        default: null
    },
    otherQualifications: {
        type: String,
        trim: true,
        default: ''
    },
    ieltsScore: {
        type: String,
        trim: true,
        default: ''
    },
    // Career & Preferences
    interestArea: {
        type: String,
        required: [true, 'Interest area is required'],
        enum: ['Information Technology', 'Business & Management', 'Engineering/Technology', 'Arts & Design', 'Healthcare/Medicine', 'Education/Teaching', 'Agriculture/Environment']
    },
    careerGoal: {
        type: String,
        required: [true, 'Career goal is required'],
        trim: true
    },
    monthlyIncome: {
        type: String,
        required: [true, 'Monthly income is required'],
        trim: true
    },
    fundingMethod: {
        type: String,
        required: [true, 'Funding method is required'],
        enum: ['Self-funded', 'Need scholarship']
    },
    availability: {
        type: String,
        required: [true, 'Availability is required'],
        enum: ['Weekday', 'Weekend']
    },
    // Logistics
    completionPeriod: {
        type: String,
        required: [true, 'Completion period is required'],
        enum: ['< 1 year', '1–2 years', '2-3 years', '3-4 years', '4+ years']
    },
    studyMethod: {
        type: String,
        required: [true, 'Study method is required'],
        enum: ['Hybrid', 'Online', 'Onsite']
    },
    currentLocation: {
        type: String,
        required: [true, 'Current location is required'],
        trim: true
    },
    preferredLocations: {
        type: String,
        required: [true, 'Preferred locations are required'],
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    recommendations: [{
        rank: Number,
        course_name: String,
        university: String,
        location: String,
        match_score: Number,
        explanation: String,
        url: String,
        career_opportunities: String,
        study_language: String,
        study_method: String,
        duration: String,
        requirements: String,
        course_fee: String,
        department: String,
        tags: [String],
        isSelected: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            return ret;
        }
    }
});

// Index for efficient queries
alProfileSchema.index({ userId: 1 });
alProfileSchema.index({ createdAt: -1 });

const ALProfile = mongoose.model('ALProfile', alProfileSchema);

export default ALProfile;
