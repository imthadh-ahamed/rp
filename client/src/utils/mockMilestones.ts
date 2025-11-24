import { ROADMAP_STEPS } from '@/components/diagram/constants';

export interface MilestoneStep {
    id: string;
    title: string;
    description: string;
    goal: string;
    duration: string;
    actionPlan: string[];
    resources: string[];
    successCriteria: string[];
    status: 'pending' | 'completed';
    feedback?: string;
    completedAt?: string;
    color: string;
    icon: string;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    totalSteps: number;
    completedSteps: number;
    steps: MilestoneStep[];
}

// Create multiple milestones for different career paths
export const MOCK_MILESTONES: Milestone[] = [
    {
        id: 'milestone-learn-to-earn',
        title: 'Learn-to-Earn Career Pathway',
        description: 'Complete all stages of your personalized learning journey to achieve your career goals.',
        totalSteps: ROADMAP_STEPS.length,
        completedSteps: 0,
        steps: ROADMAP_STEPS.map((step) => ({
            id: `step-${step.id}`,
            title: step.title,
            description: step.description,
            goal: step.goal,
            duration: step.duration,
            actionPlan: step.actionPlan,
            resources: step.resources,
            successCriteria: step.successCriteria,
            status: 'pending' as const,
            color: step.color,
            icon: step.icon.name
        }))
    },
    {
        id: 'milestone-web-development',
        title: 'Full-Stack Web Development Path',
        description: 'Master modern web technologies and become a professional full-stack developer.',
        totalSteps: 4,
        completedSteps: 1,
        steps: [
            {
                id: 'web-step-1',
                title: 'Frontend Fundamentals',
                description: 'Learn HTML, CSS, JavaScript, and React to build interactive user interfaces.',
                goal: 'Master Frontend',
                duration: '3 months',
                actionPlan: [
                    'Complete HTML & CSS course',
                    'Learn JavaScript ES6+',
                    'Build 5 responsive websites',
                    'Master React.js framework'
                ],
                resources: [
                    'freeCodeCamp - Responsive Web Design',
                    'JavaScript.info - Modern JavaScript',
                    'React Official Documentation'
                ],
                successCriteria: [
                    'Build a portfolio website',
                    'Create responsive layouts',
                    'Understand React hooks and state management'
                ],
                status: 'completed' as const,
                feedback: 'Completed all frontend fundamentals. Built a personal portfolio and 3 client projects!',
                completedAt: '2024-01-15T10:30:00Z',
                color: 'bg-blue-500',
                icon: 'Code'
            },
            {
                id: 'web-step-2',
                title: 'Backend Development',
                description: 'Learn Node.js, Express, and database management for server-side development.',
                goal: 'Backend Mastery',
                duration: '3 months',
                actionPlan: [
                    'Learn Node.js fundamentals',
                    'Build REST APIs with Express',
                    'Master MongoDB and PostgreSQL',
                    'Implement authentication & authorization'
                ],
                resources: [
                    'Node.js Official Docs',
                    'Express.js Guide',
                    'MongoDB University'
                ],
                successCriteria: [
                    'Build 3 full REST APIs',
                    'Implement JWT authentication',
                    'Deploy APIs to production'
                ],
                status: 'pending' as const,
                color: 'bg-green-500',
                icon: 'Server'
            },
            {
                id: 'web-step-3',
                title: 'DevOps & Deployment',
                description: 'Learn containerization, CI/CD, and cloud deployment strategies.',
                goal: 'DevOps Skills',
                duration: '2 months',
                actionPlan: [
                    'Learn Docker basics',
                    'Set up CI/CD with GitHub Actions',
                    'Deploy to AWS or Vercel',
                    'Monitor application performance'
                ],
                resources: [
                    'Docker Documentation',
                    'GitHub Actions Tutorial',
                    'AWS Free Tier'
                ],
                successCriteria: [
                    'Containerize an application',
                    'Set up automated deployments',
                    'Monitor live applications'
                ],
                status: 'pending' as const,
                color: 'bg-purple-500',
                icon: 'Cloud'
            },
            {
                id: 'web-step-4',
                title: 'Professional Projects',
                description: 'Build real-world projects and prepare for job applications.',
                goal: 'Job Ready',
                duration: '2 months',
                actionPlan: [
                    'Build 2 full-stack applications',
                    'Contribute to open source',
                    'Prepare portfolio and resume',
                    'Practice coding interviews'
                ],
                resources: [
                    'LeetCode for interviews',
                    'GitHub for portfolio',
                    'LinkedIn for networking'
                ],
                successCriteria: [
                    'Complete 2 full-stack projects',
                    '5 open source contributions',
                    'Pass mock interviews'
                ],
                status: 'pending' as const,
                color: 'bg-pink-500',
                icon: 'Briefcase'
            }
        ]
    },
    {
        id: 'milestone-data-science',
        title: 'Data Science Career Track',
        description: 'Transform into a data scientist with skills in Python, ML, and data visualization.',
        totalSteps: 5,
        completedSteps: 2,
        steps: [
            {
                id: 'ds-step-1',
                title: 'Python Programming',
                description: 'Master Python programming and essential libraries for data science.',
                goal: 'Python Expert',
                duration: '2 months',
                actionPlan: [
                    'Learn Python basics',
                    'Master NumPy and Pandas',
                    'Practice with real datasets',
                    'Learn data cleaning techniques'
                ],
                resources: [
                    'Python.org Tutorial',
                    'Pandas Documentation',
                    'Kaggle Learn Python'
                ],
                successCriteria: [
                    'Complete 10 data analysis projects',
                    'Clean and process messy data',
                    'Write efficient Python code'
                ],
                status: 'completed' as const,
                feedback: 'Finished Python fundamentals. Working with Pandas is so powerful!',
                completedAt: '2024-02-01T14:20:00Z',
                color: 'bg-yellow-500',
                icon: 'Code'
            },
            {
                id: 'ds-step-2',
                title: 'Statistics & Mathematics',
                description: 'Build strong foundation in statistics and mathematical concepts for ML.',
                goal: 'Math Foundation',
                duration: '2 months',
                actionPlan: [
                    'Learn probability and statistics',
                    'Study linear algebra',
                    'Understand calculus basics',
                    'Apply math to real problems'
                ],
                resources: [
                    'Khan Academy Statistics',
                    'MIT OpenCourseWare',
                    'StatQuest YouTube Channel'
                ],
                successCriteria: [
                    'Solve statistical problems',
                    'Understand ML mathematics',
                    'Apply concepts to datasets'
                ],
                status: 'completed' as const,
                feedback: 'Math concepts are clearer now. Ready for machine learning!',
                completedAt: '2024-03-10T09:15:00Z',
                color: 'bg-orange-500',
                icon: 'Calculator'
            },
            {
                id: 'ds-step-3',
                title: 'Machine Learning',
                description: 'Learn supervised and unsupervised learning algorithms.',
                goal: 'ML Skills',
                duration: '3 months',
                actionPlan: [
                    'Study ML algorithms',
                    'Learn scikit-learn library',
                    'Build classification models',
                    'Practice with Kaggle competitions'
                ],
                resources: [
                    'Andrew Ng ML Course',
                    'Scikit-learn Documentation',
                    'Kaggle Competitions'
                ],
                successCriteria: [
                    'Build 5 ML models',
                    'Achieve 80%+ accuracy',
                    'Participate in Kaggle'
                ],
                status: 'pending' as const,
                color: 'bg-red-500',
                icon: 'Brain'
            },
            {
                id: 'ds-step-4',
                title: 'Deep Learning',
                description: 'Master neural networks and deep learning with TensorFlow or PyTorch.',
                goal: 'DL Expertise',
                duration: '3 months',
                actionPlan: [
                    'Learn neural network basics',
                    'Master TensorFlow/Keras',
                    'Build CNN and RNN models',
                    'Work on image and NLP projects'
                ],
                resources: [
                    'Fast.ai Course',
                    'TensorFlow Tutorial',
                    'PyTorch Documentation'
                ],
                successCriteria: [
                    'Build image classifier',
                    'Create NLP model',
                    'Deploy DL model'
                ],
                status: 'pending' as const,
                color: 'bg-indigo-500',
                icon: 'Network'
            },
            {
                id: 'ds-step-5',
                title: 'Data Science Portfolio',
                description: 'Build portfolio projects and prepare for data science interviews.',
                goal: 'Career Ready',
                duration: '2 months',
                actionPlan: [
                    'Complete 3 end-to-end projects',
                    'Create interactive dashboards',
                    'Write technical blog posts',
                    'Practice SQL and coding interviews'
                ],
                resources: [
                    'Tableau Public',
                    'Medium for blogging',
                    'LeetCode SQL problems'
                ],
                successCriteria: [
                    '3 portfolio projects deployed',
                    'Professional GitHub profile',
                    'Pass technical interviews'
                ],
                status: 'pending' as const,
                color: 'bg-teal-500',
                icon: 'Award'
            }
        ]
    }
];
