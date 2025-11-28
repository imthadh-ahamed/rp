import AppShell from '@/components/common/AppShell';
import {
    CourseSuggestionHeader,
    CourseList
} from '@/components/course-suggestion';

export default function CourseSuggestionPage() {
    return (
        <AppShell>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <CourseSuggestionHeader />
                <CourseList />
            </div>
        </AppShell>
    );
}
