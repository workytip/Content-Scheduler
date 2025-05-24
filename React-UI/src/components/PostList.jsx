import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Spinner from './Spinner';


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
            <td className="border px-2 py-1">{post.title}</td>
            <td className="border px-2 py-1">{post.status}</td>
            <td className="border px-2 py-1">{post.scheduledTime}</td>
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
            <td colSpan={5} className="text-center py-4">
              No posts found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
);

export default PostList;