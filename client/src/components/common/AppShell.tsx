import DashboardHeader from '@/components/common/Header';
import DashboardFooter from '@/components/common/Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-white flex flex-col">
      {/* Header */}
      <DashboardHeader />
      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
