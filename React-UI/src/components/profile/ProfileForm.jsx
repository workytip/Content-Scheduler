import React from 'react';
import ProfileImageUpload from './ProfileImageUpload';

const ProfileForm = ({
  form, setForm, user, editMode, setEditMode, saving, setError, setSuccess, handleSave, handleCancel
}) => (
  <form onSubmit={handleSave} className="space-y-4">
    <ProfileImageUpload
      imageUrl={form.imageUrl || user.imageUrl}
      setForm={setForm}
      setError={setError}
    />
    <div>
      <label className="block font-semibold mb-1">Name:</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        className="w-full border px-3 py-2 rounded"
        required
      />
    </div>
    <div>
      <label className="block font-semibold mb-1">Email:</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        className="w-full border px-3 py-2 rounded"
        required
      />
    </div>
    <div className="flex gap-2">
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      <button
        type="button"
        className="bg-gray-300 px-4 py-2 rounded"
        onClick={handleCancel}
        disabled={saving}
      >
        Cancel
      </button>
    </div>
  </form>
);

export default ProfileForm;