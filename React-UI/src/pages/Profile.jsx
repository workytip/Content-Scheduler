import axios from '../api/axios';
import Spinner from '../components/Spinner';
import { AuthContext } from '../context/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import PasswordForm from '../components/profile/PasswordForm';
import ActivityPanel from '../components/profile/ActivityPanel';
import React, { useEffect, useState, useContext } from 'react';

const Profile = () => {
  const { user: authUser, setUser } = useContext(AuthContext);
  const [user, setUserState] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', imageUrl: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!authUser) return;
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${authUser.id}`);
        const u = response.data.user || response.data.data;
        setUserState(u);
        setForm({
          name: u.name || '',
          email: u.email || '',
          imageUrl: u.imageUrl || '',
        });
      } catch (err) {
        setError('Failed to load user info.');
      }
    };
    fetchUser();
  }, [authUser]);

  const handleEdit = () => {
    setEditMode(true);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    });
    setSuccess('');
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(`/users/${authUser.id}`, form);
      const updatedUser = response.data.user || response.data.data;
      setUser(updatedUser); // <-- Update AuthContext user!
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Password update handlers
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    try {
      await axios.put(`/users/${authUser.id}/password`, passwords);
      setPasswordSuccess('Password updated successfully!');
      setPasswords({ current_password: '', new_password: '', new_password_confirmation: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to update password.'
      );
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 py-4 justify-center">
        <Spinner />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 flex flex-col md:flex-row gap-8">
      {/* Profile Section */}
      <div className="bg-white p-6 rounded shadow flex-1">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        {success && <div className="mb-2 text-green-600">{success}</div>}
        {editMode ? (
          <ProfileForm
            form={form}
            setForm={setForm}
            user={user}
            editMode={editMode}
            setEditMode={setEditMode}
            saving={saving}
            setError={setError}
            setSuccess={setSuccess}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        ) : (
          <>
            <div className="mb-4 flex items-center gap-4">
              {user.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div>
                <div className="mb-2">
                  <span className="font-semibold">Name:</span> {user.name}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Email:</span> {user.email}
                </div>
              </div>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          </>
        )}

        <hr className="my-6" />

        <div>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={() => setShowPasswordForm((v) => !v)}
          >
            {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
          </button>
          {showPasswordForm && (
            <PasswordForm
              passwords={passwords}
              handlePasswordChange={handlePasswordChange}
              handlePasswordSubmit={handlePasswordSubmit}
              passwordError={passwordError}
              passwordSuccess={passwordSuccess}
            />
          )}
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="w-full md:w-1/3">
        <ActivityPanel />
      </div>
    </div>
  );
};

export default Profile;