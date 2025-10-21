import { WelcomeSection } from '@/components/dashboard';
import DashboardGrid from '@/components/dashboard/DashboardGrid';
import AIAssistant from '@/components/common/AIAssistant';
import AppShell from '@/components/common/AppShell';

export default function Dashboard() {
  return (
    <AppShell>
      {/* Welcome Section */}
      <WelcomeSection />
      
      {/* Module Grid */}
      <DashboardGrid />

      {/* AI Assistant Widget */}
      <AIAssistant />
    </AppShell>
  );
}
