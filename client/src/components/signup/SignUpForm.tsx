'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
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
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back to Home Button */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-600 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Sign up to get started</p>
      </motion.div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Error Message */}
        {error && (
          <motion.div
            className="p-3 rounded-lg bg-red-50 border border-red-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {/* First Name Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
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
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {formik.errors.firstName}
            </motion.p>
          )}
        </motion.div>

        {/* Last Name Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
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
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {formik.errors.lastName}
            </motion.p>
          )}
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
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
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {formik.errors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
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
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {formik.errors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
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
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {formik.errors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        {/* Terms and Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
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
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {formik.errors.terms}
            </motion.p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button type="submit" fullWidth disabled={loading || !formik.isValid}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </motion.div>
      </form>

      {/* Divider */}
      <FormDivider text="Or sign up with" />

      {/* Social SignUp */}
      <div className="grid grid-cols-2 gap-4">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>

      {/* Sign In Link */}
      <motion.p
        className="mt-8 text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-cyan-600 hover:text-cyan-700">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
