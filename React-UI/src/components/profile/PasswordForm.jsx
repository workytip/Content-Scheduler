import React from 'react';

const PasswordForm = ({
  passwords, handlePasswordChange, handlePasswordSubmit,
  passwordError, passwordSuccess
}) => (
  <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
    {passwordError && <div className="text-red-500">{passwordError}</div>}
    {passwordSuccess && <div className="text-green-600">{passwordSuccess}</div>}
    <div>
      <label className="block font-semibold mb-1">Current Password:</label>
      <input
        type="password"
        name="current_password"
        value={passwords.current_password}
        onChange={handlePasswordChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
    </div>
    <div>
      <label className="block font-semibold mb-1">New Password:</label>
      <input
        type="password"
        name="new_password"
        value={passwords.new_password}
        onChange={handlePasswordChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
    </div>
    <div>
      <label className="block font-semibold mb-1">Confirm New Password:</label>
      <input
        type="password"
        name="new_password_confirmation"
        value={passwords.new_password_confirmation}
        onChange={handlePasswordChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
    </div>
    <button
      type="submit"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Update Password
    </button>
  </form>
);

export default PasswordForm;