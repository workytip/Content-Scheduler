import React, { useEffect, useState } from 'react';
import PostAnalytics from '../components/PostAnalytics';
import api from '../api/axios';
import Spinner from '../components/Spinner';

const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      {loading ? (
        <div className="flex items-center gap-2 justify-center py-8">
          <Spinner />
          <span>Loading...</span>
        </div>
      ) : (
        <PostAnalytics posts={posts} />
      )}
    </div>
  );
};

export default Analytics;