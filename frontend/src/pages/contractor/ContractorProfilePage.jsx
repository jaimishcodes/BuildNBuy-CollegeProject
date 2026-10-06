import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt, FaPlus } from 'react-icons/fa';
import VerificationBanner from '../../components/dashboard/VerificationBanner';
import { contractorApi } from '../../services/contractorApi';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/format';
import CityInput from '../../components/common/CityInput';

const ContractorProfilePage = () => {
  const { updateUserLocal } = useAuth();
  const [profile, setProfile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [form, setForm] = useState({
    name: '', companyName: '', about: '', experienceYears: 0, city: '', state: '', address: '',
    specializations: '', servicesOffered: '', minBudget: '', maxBudget: '', availability: 'Available',
  });

  useEffect(() => {
    contractorApi.me().then(({ data }) => {
      const p = data.data;
      setProfile(p);
      setForm({
        name: p.user?.name || '',
        companyName: p.companyName || '',
        about: p.about || '',
        experienceYears: p.experienceYears || 0,
        city: p.location?.city || '',
        state: p.location?.state || '',
        address: p.location?.address || '',
        specializations: (p.specializations || []).join(', '),
        servicesOffered: (p.servicesOffered || []).join(', '),
        minBudget: p.minBudget || '',
        maxBudget: p.maxBudget || '',
        availability: p.availability || 'Available',
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('');
      return undefined;
    }
    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  useEffect(() => {
    setAvatarError(false);
  }, [avatarPreview, profile?.user?.avatar?.url]);

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreview('');
      return undefined;
    }
    const previewUrl = URL.createObjectURL(bannerFile);
    setBannerPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [bannerFile]);

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatarFile) fd.append('avatar', avatarFile);
      if (bannerFile) fd.append('coverImage', bannerFile);
      const { data } = await contractorApi.updateMe(fd);
      setProfile(data.data);
      updateUserLocal(data.data.user);
      setAvatarFile(null);
      setBannerFile(null);
      toast.success('Contractor profile updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setBusy(false);
    }
  };

  if (!profile) return <div className="skeleton h-96 w-full" />;

  const profileImage = profile.user?.avatar?.url || '';
  const previewImage = avatarPreview || profileImage;
  const profileName = profile.user?.name || profile.companyName || 'Contractor';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-heading font-bold text-ink mb-4">Contractor Profile</h1>
      <div className="card p-5 mb-4 flex items-center gap-4">
        <label className="relative block w-20 h-20 shrink-0 cursor-pointer group" title="Change profile photo">
          {previewImage && !avatarError ? (
            <img
              src={previewImage}
              alt={profileName}
              onError={() => setAvatarError(true)}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-card bg-primary/10"
            />
          ) : (
            <span className="w-20 h-20 rounded-full border-4 border-white shadow-card bg-primary/10 text-primary font-heading font-bold text-xl flex items-center justify-center">
              {getInitials(form.name || profileName)}
            </span>
          )}
          <span className="absolute right-0 bottom-0 w-7 h-7 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center shadow-card group-hover:bg-blue-700" aria-hidden="true"><FaPlus className="text-xs" /></span>
          <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" aria-label="Change profile photo" className="hidden" onChange={(event) => setAvatarFile(event.target.files?.[0] || null)} />
        </label>
        <div>
          <h2 className="text-lg font-heading font-semibold text-ink">{profile.user?.name || 'Contractor'}</h2>
          <p className="text-sm text-muted">{profile.companyName || 'Contractor profile'}</p>
        </div>
      </div>
      <VerificationBanner status={profile.verificationStatus} rejectionReason={profile.rejectionReason} />

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="text-xs text-muted">Contractor name</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" required />
        </div>
        {avatarFile && <p className="text-xs text-muted">New profile photo selected: {avatarFile.name}. Save changes to apply it.</p>}
        <input placeholder="Company / Business name" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} className="input-field" />
        <textarea rows={4} placeholder="About your company" value={form.about} onChange={(e) => update('about', e.target.value)} className="input-field resize-none" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted">Experience (years)</label>
            <input type="number" min={0} value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs text-muted">Availability</label>
            <select value={form.availability} onChange={(e) => update('availability', e.target.value)} className="input-field">
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <CityInput value={form.city} onChange={(e) => update('city', e.target.value)} />
          <input placeholder="State" value={form.state} onChange={(e) => update('state', e.target.value)} className="input-field" />
          <input placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} className="input-field" />
        </div>

        <input placeholder="Specializations (comma separated, e.g. Residential, Interior Design)" value={form.specializations} onChange={(e) => update('specializations', e.target.value)} className="input-field" />
        <input placeholder="Services offered (comma separated)" value={form.servicesOffered} onChange={(e) => update('servicesOffered', e.target.value)} className="input-field" />

        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Min budget (₹)" value={form.minBudget} onChange={(e) => update('minBudget', e.target.value)} className="input-field" />
          <input type="number" placeholder="Max budget (₹)" value={form.maxBudget} onChange={(e) => update('maxBudget', e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="text-xs text-muted block mb-2">Profile Banner Image</label>
          {(bannerPreview || profile.coverImage?.url) && (
            <img src={bannerPreview || profile.coverImage.url} alt="Profile banner preview" className="w-full h-36 object-cover rounded-xl mb-3" />
          )}
          <label className="flex items-center gap-3 border border-border rounded-xl p-3 cursor-pointer hover:border-primary transition-colors">
            <FaCloudUploadAlt className="text-primary" />
            <span className="text-sm text-muted">{bannerFile ? bannerFile.name : 'Choose profile banner photo'}</span>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => setBannerFile(event.target.files?.[0] || null)} />
          </label>
          <p className="text-xs text-muted mt-1">Shown as the wide image on your public contractor card and profile.</p>
        </div>

        <button type="submit" disabled={busy} className="btn-primary">{busy ? 'Saving...' : 'Save Profile'}</button>
      </form>
    </div>
  );
};

export default ContractorProfilePage;
