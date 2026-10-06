import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { propertyApi } from '../../services/propertyApi';
import CityInput from '../common/CityInput';

const propertyTypes = ['Apartment', 'Villa', 'House', 'Penthouse', 'Plot/Land', 'Office', 'Shop', 'Commercial', 'Farm House', 'Luxury Property'];
const amenitiesList = ['Power Backup', 'Lift', 'Security', 'Parking', 'Garden', 'Gym', 'Swimming Pool'];
const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const supportedImageExtensions = new Set(['jpg', 'jpeg', 'png', 'webp']);
const maxImageSize = 8 * 1024 * 1024;
const maxImageCount = 10;

const emptyForm = {
  title: '', description: '', propertyType: 'Apartment', listingType: 'Sale', price: '',
  address: '', city: '', state: '', pincode: '', bedrooms: 0, bathrooms: 0, area: '', areaUnit: 'sqft',
  parking: 0, furnishing: 'Unfurnished', amenities: [],
};

const PropertyForm = ({ property, redirectTo = '/dashboard/my-properties' }) => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState(() =>
    Array.isArray(property?.images) ? property.images.filter((image) => image?.url) : [],
  );
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!property) return;
    setExistingImages(Array.isArray(property.images) ? property.images.filter((image) => image?.url) : []);
    setForm({
      title: property.title || '',
      description: property.description || '',
      propertyType: property.propertyType || 'Apartment',
      listingType: property.listingType || 'Sale',
      price: property.price ?? '',
      address: property.location?.address || '',
      city: property.location?.city || '',
      state: property.location?.state || '',
      pincode: property.location?.pincode || '',
      bedrooms: property.bedrooms ?? 0,
      bathrooms: property.bathrooms ?? 0,
      area: property.area?.value ?? '',
      areaUnit: 'sqft',
      parking: property.parking ?? 0,
      furnishing: property.furnishing || 'Unfurnished',
      amenities: property.amenities || [],
    });
  }, [property]);

  useEffect(() => {
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [files]);

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  };

  const addSelectedImages = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return (supportedImageTypes.has(file.type) || supportedImageExtensions.has(extension)) && file.size <= maxImageSize;
    });
    if (validFiles.length !== selectedFiles.length) {
      toast.error('Use JPG, PNG, or WebP images up to 8 MB each.');
    }
    const availableSlots = Math.max(0, maxImageCount - files.length);
    const acceptedFiles = validFiles.slice(0, availableSlots);
    if (acceptedFiles.length < validFiles.length) {
      toast.error(`You can add up to ${maxImageCount} new photos at a time.`);
    }
    setFiles((current) => [...current, ...acceptedFiles]);
    event.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'amenities') v.forEach((a) => fd.append('amenities', a));
        else fd.append(k, v);
      });
      if (property) fd.append('existingImages', JSON.stringify(existingImages.map((image) => image.url)));
      files.forEach((f) => fd.append('images', f));

      if (property) {
        const { data } = await propertyApi.update(property._id, fd);
        setExistingImages(data.data.images || []);
        setFiles([]);
        toast.success('Property updated and sent for admin approval!');
      } else {
        await propertyApi.create(fd);
        toast.success('Property submitted for admin approval!');
        navigate(redirectTo);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit property');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <div>
        <h3 className="font-heading font-semibold text-ink mb-4">Basic Details</h3>
        <div className="space-y-4">
          <input required placeholder="Property title" value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" />
          <textarea required rows={4} placeholder="Description" value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field resize-none" />
          <div className="grid grid-cols-2 gap-4">
            <select value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} className="input-field">
              {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.listingType} onChange={(e) => update('listingType', e.target.value)} className="input-field">
              <option value="Sale">For Sale</option>
              <option value="Rent">For Rent</option>
            </select>
          </div>
          <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => update('price', e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-ink mb-4">Location</h3>
        <div className="space-y-4">
          <input required placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} className="input-field" />
          <div className="grid grid-cols-3 gap-4">
            <CityInput required value={form.city} onChange={(e) => update('city', e.target.value)} />
            <input placeholder="State" value={form.state} onChange={(e) => update('state', e.target.value)} className="input-field" />
            <input placeholder="Pincode" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-ink mb-4">Specifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-muted">Bedrooms</label>
            <input type="number" min={0} value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs text-muted">Bathrooms</label>
            <input type="number" min={0} value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs text-muted">Area (sqft)</label>
            <input required type="number" min={1} placeholder="Area in square feet" value={form.area} onChange={(e) => update('area', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs text-muted">Parking</label>
            <input type="number" min={0} value={form.parking} onChange={(e) => update('parking', e.target.value)} className="input-field" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-muted">Furnishing</label>
          <select value={form.furnishing} onChange={(e) => update('furnishing', e.target.value)} className="input-field">
            <option value="Unfurnished">Unfurnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Fully-Furnished">Fully-Furnished</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-ink mb-4">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {amenitiesList.map((a) => (
            <button type="button" key={a} onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.amenities.includes(a) ? 'bg-primary text-white border-primary' : 'border-border text-ink/70'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-heading font-semibold text-ink">Property photos</h3>
          <span className="text-xs text-muted">{files.length} new photo{files.length === 1 ? '' : 's'} selected</span>
        </div>
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-5 px-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
          <FaCloudUploadAlt className="text-xl text-primary" />
          <span className="text-sm font-semibold text-primary">Add photos</span>
          <input type="file" multiple accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={addSelectedImages} />
        </label>
        <p className="text-xs text-muted mt-2">JPG, PNG, or WebP. Up to 8 MB per photo and 10 new photos per submission.</p>
        {(existingImages.length > 0 || files.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {existingImages.map((image) => (
              <div key={image.url} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
                <img src={image.url} alt="Property" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setExistingImages((current) => current.filter((item) => item.url !== image.url))}
                  aria-label="Remove existing property photo"
                  title="Remove photo"
                  className="absolute top-2 right-2 w-7 h-7 inline-flex items-center justify-center rounded-full bg-white/95 text-red-600 shadow-card hover:bg-red-50"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            {files.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
                {filePreviews[index] && <img src={filePreviews[index]} alt={`New property photo ${index + 1}`} className="w-full h-full object-cover" />}
                <button
                  type="button"
                  onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                  aria-label="Remove newly selected property photo"
                  title="Remove photo"
                  className="absolute top-2 right-2 w-7 h-7 inline-flex items-center justify-center rounded-full bg-white/95 text-red-600 shadow-card hover:bg-red-50"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? (property ? 'Saving...' : 'Submitting...') : (property ? 'Save Changes' : 'Submit for Approval')}
      </button>
    </form>
  );
};

export default PropertyForm;
