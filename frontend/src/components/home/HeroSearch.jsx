import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { majorIndianCities } from '../../utils/indianCities';

const propertyTypes = ['Apartment', 'Villa', 'House', 'Penthouse', 'Plot/Land', 'Office', 'Shop', 'Commercial', 'Farm House', 'Luxury Property'];
const budgets = [
  { label: 'Any Budget', value: '' },
  { label: 'Under ₹50L', value: '0-5000000' },
  { label: '₹50L - ₹1Cr', value: '5000000-10000000' },
  { label: '₹1Cr - ₹2Cr', value: '10000000-20000000' },
  { label: 'Above ₹2Cr', value: '20000000-999999999' },
];

const HeroSearch = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ city: '', propertyType: '', listingType: 'Sale', budget: '' });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (form.city) params.set('city', form.city);
    if (form.propertyType) params.set('propertyType', form.propertyType);
    if (form.listingType) params.set('listingType', form.listingType);
    if (form.budget) {
      const [min, max] = form.budget.split('-');
      params.set('minPrice', min);
      params.set('maxPrice', max);
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-cardHover p-4 md:p-5 w-full max-w-4xl">
      <div className="flex flex-wrap xl:flex-nowrap gap-3">
        <div className="flex bg-section rounded-xl p-1 shrink-0">
          {['Sale', 'Rent'].map((t) => (
            <button
              key={t}
              onClick={() => setForm({ ...form, listingType: t })}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                form.listingType === t ? 'bg-primary text-white shadow-card' : 'text-ink/60'
              }`}
            >
              {t === 'Sale' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[160px] border border-border rounded-xl px-3">
          <FaMapMarkerAlt className="text-primary shrink-0" />
          <select
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full py-3 bg-transparent outline-none text-sm text-ink"
          >
            <option value="">Any Location</option>
            {majorIndianCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <select
          value={form.propertyType}
          onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
          className="flex-1 min-w-[160px] border border-border rounded-xl px-3 py-3 bg-transparent outline-none text-sm text-ink"
        >
          <option value="">Property Type</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className="flex-1 min-w-[140px] border border-border rounded-xl px-3 py-3 bg-transparent outline-none text-sm text-ink"
        >
          {budgets.map((b) => (
            <option key={b.label} value={b.value}>{b.label}</option>
          ))}
        </select>

        <button onClick={handleSearch} className="btn-primary shrink-0 !px-6">
          <FaSearch /> Search
        </button>
      </div>
    </div>
  );
};

export default HeroSearch;
