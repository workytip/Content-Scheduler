import React from 'react';

const PostFilter = ({ filters, setFilters, fetchPosts }) => (
  <div className="mb-4 flex gap-4">
    <select
      value={filters.status}
      onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
      className="border px-2 py-1 rounded"
    >
      <option value="">All Status</option>
      <option value="draft">Draft</option>
      <option value="scheduled">Scheduled</option>
      <option value="published">Published</option>
    </select>
    <input
      type="date"
      value={filters.date}
      onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
      className="border px-2 py-1 rounded"
    />
    <button onClick={fetchPosts} className="bg-blue-500 text-white px-3 py-1 rounded">
      Filter
    </button>
  </div>
);

export default PostFilter;