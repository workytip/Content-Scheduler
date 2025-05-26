import React from 'react';
import api from '../api/axios'; 

const PostForm = ({
  form,
  platforms,
  editingId,
  handleChange,
  handlePlatformChange,
  handleSubmit,
  handleCancel,
  setForm, 
}) => {
  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const url = res.data?.data?.url;
      if (url) setForm(f => ({ ...f, imageUrl: url }));
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2 bg-gray-50 p-4 rounded">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border px-2 py-1 rounded"
        required
      />
      <textarea
        name="content"
        placeholder="Content"
        value={form.content}
        onChange={handleChange}
        className="w-full border px-2 py-1 rounded"
        required
      />
      <div className="text-right text-sm mt-1 text-gray-400">
        {form.content.length} characters
      </div>
      <div className="flex items-center gap-2">
        <label
          htmlFor="image-upload"
          className="p-3 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 flex items-center justify-center"
          style={{ width: 60, height: 35 }}
          title="Upload Image"
        >
          {/* Camera Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2-3h6l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          pattern="https?://.+"
          title="Please enter a valid URL (must start with http:// or https://)"
        />
        {form.imageUrl && (
          <img src={form.imageUrl} alt="Preview" className="h-12 rounded" />
        )}
      </div>
      <input
        type="datetime-local"
        name="scheduledTime"
        value={form.scheduledTime}
        onChange={handleChange}
        className="w-full border px-2 py-1 rounded"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border px-2 py-1 rounded"
        required
      >
        <option value="">Select Status</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
      </select>
      <select
        multiple
        value={form.platforms}
        onChange={handlePlatformChange}
        className="w-full border px-2 py-1 rounded"
      >
        {platforms.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {editingId ? 'Update Post' : 'Create Post'}
      </button>

      <button
        type="button"
        className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </form>
  );
};

export default PostForm;