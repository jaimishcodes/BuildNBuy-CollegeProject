import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CityInput from '../common/CityInput';

const getLocalDateString = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const ConstructionRequirementModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: '', location: '', plotArea: '', plotAreaUnit: 'sqft', houseType: '', floors: 1,
    bedrooms: 3, bathrooms: 2, approxBudget: '', preferredStartDate: '', description: '', additionalRequirements: '',
  });
  const [busy, setBusy] = useState(false);

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit(form);
      toast.success('Construction requirement submitted!');
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl my-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-semibold text-lg text-ink">Send Construction Requirement</h3>
              <button onClick={onClose}><FaTimes className="text-muted" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Requirement title (e.g. 3BHK home on 1500 sqft plot)" value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" />
              <CityInput required placeholder="Plot location / address" value={form.location} onChange={(e) => update('location', e.target.value)} />

              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Plot area" value={form.plotArea} onChange={(e) => update('plotArea', e.target.value)} className="input-field" />
                <select value={form.plotAreaUnit} onChange={(e) => update('plotAreaUnit', e.target.value)} className="input-field">
                  <option value="sqft">sqft</option>
                  <option value="sqyd">sqyd</option>
                  <option value="acre">acre</option>
                </select>
              </div>

              <input placeholder="House type (e.g. 3 BHK Duplex)" value={form.houseType} onChange={(e) => update('houseType', e.target.value)} className="input-field" />

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted">Floors</label>
                  <input type="number" min={1} value={form.floors} onChange={(e) => update('floors', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-muted">Bedrooms</label>
                  <input type="number" min={0} value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-muted">Bathrooms</label>
                  <input type="number" min={0} value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Approx budget (₹)" value={form.approxBudget} onChange={(e) => update('approxBudget', e.target.value)} className="input-field" />
                <input type="date" min={getLocalDateString()} value={form.preferredStartDate} onChange={(e) => update('preferredStartDate', e.target.value)} className="input-field" />
              </div>

              <textarea rows={3} placeholder="Describe your requirement..." value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field resize-none" />
              <textarea rows={2} placeholder="Additional requirements (optional)" value={form.additionalRequirements} onChange={(e) => update('additionalRequirements', e.target.value)} className="input-field resize-none" />

              <button type="submit" disabled={busy} className="btn-primary w-full">
                {busy ? 'Submitting...' : 'Submit Requirement'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConstructionRequirementModal;
