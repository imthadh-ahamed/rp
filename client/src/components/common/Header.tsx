'use client';

import Image from 'next/image';
import { Avatar, IconButton } from '@/components/ui';

export default function DashboardHeader() {
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
            <div className="flex items-center space-x-3">
              <Avatar initials="U" size="md" gradient="from-cyan-500 to-teal-500" />
              <IconButton
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                }
                onClick={() => {}}
                ariaLabel="User menu"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
