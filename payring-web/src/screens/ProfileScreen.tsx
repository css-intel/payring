// PayRing Web - Profile Settings Screen
import { useState } from 'react';
import { 
  Camera, 
  Edit2, BadgeCheck, Shield 
} from 'lucide-react';

export function ProfileScreen() {
  const [profile] = useState({
    firstName: 'Alex',
    lastName: 'Chen',
    username: '@alexc.design',
    email: 'alex.chen@designstudio.com',
    emailVerified: true,
    phone: '+1 (555) 123-4567',
    phoneVerified: true,
    accountVerified: true,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Photo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{profile.username}</p>
              {profile.accountVerified && (
                <div className="flex items-center gap-1 mt-1 text-green-600">
                  <BadgeCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified Account</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
          </div>

          {/* First Name */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
              <p className="text-gray-900 dark:text-white font-medium">{profile.firstName}</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Last Name */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
              <p className="text-gray-900 dark:text-white font-medium">{profile.lastName}</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Username */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
              <p className="text-gray-900 dark:text-white font-medium">{profile.username}</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Email */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-900 dark:text-white font-medium">{profile.email}</p>
                {profile.emailVerified && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Phone */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-900 dark:text-white font-medium">{profile.phone}</p>
                {profile.phoneVerified && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Account Verification Status */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Account Verified</h3>
              <p className="text-green-100">Your identity has been confirmed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
