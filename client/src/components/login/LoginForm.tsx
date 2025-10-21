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
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
        <p className="text-gray-600">Enter your credentials to access your account</p>
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

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
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
          transition={{ delay: 0.5, duration: 0.5 }}
        >
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
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {formik.errors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Checkbox label="Remember me" />
          <Link href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700">
            Forgot password?
          </Link>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </motion.div>
      </form>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <FormDivider text="Or continue with" />
      </motion.div>

      {/* Social Login */}
      {/* Social SignUp */}
      <div className="grid grid-cols-2 gap-4">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>

      {/* Sign Up Link */}
      <motion.p
        className="mt-8 text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        Don't have an account?{' '}
        <Link href="/signup" className="font-semibold text-cyan-600 hover:text-cyan-700">
          Sign up
        </Link>
      </motion.p>
    </motion.div>
  );
}
