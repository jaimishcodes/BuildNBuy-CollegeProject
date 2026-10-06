import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { majorIndianCities } from '../../utils/indianCities';

const propertyTypes = ['Apartment', 'Villa', 'House', 'Penthouse', 'Plot/Land', 'Office', 'Shop', 'Commercial', 'Farm House', 'Luxury Property'];
const amenitiesList = ['Power Backup', 'Lift', 'Security', 'Parking', 'Garden', 'Gym', 'Swimming Pool'];

const PropertyFilters = ({ filters, setFilters, onApply, onReset }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (amenity) => {
    const current = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];
    const next = current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity];
    update('amenities', next.join(','));
  };

  return (
    <div className="card p-5 space-y-6">
      <div className="flex items-center gap-2 font-heading font-semibold text-ink">
        <FaFilter className="text-primary" /> Filters
      </div>

      <div>
        <label className="text-sm font-semibold text-ink block mb-2">Listing Type</label>
        <div className="flex gap-2">
          {['', 'Sale', 'Rent'].map((t) => (
            <button
              key={t || 'any'}
              onClick={() => update('listingType', t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                filters.listingType === t ? 'bg-primary text-white border-primary' : 'border-border text-ink/70'
              }`}
            >
              {t || 'Any'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-ink block mb-2">Property Type</label>
        <select value={filters.propertyType || ''} onChange={(e) => update('propertyType', e.target.value)} className="input-field text-sm">
          <option value="">All Types</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-ink block mb-2">City</label>
        <select value={filters.city || ''} onChange={(e) => update('city', e.target.value)} className="input-field text-sm">
          <option value="">All Cities</option>
          {majorIndianCities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-ink block mb-2">Price Range (₹)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => update('minPrice', e.target.value)} className="input-field text-sm" />
          <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => update('maxPrice', e.target.value)} className="input-field text-sm" />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-ink block mb-2">Bedrooms</label>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => update('bedrooms', filters.bedrooms === String(n) ? '' : String(n))}
              className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-colors ${
                filters.bedrooms === String(n) ? 'bg-primary text-white border-primary' : 'border-border text-ink/70'
              }`}
            >
              {n}+
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-ink block mb-2">Furnishing</label>
        <select value={filters.furnishing || ''} onChange={(e) => update('furnishing', e.target.value)} className="input-field text-sm">
          <option value="">Any</option>
          <option value="Unfurnished">Unfurnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Fully-Furnished">Fully-Furnished</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-ink block mb-2">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {amenitiesList.map((a) => {
            const active = (filters.amenities || '').split(',').includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  active ? 'bg-primary text-white border-primary' : 'border-border text-ink/70'
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onApply} className="btn-primary flex-1 text-sm !py-2.5">Apply</button>
        <button onClick={onReset} className="btn-secondary flex-1 text-sm !py-2.5">Reset</button>
      </div>
    </div>
  );
};

export default PropertyFilters;
