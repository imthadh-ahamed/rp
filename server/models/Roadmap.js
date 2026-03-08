import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
}, { _id: false });

const roadmapStepSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'BookOpen'
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    actionPlan: {
        type: [String],
        required: true
    },
    resources: {
        type: [resourceSchema],
        required: true
    },
    successCriteria: {
        type: [String],
        required: true
    }
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ALProfile',
        required: [true, 'Profile ID is required'],
        index: true
    },
    courseId: {
        type: String,
        required: [true, 'Course ID is required'],
        index: true
    },
    courseName: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    careerGoal: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'error'],
        default: 'success'
    },
    roadmap: {
        type: [roadmapStepSchema],
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    warnings: {
        type: [String],
        default: []
    },
    errors: {
        type: [String],
        default: []
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
roadmapSchema.index({ userId: 1, profileId: 1, courseId: 1 });
roadmapSchema.index({ createdAt: -1 });

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;