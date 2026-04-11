import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Clock, Edit2, Save, X, 
  AlertCircle, CheckCircle, Loader, Key, Trash2, Leaf, Zap
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { logout, updateUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await API.get('/users/me');
        setUserData(response.data.user);
        setFormData(response.data.user);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setMessage('❌ Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address input change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address
      };

      const response = await API.patch('/users/me', updateData);
      setUserData(response.data.user);
      updateUser(response.data.user);
      setMessage('✅ Profile updated successfully');
      setIsEditing(false);
      setEditSection(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      await API.patch('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setMessage('✅ Password changed successfully');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to change password';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    setIsSaving(true);
    try {
      await API.delete('/users/me');
      
      logout();
      
      setMessage('✅ Account deleted successfully');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete account';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-[#0f55a7] animate-spin" strokeWidth={1.5} />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <User className="w-8 h-8 text-[#0f55a7]" strokeWidth={2.0} />
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {userData?.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userData?.fullName}</h2>
                <p className="text-white/80">{userData?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                  {userData?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#0f55a7]" strokeWidth={2.0} />
                Personal Information
              </h3>
              {!isEditing && (
                <button
                  onClick={() => {
                    setEditSection('personal');
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" strokeWidth={2.0} />
                  <span className="text-sm">Edit</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing && editSection === 'personal' ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f55a7]"
                  />
                ) : (
                  <p className="text-gray-700">{userData?.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-700">{userData?.email}</p>
                  {userData?.isEmailVerified && (
                    <span className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" strokeWidth={2.0} />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing && editSection === 'personal' ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f55a7]"
                  />
                ) : (
                  <p className="text-gray-700">{userData?.phone || 'Not provided'}</p>
                )}
              </div>
            </div>

            {isEditing && editSection === 'personal' && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" strokeWidth={2.0} />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditSection(null);
                    setFormData(userData);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2.0} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Address Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0f55a7]" strokeWidth={2.0} />
                Address
              </h3>
              {!isEditing && (
                <button
                  onClick={() => {
                    setEditSection('address');
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" strokeWidth={2.0} />
                  <span className="text-sm">Edit</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                {isEditing && editSection === 'address' ? (
                  <input
                    type="text"
                    name="street"
                    value={formData.address?.street || ''}
                    onChange={handleAddressChange}
                    placeholder="Enter street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f55a7]"
                  />
                ) : (
                  <p className="text-gray-700">{userData?.address?.street || 'Not provided'}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                {isEditing && editSection === 'address' ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.address?.city || ''}
                    onChange={handleAddressChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f55a7]"
                  />
                ) : (
                  <p className="text-gray-700">{userData?.address?.city || 'Not provided'}</p>
                )}
              </div>

              {/* Province & Postal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                  {isEditing && editSection === 'address' ? (
                    <input
                      type="text"
                      name="province"
                      value={formData.address?.province || ''}
                      onChange={handleAddressChange}
                      placeholder="Province"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f55a7]"
                    />
                  ) : (
                    <p className="text-gray-700">{userData?.address?.province || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  {isEditing && editSection === 'address' ? (
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.address?.postalCode || ''}
                      onChange={handleAddressChange}
                      placeholder="Postal code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f55a7]"
                    />
                  ) : (
                    <p className="text-gray-700">{userData?.address?.postalCode || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && editSection === 'address' && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" strokeWidth={2.0} />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditSection(null);
                    setFormData(userData);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2.0} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Impact & Contributions Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-[#4db848]" strokeWidth={2.0} />
              Your Contributions
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-green-600" strokeWidth={2.0} />
                  <span className="text-sm font-medium text-gray-700">E-Waste Items</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-600">Items submitted</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-blue-600" strokeWidth={2.0} />
                  <span className="text-sm font-medium text-gray-700">Pickup Requests</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-600">Requests made</p>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#0f55a7]" strokeWidth={2.0} />
              Account Activity
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Last Login:</span>
                <span className="font-medium">{userData?.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Never'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Account Created:</span>
                <span className="font-medium">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>

            <div className="space-y-3">
              {/* Change Password */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <span className="flex items-center gap-3 text-gray-700">
                  <Key className="w-5 h-5 text-[#0f55a7]" strokeWidth={2.0} />
                  Change Password
                </span>
                <span className="text-gray-400">→</span>
              </button>

              {/* Delete Account */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
              >
                <span className="flex items-center gap-3 text-red-700">
                  <Trash2 className="w-5 h-5 text-red-600" strokeWidth={2.0} />
                  Delete Account
                </span>
                <span className="text-red-400">→</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] p-6 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Key className="w-5 h-5" strokeWidth={2.0} />
                Change Password
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f55a7]"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f55a7]"
                  placeholder="Enter new password (min 6 chars)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f55a7]"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-red-600 p-6 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" strokeWidth={2.0} />
                Delete Account
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-red-600 font-semibold">⚠️ This action cannot be undone!</p>
              <p className="text-gray-700">
                Are you sure you want to permanently delete your account? All your profile data and submitted e-waste items will be removed.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;
