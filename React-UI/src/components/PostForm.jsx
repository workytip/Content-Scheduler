import React from 'react';

const PostForm = ({
  form,
  platforms,
  editingId,
  handleChange,
  handlePlatformChange,
  handleSubmit,
  handleCancel,
}) => (
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

export default PostForm;