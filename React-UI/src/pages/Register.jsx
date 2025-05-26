import axios from '../api/axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('/register', {
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            });
            setSuccess('Registration successful!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                // Show first validation error
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else {
                setError('Registration failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                {success && <div className="mb-4 text-green-600">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full border px-3 py-2 rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full border px-3 py-2 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full border px-3 py-2 rounded"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
