import React from 'react';
import axios from '../../api/axios';

const ProfileImageUpload = ({ imageUrl, setForm, setError }) => {
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/users/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.data?.url;
      if (url) setForm(f => ({ ...f, imageUrl: url }));
    } catch {
      setError('Image upload failed');
    }
  };

  return (
    <div>
      <label className="block font-semibold mb-1">Profile Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        className="w-full border px-3 py-2 rounded"
      />
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Profile"
          className="h-16 w-16 rounded-full mt-2 object-cover"
        />
      )}
    </div>
  );
};

export default ProfileImageUpload;