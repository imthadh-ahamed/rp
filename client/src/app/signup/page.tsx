import SignUpBranding from '@/components/signup/SignUpBranding';
import SignUpForm from '@/components/signup/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Logo/Branding */}
      <SignUpBranding />

      {/* Right Side - SignUp Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <SignUpForm />
      </div>
    </div>
  );
}
