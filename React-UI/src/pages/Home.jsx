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
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

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

    // Convert local datetime to UTC ISO string
    const local = form.scheduledTime;
    const utc = new Date(local).toISOString();

    const formData = { ...form, scheduledTime: utc };

    try {
      let res;
      if (editingId) {
        res = await axios.put(`/posts/${editingId}`, formData);
        setSuccessMsg(res.data.message || 'Post updated!');
      } else {
        res = await axios.post('/posts', formData);
        setSuccessMsg(res.data.message || 'Post created!');
        setFilters({ status: '', date: '' });
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError(err.response.data.message); 
      } else {
        setError('Failed to create post.');
      }
    }
  };

  // Edit post
  const handleEdit = post => {
    setForm({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      scheduledTime: utcToLocalInput(post.scheduledTime), // <-- convert here
      status: post.status,
      platforms: post.platforms ? post.platforms.map(p => p.id) : [],
    });
    setEditingId(post.id);
    setShowForm(true);
    setSuccessMsg('');
    setError('');
  };

  // Delete post
  const handleDeleteClick = id => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    if (!postToDelete) return;
    setError('');
    setSuccessMsg('');
    try {
      const res = await axios.delete(`/posts/${postToDelete}`);
      setSuccessMsg(res.data.message || 'Post deleted!');
      fetchPosts();
    } catch {
      setError('Failed to delete post');
    }
    setPostToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/posts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data?.url;
    } catch {
      throw new Error('Image upload failed');
    }
  };

  function utcToLocalInput(utcString) {
    if (!utcString) return '';
    const date = new Date(utcString + (utcString.endsWith('Z') ? '' : 'Z'));
    // Pad to "YYYY-MM-DDTHH:mm"
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-grey-400">Posts</h1>
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
          handleImageUpload={handleImageUpload}
          setForm={setForm}
        />
      )}

      <PostFilter filters={filters} setFilters={setFilters} fetchPosts={fetchPosts} />

      <PostList
        posts={posts}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDeleteClick}
      />

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-xs text-center">
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;