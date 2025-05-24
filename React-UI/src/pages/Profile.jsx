import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  // Password change state
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
        setUser(response.data.user || response.data.data); // adjust if needed
        setForm({
          name: response.data.user?.name || response.data.data?.name || '',
          email: response.data.user?.email || response.data.data?.email || '',
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
    setForm({ name: user.name, email: user.email });
    setSuccess('');
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(`/users/${authUser.id}`, form);
      setUser(response.data.user || response.data.data);
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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
      {success && <div className="mb-2 text-green-600">{success}</div>}
      {editMode ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="mb-2">
            <span className="font-semibold">Name:</span> {user.name}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Email:</span> {user.email}
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
          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
            {passwordError && <div className="text-red-500">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-600">{passwordSuccess}</div>}
            <div>
              <label className="block font-semibold mb-1">Current Password:</label>
              <input
                type="password"
                name="current_password"
                value={passwords.current_password}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">New Password:</label>
              <input
                type="password"
                name="new_password"
                value={passwords.new_password}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Confirm New Password:</label>
              <input
                type="password"
                name="new_password_confirmation"
                value={passwords.new_password_confirmation}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;