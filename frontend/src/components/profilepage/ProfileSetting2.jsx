import React, { useState,useEffect } from 'react';
import { CalendarIcon, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSetting2 = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://github.com/shadcn.png",
    joinDate: "January 15, 2023",
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
  }
  );
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    // Here you would typically send an API request to update the user data
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const backToMain = () => {
    navigate('/');
  };
  useEffect(() => {
      const fetchProfileData = async () => {
        try {
          const userData = JSON.parse(localStorage.getItem('user'));
          console.log(userData);
          setUser({
            name: userData?.name,
            Joindate: userData?.createdAt,
            email: userData?.email,
            avatar: "https://github.com/shadcn.png",
            joinDate: "January 15, 2023",
            occupation: "Software Engineer",
            location: "San Francisco, CA",
            phone: "+1 (555) 123-4567"
          })
        } catch (error) {
          // console.error('Error fetching profile data:', error);
        }
      }
      fetchProfileData(); // Fetch profile data when the component mounts
    }, []);
  

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <button 
          onClick={isEditing ? handleSave : handleEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
              <span className="flex items-center text-sm text-gray-500">
                <User className="w-4 h-4 mr-1" />
                {user.occupation}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {user.location}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Joined {user.joinDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Account Details</h2>
          <div className="border-b mb-4">
            <div className="flex space-x-4">
              <button
                className={`pb-2 px-1 ${activeTab === 'personal' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Info
              </button>
              <button
                className={`pb-2 px-1 ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
              <button
                className={`pb-2 px-1 ${activeTab === 'preferences' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('preferences')}
              >
                Preferences
              </button>
            </div>
          </div>

          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    value={user.name}
                    readOnly={!isEditing}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input
                    id="email"
                    name="email"
                    value={user.email}
                    readOnly={!isEditing}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="occupation" className="text-sm font-medium">Occupation</label>
                  <input
                    id="occupation"
                    name="occupation"
                    value={user.occupation}
                    readOnly={!isEditing}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="location" className="text-sm font-medium">Location</label>
                  <input
                    id="location"
                    name="location"
                    value={user.location}
                    readOnly={!isEditing}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    value={user.phone}
                    readOnly={!isEditing}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
                  <input
                    id="current-password"
                    type="password"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Change Password
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="2fa" className="rounded" />
                  <label htmlFor="2fa">Enable Two-Factor Authentication</label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-notifications" className="rounded" />
                  <label htmlFor="email-notifications">Email Notifications</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="push-notifications" className="rounded" />
                  <label htmlFor="push-notifications">Push Notifications</label>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Language and Region</h3>
                <div className="grid gap-2">
                  <label htmlFor="language" className="text-sm font-medium">Preferred Language</label>
                  <select id="language" className="w-full p-2 border rounded">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="timezone" className="text-sm font-medium">Timezone</label>
                  <select id="timezone" className="w-full p-2 border rounded">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Central European Time (CET)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={backToMain}
            className="flex items-center mt-4 gap-2 text-white bg-purple-800 p-2 px-4 rounded-xl hover:bg-violet-600 transition-colors hover:cursor-pointer"
          >
            Back to main
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting2;