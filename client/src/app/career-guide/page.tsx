import AppShell from '@/components/common/AppShell';
import {
  CareerGuideHeader,
  IntroductionSection,
  SuccessStories,
  NextStepsSection
} from '@/components/career-guide';

export default function CareerGuidePage() {
  return (
    <AppShell>
      <CareerGuideHeader />
      <IntroductionSection />
      <NextStepsSection />
      <SuccessStories />
    </AppShell>
  );
}
