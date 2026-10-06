import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUser, FaCloudUploadAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { validateName } from '../../utils/validation';

const ProfilePage = () => {
  const { user, updateUserLocal } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [nameError, setNameError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateName(name);
    setNameError(validationError);
    if (validationError) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('phone', phone);
      if (avatarFile) fd.append('avatar', avatarFile);
      const { data } = await api.put('/users/me', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUserLocal(data.data);
      toast.success('Profile updated');
    } catch (err) {
      const validationErrors = err?.response?.data?.errors || [];
      const nameError = validationErrors.find((error) => error.toLowerCase().includes('name'));
      if (nameError) {
        setNameError(nameError);
      } else {
        toast.error(err?.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-heading font-bold text-ink">Profile Settings</h1>

      <form onSubmit={handleProfileSubmit} className="card p-6 space-y-4">
        <div className="flex items-center gap-2 font-heading font-semibold text-ink mb-2"><FaUser className="text-primary" /> Personal Info</div>

        <div className="flex items-center gap-4">
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : (user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name}`)}
            alt=""
            className="w-16 h-16 rounded-full object-cover"
          />
          <label className="btn-secondary text-sm cursor-pointer">
            <FaCloudUploadAlt /> Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files[0])} />
          </label>
        </div>

        <div>
          <input
            required
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(''); }}
            placeholder="Full name"
            className="input-field"
          />
          {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
        </div>
        <input type="tel" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Phone number" className="input-field" />
        <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed" />

        <button type="submit" disabled={busy} className="btn-primary">{busy ? 'Saving...' : 'Save Changes'}</button>
      </form>

    </div>
  );
};

export default ProfilePage;
