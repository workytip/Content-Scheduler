import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Spinner from '../components/Spinner';


const ActivityPanel = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/user/activities')
            .then(res => setActivities(res.data.data || []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white rounded shadow p-4 mt-6">
            <h3 className="font-bold mb-2">Recent Activity</h3>
            {loading ? (
                <div className="flex items-center gap-2 justify-center py-8">
                    <Spinner />
                    <span>Loading...</span>
                </div>
            ) : activities.length === 0 ? (
                <div className="text-gray-400">No recent activity.</div>
            ) : (
                <ul className="space-y-2">
                    {activities.map(a => (
                        <li key={a.id} className="text-sm text-gray-700">
                            <span className="font-semibold">{a.description}</span>
                            {/* Show post title if available */}
                            {a.properties && a.properties.title && (
                                <span className="ml-2 text-blue-600">({a.properties.title})</span>
                            )}
                            <span className="ml-2 text-gray-400">{new Date(a.created_at).toLocaleString()}</span>
                            {a.properties && (
                                <div className="text-xs text-gray-500 mt-1">
                                    {a.properties.ip && <span>IP: {a.properties.ip} </span>}
                                    {a.properties.user_agent && (
                                        <span className="block">Agent: {a.properties.user_agent}</span>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ActivityPanel;