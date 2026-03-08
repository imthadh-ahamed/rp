import mongoose from 'mongoose';

// Schema for individual stage completion tracking
const stageCompletionSchema = new mongoose.Schema({
    stepId: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    stepTitle: {
        type: String,
        required: true,
        trim: true
    },
    stepGoal: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'BookOpen'
    },
    color: {
        type: String,
        default: 'bg-blue-500'
    },
    actionPlan: {
        type: [String],
        default: []
    },
    resources: {
        type: [String],
        default: []
    },
    successCriteria: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    feedback: {
        type: String,
        trim: true,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },
    startedAt: {
        type: Date,
        default: null
    }
}, { _id: false });

const milestoneSchema = new mongoose.Schema(
    {
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
        roadmapId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Roadmap',
            required: [true, 'Roadmap ID is required'],
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
        // Milestone title and description
        title: {
            type: String,
            required: true,
            default: 'Learn-to-Earn Career Pathway'
        },
        description: {
            type: String,
            default: 'Complete all stages of your personalized learning journey to achieve your career goals.'
        },
        // Array of all 6 stages with their completion status
        stages: {
            type: [stageCompletionSchema],
            required: true,
            validate: {
                validator: function(stages) {
                    return stages.length === 6;
                },
                message: 'Must have exactly 6 stages'
            }
        },
        // Overall completion status
        overallStatus: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        },
        // Overall progress percentage
        progressPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        // Count of completed stages
        completedStages: {
            type: Number,
            default: 0,
            min: 0,
            max: 6
        },
        // Metadata for additional information
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Compound unique index - one milestone per user per roadmap
milestoneSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

// Index for querying user's milestones
milestoneSchema.index({ userId: 1, isDeleted: 1 });

// Index for course-based queries
milestoneSchema.index({ userId: 1, profileId: 1, courseId: 1 });

// Index for efficient date-based queries
milestoneSchema.index({ createdAt: -1 });

// Virtual for overall days since first stage started
milestoneSchema.virtual('daysSinceStarted').get(function() {
    const startedStages = this.stages.filter(s => s.startedAt);
    if (startedStages.length > 0) {
        const earliestStart = new Date(Math.min(...startedStages.map(s => s.startedAt)));
        const diffTime = Math.abs(new Date() - earliestStart);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
});

// Virtual for overall days to complete all stages
milestoneSchema.virtual('daysToComplete').get(function() {
    if (this.overallStatus === 'completed') {
        const startedStages = this.stages.filter(s => s.startedAt);
        const completedStages = this.stages.filter(s => s.completedAt);
        if (startedStages.length > 0 && completedStages.length > 0) {
            const earliestStart = new Date(Math.min(...startedStages.map(s => s.startedAt)));
            const latestComplete = new Date(Math.max(...completedStages.map(s => s.completedAt)));
            const diffTime = Math.abs(latestComplete - earliestStart);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
    }
    return 0;
});

// Method to mark a specific stage as started
milestoneSchema.methods.markStageAsStarted = function(stepId) {
    const stage = this.stages.find(s => s.stepId === stepId);
    if (!stage) {
        throw new Error(`Stage ${stepId} not found`);
    }
    
    if (stage.status === 'pending') {
        stage.status = 'in_progress';
        stage.startedAt = new Date();
        
        // Update overall status
        if (this.overallStatus === 'pending') {
            this.overallStatus = 'in_progress';
        }
    }
    
    return this.save();
};

// Method to mark a specific stage as complete with feedback
milestoneSchema.methods.markStageAsComplete = function(stepId, feedback) {
    const stage = this.stages.find(s => s.stepId === stepId);
    if (!stage) {
        throw new Error(`Stage ${stepId} not found`);
    }
    
    stage.status = 'completed';
    stage.feedback = feedback;
    stage.completedAt = new Date();
    
    if (!stage.startedAt) {
        stage.startedAt = stage.completedAt;
    }
    
    // Update completed stages count
    this.completedStages = this.stages.filter(s => s.status === 'completed').length;
    
    // Update progress percentage
    this.progressPercentage = Math.round((this.completedStages / this.stages.length) * 100);
    
    // Update overall status
    if (this.completedStages === this.stages.length) {
        this.overallStatus = 'completed';
    } else {
        this.overallStatus = 'in_progress';
    }
    
    return this.save();
};

// Method to update stage feedback
milestoneSchema.methods.updateStageFeedback = function(stepId, feedback) {
    const stage = this.stages.find(s => s.stepId === stepId);
    if (!stage) {
        throw new Error(`Stage ${stepId} not found`);
    }
    
    stage.feedback = feedback;
    return this.save();
};

// Method to get a specific stage
milestoneSchema.methods.getStage = function(stepId) {
    return this.stages.find(s => s.stepId === stepId);
};

// Static method to get progress for a roadmap
milestoneSchema.statics.getProgress = async function(roadmapId) {
    const milestone = await this.findOne({ roadmapId, isDeleted: false });
    
    if (!milestone) {
        return {
            total: 6,
            completed: 0,
            inProgress: 0,
            pending: 6,
            percentage: 0,
            stages: []
        };
    }
    
    const completed = milestone.stages.filter(s => s.status === 'completed').length;
    const inProgress = milestone.stages.filter(s => s.status === 'in_progress').length;
    const pending = milestone.stages.filter(s => s.status === 'pending').length;
    
    return {
        total: milestone.stages.length,
        completed,
        inProgress,
        pending,
        percentage: milestone.progressPercentage,
        stages: milestone.stages.map(s => ({
            stepId: s.stepId,
            stepTitle: s.stepTitle,
            stepGoal: s.stepGoal,
            description: s.description,
            duration: s.duration,
            icon: s.icon,
            color: s.color,
            actionPlan: s.actionPlan,
            resources: s.resources,
            successCriteria: s.successCriteria,
            status: s.status,
            feedback: s.feedback,
            completedAt: s.completedAt,
            startedAt: s.startedAt
        }))
    };
};

// Static method to get detailed analytics
milestoneSchema.statics.getDetailedAnalytics = async function(userId) {
    const milestones = await this.find({ userId, isDeleted: false });
    
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.overallStatus === 'completed').length;
    const inProgressMilestones = milestones.filter(m => m.overallStatus === 'in_progress').length;
    
    const totalStages = milestones.reduce((sum, m) => sum + m.stages.length, 0);
    const completedStages = milestones.reduce((sum, m) => sum + m.completedStages, 0);
    
    const averageProgress = totalMilestones > 0 
        ? milestones.reduce((sum, m) => sum + m.progressPercentage, 0) / totalMilestones 
        : 0;
    
    return {
        totalMilestones,
        completedMilestones,
        inProgressMilestones,
        totalStages,
        completedStages,
        averageProgress: Math.round(averageProgress),
        milestones: milestones.map(m => ({
            roadmapId: m.roadmapId,
            courseName: m.courseName,
            careerGoal: m.careerGoal,
            progressPercentage: m.progressPercentage,
            completedStages: m.completedStages,
            overallStatus: m.overallStatus
        }))
    };
};

// Soft delete
milestoneSchema.methods.softDelete = function() {
    this.isDeleted = true;
    return this.save();
};

const Milestone = mongoose.model('Milestone', milestoneSchema);

export default Milestone;