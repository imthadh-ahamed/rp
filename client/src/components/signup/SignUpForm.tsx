'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormInput, Button, Checkbox, FormDivider, SocialButton } from '@/components/ui';

export default function SignUpForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simulate successful signup
    // In production, replace this with actual API call
    console.log('Account created successfully!');
    
    // Navigate to login page after successful signup
    router.push('/login');
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Sign up to get started</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name Field */}
        <FormInput
          id="name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          required
        />

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
          placeholder="Create a password"
          required
        />

        {/* Confirm Password Field */}
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          required
        />

        {/* Terms and Conditions */}
        <Checkbox id="terms" required>
          I agree to the{' '}
          <Link href="/terms" className="text-cyan-600 hover:text-cyan-700 font-medium">
            Terms and Conditions
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-cyan-600 hover:text-cyan-700 font-medium">
            Privacy Policy
          </Link>
        </Checkbox>

        {/* Submit Button */}
        <Button type="submit" fullWidth>
          Create Account
        </Button>
      </form>

      {/* Divider */}
      <FormDivider text="Or sign up with" />

      {/* Social SignUp */}
      <div className="grid grid-cols-2 gap-4">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>

      {/* Sign In Link */}
      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-cyan-600 hover:text-cyan-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
