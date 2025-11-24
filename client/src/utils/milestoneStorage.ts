export interface Milestone {
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

const STORAGE_KEY = 'career_guide_milestones';

export const saveMilestones = (milestones: Milestone[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
    }
};

export const getMilestones = (): Milestone[] => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }
    return [];
};

export const addMilestone = (milestone: Milestone) => {
    const milestones = getMilestones();
    milestones.push(milestone);
    saveMilestones(milestones);
};

export const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    const milestones = getMilestones();
    const index = milestones.findIndex(m => m.id === id);
    if (index !== -1) {
        milestones[index] = { ...milestones[index], ...updates };
        saveMilestones(milestones);
    }
};

export const deleteMilestone = (id: string) => {
    const milestones = getMilestones();
    const filtered = milestones.filter(m => m.id !== id);
    saveMilestones(filtered);
};

export const clearMilestones = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
};
