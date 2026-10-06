import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { fadeLeft, fadeRight, viewportOnce } from '../../utils/motion';
import { validateName } from '../../utils/validation';
import { contactApi } from '../../services/resourceApi';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [nameError, setNameError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateName(form.name);
    setNameError(validationError);
    if (validationError) return;

    setSubmitting(true);
    try {
      await contactApi.submit(form);
      toast.success("Thanks! We'll get back to you shortly.");
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-padding container-x">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <span className="text-primary font-semibold text-sm">Contact Us</span>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink mt-2 mb-5">We'd Love to Hear From You</h1>
          <p className="text-muted mb-8">Whether you have a question about a property, a contractor, or the platform itself — our team is here to help.</p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center"><FaMapMarkerAlt className="text-primary" /></div>
              <p className="text-ink/80">Surat, Gujarat, India</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center"><FaPhoneAlt className="text-primary" /></div>
              <p className="text-ink/80">+91 95584 53510</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center"><FaEnvelope className="text-primary" /></div>
              <p className="text-ink/80">hello@buildnbuy.com</p>
            </div>
          </div>
        </motion.div>

        <motion.form variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewportOnce} onSubmit={handleSubmit} className="card p-8 space-y-4">
          <div>
            <input required placeholder="Your name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setNameError(''); }} className="input-field" />
            {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
          </div>
          <input required type="email" maxLength={254} placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          <textarea required rows={5} maxLength={5000} placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" />
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default ContactPage;
