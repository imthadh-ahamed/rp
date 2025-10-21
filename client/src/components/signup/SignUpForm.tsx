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
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  terms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);

      // Show loading toast
      const loadingToast = showToast.loading('Creating your account...');

      try {
        // Call the auth service to register
        const { user } = await authService.register({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        });

        // Dismiss loading toast
        showToast.dismiss(loadingToast);

        // Show success toast
        showToast.success(`Welcome, ${user.firstName}! Account created successfully.`);

        console.log('Registration successful!', user);

        // Navigate to dashboard after successful registration
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } catch (err: any) {
        // Dismiss loading toast
        showToast.dismiss(loadingToast);

        // Display error message from backend
        const errorMessage = err.message || 'Registration failed. Please try again.';
        setError(errorMessage);

        // Show error toast
        showToast.error(errorMessage);

        console.error('Registration error:', err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Sign up to get started</p>
      </div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* First Name Field */}
        <div>
          <FormInput
            id="firstName"
            name="firstName"
            type="text"
            label="First Name"
            placeholder="Enter your first name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            required
            disabled={loading}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
          )}
        </div>

        {/* Last Name Field */}
        <div>
          <FormInput
            id="lastName"
            name="lastName"
            type="text"
            label="Last Name"
            placeholder="Enter your last name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            required
            disabled={loading}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
          )}
        </div>

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
            placeholder="Create a password (min. 6 characters)"
            value={formik.values.password}
            onChange={formik.handleChange}
            required
            disabled={loading}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            required
            disabled={loading}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formik.values.terms}
              onChange={formik.handleChange}
              disabled={loading}
              className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link href="/terms" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Terms and Conditions
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Privacy Policy
              </Link>
            </label>
          </div>
          {formik.touched.terms && formik.errors.terms && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.terms}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" fullWidth disabled={loading || !formik.isValid}>
          {loading ? 'Creating Account...' : 'Create Account'}
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
