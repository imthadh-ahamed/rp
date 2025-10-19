import LoginBranding from '@/components/login/LoginBranding';
import LoginForm from '@/components/login/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Logo/Branding */}
      <LoginBranding />

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <LoginForm />
      </div>
    </div>
  );
}
