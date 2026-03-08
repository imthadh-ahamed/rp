import { BookOpen, Briefcase, GraduationCap, LineChart, Rocket, Target } from 'lucide-react';

export const ROADMAP_STEPS = [
    {
        id: 1,
        title: 'Foundation Stage',
        goal: 'Build Core Knowledge',
        icon: BookOpen,
        color: 'bg-blue-500',
        lightColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        description: 'Start your journey by building a strong theoretical base and understanding core concepts.',
        duration: '4-6 Weeks',
        actionPlan: [
            'Complete "Introduction to Computer Science" (e.g., CS50)',
            'Practice basic syntax and logic on platforms like LeetCode (Easy)',
            'Build a simple static website or console application'
        ],
        resources: [
            { title: 'MDN Web Docs / W3Schools', url: 'https://developer.mozilla.org/en-US/' },
            { title: 'freeCodeCamp - Responsive Web Design', url: 'https://www.freecodecamp.org/learn/responsive-web-design/' },
            { title: 'GitHub - Git Handbook', url: 'https://guides.github.com/introduction/git-handbook/' }
        ],
        successCriteria: [
            'Understand variables, loops, functions, and data types',
            'Deploy a "Hello World" project to the web',
            'Commit code to a Git repository'
        ]
    },
    {
        id: 2,
        title: 'Skill Development',
        goal: 'Acquire Technical Proficiency',
        icon: Target,
        color: 'bg-purple-500',
        lightColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        description: 'Deepen your expertise by acquiring practical skills and specialized knowledge.',
        duration: '8-12 Weeks',
        actionPlan: [
            'Master a frontend framework (React, Vue, or Angular)',
            'Build a CRUD application with a backend service',
            'Learn state management (Redux, Context API)'
        ],
        resources: [
            { title: 'React Official Documentation', url: 'https://react.dev/' },
            { title: 'Full Stack Open (University of Helsinki)', url: 'https://fullstackopen.com/' },
            { title: 'YouTube: Traversy Media / Net Ninja', url: 'https://www.youtube.com/c/TraversyMedia' }
        ],
        successCriteria: [
            'Build and deploy a dynamic single-page application',
            'Implement user authentication',
            'Connect to a database and perform API requests'
        ]
    },
    {
        id: 3,
        title: 'Real-world Readiness',
        goal: 'Apply Skills in Context',
        icon: Briefcase,
        color: 'bg-green-500',
        lightColor: 'bg-green-50',
        textColor: 'text-green-600',
        description: 'Bridge the gap between theory and practice with real-world experience.',
        duration: 'Ongoing',
        actionPlan: [
            'Contribute to an open-source project',
            'Take on a freelance gig or volunteer project',
            'Participate in a hackathon'
        ],
        resources: [
            { title: 'Upwork / Fiverr (for freelancing)', url: 'https://www.upwork.com/' },
            { title: 'Good First Issue (for open source)', url: 'https://goodfirstissue.dev/' },
            { title: 'Devpost (for hackathons)', url: 'https://devpost.com/' }
        ],
        successCriteria: [
            'Merge a pull request into an external codebase',
            'Complete a project for a real user/client',
            'Work collaboratively in a team setting'
        ]
    },
    {
        id: 4,
        title: 'Performance Strategies',
        goal: 'Optimize Efficiency',
        icon: LineChart,
        color: 'bg-orange-500',
        lightColor: 'bg-orange-50',
        textColor: 'text-orange-600',
        description: 'Learn to work smarter, not just harder, by optimizing your workflow.',
        duration: '2-4 Weeks',
        actionPlan: [
            'Adopt a productivity system (Pomodoro, GTD)',
            'Learn keyboard shortcuts for your IDE',
            'Automate repetitive tasks with scripts'
        ],
        resources: [
            { title: 'Book: "Atomic Habits" by James Clear', url: 'https://www.amazon.com/Atomic-Habits-Tiny-Changes-Remarkable-Results/dp/0735211299' },
            { title: 'VS Code Keybinding Reference', url: 'https://code.visualstudio.com/docs/getstarted/keybindings' },
            { title: 'Zapier / IFTTT', url: 'https://zapier.com/' }
        ],
        successCriteria: [
            'Reduce development time for routine tasks',
            'Maintain a consistent coding schedule',
            'Document your workflow'
        ]
    },
    {
        id: 5,
        title: 'Knowledge Expansion',
        goal: 'Broaden Expertise',
        icon: GraduationCap,
        color: 'bg-red-500',
        lightColor: 'bg-red-50',
        textColor: 'text-red-600',
        description: 'Stay ahead of the curve by exploring further certifications and emerging trends.',
        duration: 'Continuous',
        actionPlan: [
            'Obtain a cloud certification (AWS, Azure, GCP)',
            'Explore AI/ML integration in web apps',
            'Read engineering blogs (Netflix, Uber, etc.)'
        ],
        resources: [
            { title: 'AWS Certified Cloud Practitioner', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/' },
            { title: 'Coursera - AI for Everyone', url: 'https://www.coursera.org/learn/ai-for-everyone' },
            { title: 'Hacker News / TechCrunch', url: 'https://news.ycombinator.com/' }
        ],
        successCriteria: [
            'Pass a recognized certification exam',
            'Implement a new technology in a side project',
            'Explain a complex system architecture'
        ]
    },
    {
        id: 6,
        title: 'Industry Polishing',
        goal: 'Establish Professional Identity',
        icon: Rocket,
        color: 'bg-indigo-500',
        lightColor: 'bg-indigo-50',
        textColor: 'text-indigo-600',
        description: 'Refine your professional profile and build a strong network for career success.',
        duration: '4 Weeks',
        actionPlan: [
            'Optimize LinkedIn profile and resume',
            'Build a personal portfolio website',
            'Conduct mock interviews'
        ],
        resources: [
            { title: 'LinkedIn Learning - Career Development', url: 'https://www.linkedin.com/learning/topics/career-development' },
            { title: 'Pramp / Interviewing.io', url: 'https://www.pramp.com/' },
            { title: 'Canva (for resume design)', url: 'https://www.canva.com/' }
        ],
        successCriteria: [
            'Receive interview invitations',
            'Grow LinkedIn network by 50+ relevant connections',
            'Showcase 3+ polished projects on portfolio'
        ]
    }
];
