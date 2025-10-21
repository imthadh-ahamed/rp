'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormInput, Button, Checkbox, FormDivider, SocialButton, showToast } from '@/components/ui';
import authService from '@/services/auth.service';

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);

      // Show loading toast
      const loadingToast = showToast.loading('Signing in...');

      try {
        // Call the auth service to login
        const { user } = await authService.login({
          email: values.email,
          password: values.password,
        });
        
        // Dismiss loading toast
        showToast.dismiss(loadingToast);
        
        // Show success toast
        showToast.success(`Welcome back, ${user.firstName}!`);
        
        console.log('Login successful!', user);
        
        // Navigate to dashboard after successful login
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } catch (err: any) {
        // Dismiss loading toast
        showToast.dismiss(loadingToast);
        
        // Display error message from backend
        const errorMessage = err.message || 'Login failed. Please try again.';
        setError(errorMessage);
        
        // Show error toast
        showToast.error(errorMessage);
        
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
        <p className="text-gray-600">Enter your credentials to access your account</p>
      </div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div>
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            required
            disabled={loading}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            required
            disabled={loading}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" />
          <Link href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
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
