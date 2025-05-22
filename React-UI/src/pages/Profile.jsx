import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/user');
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user info.');
      }
    };
    fetchUser();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
      <div className="mb-2">
        <span className="font-semibold">Name:</span> {user.name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Email:</span> {user.email}
      </div>
      
    </div>
  );
};

export default Profile;