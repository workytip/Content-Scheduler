import React from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6'];

const PostAnalytics = ({ posts }) => {
  // Posts per platform
  const platformCounts = {};
  posts.forEach(post => {
    (post.platforms || []).forEach(platform => {
      platformCounts[platform.name] = (platformCounts[platform.name] || 0) + 1;
    });
  });
  const platformData = Object.entries(platformCounts).map(([name, count]) => ({ name, count }));

  // Scheduled vs Published
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;

  // Publishing success rate
  const total = publishedCount + scheduledCount;
  const successRate = total ? Math.round((publishedCount / total) * 100) : 0;

  const statusData = [
    { name: 'Scheduled', value: scheduledCount },
    { name: 'Published', value: publishedCount },
  ];

  return (
    <div className="my-8">
      <h2 className="text-lg font-bold mb-4">Post Analytics</h2>
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 flex-1 min-w-[120px] text-center">
          <div className="text-sm text-gray-500">Scheduled</div>
          <div className="text-2xl font-bold text-blue-700">{scheduledCount}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded p-4 flex-1 min-w-[120px] text-center">
          <div className="text-sm text-gray-500">Published</div>
          <div className="text-2xl font-bold text-green-700">{publishedCount}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 flex-1 min-w-[120px] text-center">
          <div className="text-sm text-gray-500">Success Rate</div>
          <div className="text-2xl font-bold text-yellow-700">{successRate}%</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white border rounded p-4 shadow-sm">
          <div className="text-sm font-semibold mb-2">Posts per Platform</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={platformData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count">
                {platformData.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 bg-white border rounded p-4 shadow-sm">
          <div className="text-sm font-semibold mb-2">Scheduled vs Published</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {statusData.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PostAnalytics;