'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormInput, Button, Checkbox, FormDivider, SocialButton } from '@/components/ui';

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simulate successful login
    // In production, replace this with actual API call
    console.log('Login successful!');
    
    // Navigate to dashboard after successful login
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
        <p className="text-gray-600">Enter your credentials to access your account</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Field */}
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          required
        />

        {/* Password Field */}
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" />
          <Link href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" fullWidth>
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <FormDivider text="Or continue with" />

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-4">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>

      {/* Sign Up Link */}
      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="font-semibold text-cyan-600 hover:text-cyan-700">
          Sign up
        </Link>
      </p>
    </div>
  );
}
