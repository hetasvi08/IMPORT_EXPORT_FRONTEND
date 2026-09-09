import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar,
  Camera,
  Save,
  Edit3,
  X,
  CheckCircle,
  Briefcase,
  Upload,
  Loader2
} from 'lucide-react';

import { apiconnector } from '../../services/apiconnector';
import { userEndpoints } from '../../services/apis';
import { authEndpoints } from '../../services/apis';
import { setUser } from '../../store/slices/authSlice';

const DashboardProfile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    postalCode: user?.postalCode || '',
    bio: user?.bio || '',
  });

  const [profileImage, setProfileImage] = useState(user?.avatar || '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const uploadToCloudinary = async (file) => {
    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiconnector(
        'POST',
        userEndpoints.UPLOAD_PROFILE_PHOTO_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      
      if (response.data.success) {
        setProfileImage(response.data.data.avatar);
        
        // Update Redux store with new user data
        dispatch(setUser(response.data.data.user));
        
        
      }
    } catch (error) {
      
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        
        return;
      }
      
      uploadToCloudinary(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      const response = await apiconnector(
        'PUT',
        authEndpoints.UPDATE_PROFILE_API,
        profileData,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );
      
      if (response.data.success) {
        // Update Redux store with new user data
        dispatch(setUser(response.data.data));
        
        
        setIsEditing(false);
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || '',
      postalCode: user?.postalCode || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-[slideInLeft_0.5s_ease-out]">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Edit3 size={18} /> 
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-500 animate-[fadeInUp_0.6s_ease-out]">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full shadow-xl ring-4 ring-white group-hover:ring-teal-100 transition-all duration-300 overflow-hidden bg-white">
                  {uploadingImage ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 flex flex-col items-center justify-center z-10 rounded-full">
                      <Loader2 className="text-white animate-spin mb-2" size={32} />
                      <p className="text-white text-xs font-semibold">Updating</p>
                      <p className="text-white text-xs font-semibold">Profile Image</p>
                    </div>
                  ) : null}
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover object-center" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black">
                      <span>{getInitials(profileData.name)}</span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={handleImageClick}
                      disabled={uploadingImage}
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-600/80 to-cyan-600/80 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
                    >
                      <Upload className="text-white mb-1" size={28} />
                      <span className="text-white text-xs font-semibold">Upload Photo</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </>
                )}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white hover:scale-110 transition-transform duration-300 cursor-pointer" onClick={handleImageClick}>
                  <Camera className="text-white" size={20} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mt-6 animate-[fadeInUp_0.7s_ease-out]">{profileData.name}</h2>
              <p className="text-gray-600 text-sm mt-1 animate-[fadeInUp_0.8s_ease-out]">{profileData.email}</p>
              <div className="mt-6 w-full pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-sm p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl animate-[fadeInUp_0.9s_ease-out]">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    Member Since
                  </span>
                  <span className="font-black text-gray-900">Jan 2026</span>
                </div>
                <div className="flex items-center justify-between text-sm p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl animate-[fadeInUp_1s_ease-out]">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <Briefcase size={16} className="text-purple-600" />
                    Total Orders
                  </span>
                  <span className="font-black text-gray-900">42</span>
                </div>
                <div className="flex items-center justify-between text-sm p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl animate-[fadeInUp_1.1s_ease-out]">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Status
                  </span>
                  <span className="flex items-center gap-1 font-black text-green-600">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 animate-[fadeInUp_1.2s_ease-out] group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
                <User size={16} />
                Profile Completion
              </h3>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-black">85%</span>
                <span className="text-sm text-white/90 mb-3">Complete</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-white to-white/90 rounded-full h-3 transition-all duration-1000 ease-out shadow-lg" 
                  style={{ width: '85%' }}
                ></div>
              </div>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <CheckCircle size={14} />
                Almost there! Add more details to complete
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-500 animate-[fadeInUp_0.7s_ease-out]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="text-white" size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Personal Information</h3>
                <p className="text-xs text-gray-500">Update your personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={14} className="text-teal-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-teal-300"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={14} className="text-blue-600" />
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                    placeholder="your@email.com"
                  />
                </div>
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle size={12} />
                  Email cannot be changed
                </p>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={14} className="text-green-600" />
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-green-300"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 size={14} className="text-purple-600" />
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-purple-300"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div className="md:col-span-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={14} className="text-indigo-600" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none hover:border-indigo-300"
                  placeholder="Tell us about yourself and your business..."
                />
                <p className="text-xs text-gray-500 mt-1.5">Brief description for your profile</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-500 animate-[fadeInUp_0.8s_ease-out]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="text-white" size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Address Information</h3>
                <p className="text-xs text-gray-500">Manage your shipping address</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={14} className="text-pink-600" />
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-pink-300"
                  placeholder="123 Main Street, Apartment 4B"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 size={14} className="text-orange-600" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-orange-300"
                  placeholder="New York"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={14} className="text-cyan-600" />
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={profileData.postalCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-cyan-300"
                  placeholder="10001"
                />
              </div>

              <div className="md:col-span-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={14} className="text-blue-600" />
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-blue-300"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3 animate-[fadeInUp_0.9s_ease-out]">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default DashboardProfile;
