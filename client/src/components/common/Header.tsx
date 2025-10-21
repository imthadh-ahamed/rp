
'use client';
import React from 'react';

import Image from 'next/image';
import { Avatar, IconButton } from '@/components/ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CurrentUser } from '@/types/currentUser';
import authService from '@/services/auth.service';

export default function DashboardHeader() {
  const user = useSelector((state: RootState) => state.user.userData) as CurrentUser | null;
  // Compute initials from user name
  let initials = 'U';
  if (user) {
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    initials = (first + last).toUpperCase() || 'U';
  }

  // Dropdown state
  const [open, setOpen] = React.useState(false);
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.avatar-dropdown')) setOpen(false);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/AspireAI.png"
              alt="AspireAI"
              width={40}
              height={40}
              className="drop-shadow-md"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              AspireAI
            </span>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <IconButton
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
              onClick={() => {}}
              ariaLabel="Notifications"
            />
            <div className="flex items-center space-x-3 avatar-dropdown relative">
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open user menu"
              >
                <Avatar initials={initials} size="md" gradient="from-cyan-500 to-teal-500" />
              </button>
              <IconButton
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                }
                onClick={() => setOpen((v) => !v)}
                ariaLabel="User menu"
                className="text-sm"
              />
              {open && (
                <div className="absolute right-0 top-12 z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-4 px-6 flex flex-col gap-2">
                  <div className="font-semibold text-gray-900 text-base mb-1">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {user?.email || 'No email'}
                  </div>
                  <button
                    className="mt-2 w-full py-2 px-4 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition text-sm font-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
