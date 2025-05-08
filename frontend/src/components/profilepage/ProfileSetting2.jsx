import React, { useState, useEffect } from 'react';
import { CalendarIcon, UserIcon, MapPinIcon, MailIcon, PhoneIcon, ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import Toast from '../Message/Toast';

const ProfileSettings2 = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "https://github.com/shadcn.png", // Default avatar
    joinDate: "",
    location: "",
    phone: "",
  });

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setUser({
            name: userData?.name || "User",
            email: userData?.email || "email@example.com",
            avatar: userData?.avatar || "",
            joinDate: formatDate(userData?.createdAt) || "Recently joined",
            location: userData?.location || "Not specified",
            phone: userData?.phone || "Not specified"
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    setIsSaving(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Here you would typically send an API request to update the user data
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        name: user.name,
        email: user.email,
        location: user.location,
        phone: user.phone
      }));

      setIsEditing(false);
      setIsSaving(false);
    }, 800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const backToMain = () => {
    navigate('/');
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/updatePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.status === 200) {
        showToast("Password updated successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error.message);
      showToast("Failed to update password. Please try again.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-4 right-4 z-50">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={backToMain}
              className="text-purple-800 hover:text-purple-700 transition-colors"
              aria-label="Back to main"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-purple-900">Profile Settings</h1>
          </div>
          <button
            onClick={isEditing ? handleSave : handleEdit}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isEditing
              ? "bg-yellow-500 text-purple-900 hover:bg-yellow-400"
              : "bg-purple-700 text-white hover:bg-purple-800"
              } ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="bg-purple-800 px-6 py-12 flex flex-col items-center justify-center relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg">
              <Avatar
                round={true}
                name={user?.name}
                size="90"
                className="shadow-sm w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="px-6 py-6 -mt-10 flex flex-col items-center">
            <div className="bg-white rounded-xl shadow-md px-8 py-4 w-full max-w-md">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-purple-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <PhoneIcon className="w-4 h-4 text-purple-600" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="w-4 h-4 text-purple-600" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                  <CalendarIcon className="w-4 h-4 text-purple-600" />
                  <span>Joined {user.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-purple-900 mb-6">Account Details</h2>

            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button
                  className={`pb-3 px-1 transition-colors font-medium ${activeTab === 'personal'
                    ? 'border-b-2 border-yellow-500 text-purple-800'
                    : 'text-gray-500 hover:text-purple-700'
                    }`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Info
                </button>
                <button
                  className={`pb-3 px-1 transition-colors font-medium ${activeTab === 'security'
                    ? 'border-b-2 border-yellow-500 text-purple-800'
                    : 'text-gray-500 hover:text-purple-700'
                    }`}
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </button>
              </div>
            </div>

            {/* Personal Tab Content */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      value={user.name}
                      readOnly={!isEditing}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none ${isEditing
                        ? "border-purple-300 focus:ring-2 focus:ring-purple-500"
                        : "bg-gray-50 text-gray-600"
                        }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={user.email}
                      readOnly={!isEditing}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none ${isEditing
                        ? "border-purple-300 focus:ring-2 focus:ring-purple-500"
                        : "bg-gray-50 text-gray-600"
                        }`}
                    />
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium text-gray-700">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={() => updatePassword()} className="px-6 py-3 bg-yellow-500 text-purple-900 font-medium rounded-lg hover:bg-yellow-400 transition-colors">
                    Update Password
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings2;