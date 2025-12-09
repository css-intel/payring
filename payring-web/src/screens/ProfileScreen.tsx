// PayRing Web - Profile Settings Screen
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Edit2, 
  BadgeCheck, 
  Shield,
  Save,
  X,
  ArrowLeft,
  Upload,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoSuccess, setPhotoSuccess] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: user?.displayName?.split(' ')[0] || 'Alex',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || 'Chen',
    username: user?.email?.split('@')[0] || 'alexc',
    email: user?.email || 'alex.chen@example.com',
    emailVerified: true,
    phone: '+1 (555) 123-4567',
    phoneVerified: true,
    accountVerified: true,
    avatarUrl: (user as any)?.avatarUrl || null,
  });
  
  const [editedProfile, setEditedProfile] = useState(profile);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!previewUrl) return;
    
    setUploadingPhoto(true);
    try {
      // Simulate upload - in real app would upload to Firebase Storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update profile with new photo
      setProfile(prev => ({ ...prev, avatarUrl: previewUrl }));
      setPhotoSuccess(true);
      
      setTimeout(() => {
        setShowPhotoModal(false);
        setPhotoSuccess(false);
        setPreviewUrl(null);
      }, 1500);
    } catch (error) {
      console.error('Failed to upload photo:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      // In production, update via auth service
      // await updateUserProfile({ displayName: `${editedProfile.firstName} ${editedProfile.lastName}` });
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Photo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </span>
                </div>
              )}
              <button 
                onClick={() => setShowPhotoModal(true)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
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
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
              {isEditing ? (
                <Input
                  value={editedProfile.firstName}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-medium">{profile.firstName}</p>
              )}
            </div>
          </div>

          {/* Last Name */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
              {isEditing ? (
                <Input
                  value={editedProfile.lastName}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-medium">{profile.lastName}</p>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
              {isEditing ? (
                <Input
                  value={editedProfile.username}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-medium">@{profile.username}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <>
                    <p className="text-gray-900 dark:text-white font-medium">{profile.email}</p>
                    {profile.emailVerified && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                        Verified
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <>
                    <p className="text-gray-900 dark:text-white font-medium">{profile.phone}</p>
                    {profile.phoneVerified && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                        Verified
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
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

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Update Profile Photo</h3>
              <button onClick={() => { setShowPhotoModal(false); setPreviewUrl(null); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {photoSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-medium text-green-600">Photo updated successfully!</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
                  ) : profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Current" className="w-32 h-32 rounded-full object-cover" />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                  
                  {previewUrl && (
                    <Button 
                      className="w-full"
                      onClick={handleUploadPhoto}
                      disabled={uploadingPhoto}
                    >
                      {uploadingPhoto ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Save Photo
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
