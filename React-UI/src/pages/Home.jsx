import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import PostFilter from '../components/PostFilter';

const initialForm = {
  title: '',
  content: '',
  imageUrl: '',
  scheduledTime: '',
  status: '',
  platforms: [],
};

const Home = () => {
  const { user: authUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [filters, setFilters] = useState({ status: '', date: '' });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForm, setShowForm] = useState(false); // <-- Add this

  // Fetch platforms for select
  useEffect(() => {
    axios.get('/platforms')
      .then(res => setPlatforms(res.data.platforms || res.data.data || []))
      .catch(() => setPlatforms([]));
  }, []);

  // Fetch posts with filters
  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      const res = await axios.get('/posts', { params });
      setPosts(res.data.data || []);
    } catch {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [filters]);

  // Handle form input
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Handle platform select (multi-select)
  const handlePlatformChange = e => {
    const options = Array.from(e.target.selectedOptions, opt => Number(opt.value));
    setForm(f => ({ ...f, platforms: options }));
  };

  // Create or update post
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validate scheduledTime is not before now
    if (form.scheduledTime) {
      const scheduled = new Date(form.scheduledTime);
      const now = new Date();
      if (scheduled < now) {
        setError('Scheduled time cannot be before the current date and time.');
        return;
      }
    }

    try {
      let res;
      if (editingId) {
        res = await axios.put(`/posts/${editingId}`, form);
        setSuccessMsg(res.data.message || 'Post updated!');
      } else {
        res = await axios.post('/posts', form);
        setSuccessMsg(res.data.message || 'Post created!');
        setFilters({ status: '', date: '' });
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false); // <-- Hide form after submit
      fetchPosts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to save post'
      );
    }
  };

  // Edit post
  const handleEdit = post => {
    setForm({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      scheduledTime: post.scheduledTime,
      status: post.status,
      platforms: post.platforms ? post.platforms.map(p => p.id) : [],
    });
    setEditingId(post.id);
    setShowForm(true); // <-- Show form when editing
    setSuccessMsg('');
    setError('');
  };

  // Delete post
  const handleDelete = async id => {
    if (!window.confirm('Delete this post?')) return;
    setError('');
    setSuccessMsg('');
    try {
      const res = await axios.delete(`/posts/${id}`);
      setSuccessMsg(res.data.message || 'Post deleted!');
      fetchPosts();
    } catch {
      setError('Failed to delete post');
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false); 
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Show button if not editing/creating */}
      {!showForm && (
        <button
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setForm(initialForm);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          Create New Post
        </button>
      )}

      {/* Show form only if showForm is true */}
      {showForm && (
        <PostForm
          form={form}
          platforms={platforms}
          editingId={editingId}
          handleChange={handleChange}
          handlePlatformChange={handlePlatformChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      )}

      <PostFilter filters={filters} setFilters={setFilters} fetchPosts={fetchPosts} />

      <PostList
        posts={posts}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Home;