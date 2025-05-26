import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Spinner from './Spinner';


const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2-3h6l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const PostList = ({ posts, loading, handleEdit, handleDelete }) => (
  loading ? (
    <div className="flex items-center gap-2 py-4 justify-center">
      <Spinner />
      <span>Loading...</span>
    </div>
  ) : (
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border px-2 py-1">Image</th>
          <th className="border px-2 py-1">Title</th>
          <th className="border px-2 py-1">Status</th>
          <th className="border px-2 py-1">Scheduled</th>
          <th className="border px-2 py-1">Platforms</th>
          <th className="border px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map(post => (
          <tr key={post.id}>
            <td className="border px-2 py-1 text-center">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="h-10 w-10 object-cover rounded mx-auto"
                />
              ) : (
                <CameraIcon />
              )}
            </td>
            <td className="border px-2 py-1">{post.title}</td>
            <td className="border px-2 py-1">{post.status}</td>
            <td className="border px-2 py-1">
              {post.scheduledTime
                ? new Date(post.scheduledTime + 'Z').toLocaleString()
                : ''}
            </td>
            <td className="border px-2 py-1">
              {(post.platforms || []).map(p => p.name).join(', ')}
            </td>
            <td className="border px-2 py-1">
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded flex items-center justify-center"
                  style={{ width: 36, height: 36 }}
                  title="Edit"
                  onClick={() => handleEdit(post)}
                >
                  <FaEdit />
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded flex items-center justify-center"
                  style={{ width: 36, height: 36 }}
                  title="Delete"
                  onClick={() => handleDelete(post.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {posts.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center py-4">
              No posts found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
);

export default PostList;