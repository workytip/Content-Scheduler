import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { FaSpinner } from 'react-icons/fa';
import Spinner from '../components/Spinner';

const Settings = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    const res = await axios.get('/user/platforms');
    setPlatforms(res.data.platforms || []);
  };

  const handleToggle = async (platformId) => {
    setLoadingId(platformId); // Start spinner for this platform
    try {
      await axios.post(`/platforms/${platformId}/toggle`);
      await fetchPlatforms(); // Refresh list
    } finally {
      setLoadingId(null); // Stop spinner
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Platform Settings</h2>
      {platforms.length === 0 && loadingId === null ? (
        <div className="flex items-center gap-2">
          <Spinner />
          <span>Loading...</span>
        </div>
      ) : (
        <ul>
          {platforms.map(platform => (
            <li key={platform.id} className="flex items-center justify-between py-2 border-b">
              <span>{platform.name}</span>
              <button
                className={`px-3 py-1 rounded flex items-center gap-2 ${platform.is_active ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                onClick={() => handleToggle(platform.id)}
                disabled={loadingId === platform.id}
              >
                {loadingId === platform.id ? (
                  <Spinner />
                ) : (
                  platform.is_active ? 'Active' : 'Inactive'
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Settings;