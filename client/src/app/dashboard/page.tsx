import {
  DashboardHeader,
  WelcomeSection,
} from '@/components/dashboard';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="max-w-7xl mx-auto">
          <WelcomeSection />
        </div>
      </main>
    </div>
  );
}
