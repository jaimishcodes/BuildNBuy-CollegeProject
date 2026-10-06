import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaBed, FaBath, FaRulerCombined, FaCar, FaCouch, FaMapMarkerAlt,
  FaPhoneAlt, FaCheckCircle, FaCalendarCheck,
} from 'react-icons/fa';
import ImageGallery from '../../components/contractor/ImageGallery';
import PropertyCard from '../../components/customer/PropertyCard';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import { propertyApi } from '../../services/propertyApi';
import { formatPrice } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

const PropertyDetailsPage = () => {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryBusy, setInquiryBusy] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ preferredVisitDate: '', message: '' });

  useEffect(() => {
    setLoading(true);
    propertyApi
      .getOne(idOrSlug)
      .then(({ data }) => {
        setProperty(data.data.property);
        setRelated(data.data.related);
      })
      .catch(() => toast.error('Property not found'))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="container-x py-10">
        <div className="skeleton h-[420px] w-full rounded-2xl mb-8" />
        <GridSkeleton count={3} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container-x py-24 text-center">
        <h2 className="text-2xl font-heading font-bold text-ink mb-2">Property not found</h2>
        <Link to="/properties" className="btn-primary inline-flex mt-4">Browse Properties</Link>
      </div>
    );
  }

  const isOwner = user && String(user.id) === String(property.listedBy?._id);
  const canSendInquiry = user && ['customer', 'contractor'].includes(user.role) && !isOwner;

  const handleInquirySubmit = async (event) => {
    event.preventDefault();
    setInquiryBusy(true);
    try {
      await propertyApi.createInquiry(property._id, inquiryForm);
      toast.success('Visit inquiry sent to the property owner');
      setInquiryForm({ preferredVisitDate: '', message: '' });
      setInquiryOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not send the inquiry');
    } finally {
      setInquiryBusy(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="container-x py-8">
        <ImageGallery images={property.images} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    {property.listingType === 'Sale' ? 'For Sale' : 'For Rent'}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-heading font-bold text-ink mt-3">{property.title}</h1>
                  <p className="flex items-center gap-1.5 text-muted mt-1">
                    <FaMapMarkerAlt className="text-primary" /> {property.location?.address}, {property.location?.city}
                  </p>
                </div>
              </div>

              <p className="text-3xl font-heading font-bold text-primary mb-6">{formatPrice(property)}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {property.bedrooms > 0 && (
                  <div className="card p-4 text-center">
                    <FaBed className="text-primary text-xl mx-auto mb-2" />
                    <p className="font-semibold text-ink">{property.bedrooms}</p>
                    <p className="text-xs text-muted">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="card p-4 text-center">
                    <FaBath className="text-primary text-xl mx-auto mb-2" />
                    <p className="font-semibold text-ink">{property.bathrooms}</p>
                    <p className="text-xs text-muted">Bathrooms</p>
                  </div>
                )}
                <div className="card p-4 text-center">
                  <FaRulerCombined className="text-primary text-xl mx-auto mb-2" />
                  <p className="font-semibold text-ink">{property.area?.value}</p>
                  <p className="text-xs text-muted">{property.area?.unit}</p>
                </div>
                <div className="card p-4 text-center">
                  <FaCar className="text-primary text-xl mx-auto mb-2" />
                  <p className="font-semibold text-ink">{property.parking || 0}</p>
                  <p className="text-xs text-muted">Parking</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="font-heading font-semibold text-lg text-ink mb-3">Description</h2>
                <p className="text-muted leading-relaxed">{property.description}</p>
              </div>

              {property.amenities?.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-heading font-semibold text-lg text-ink mb-3">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((a) => (
                      <span key={a} className="flex items-center gap-1.5 bg-section text-ink text-sm px-3 py-1.5 rounded-lg">
                        <FaCheckCircle className="text-primary text-xs" /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8 flex items-center gap-2 text-sm text-muted">
                <FaCouch className="text-primary" /> Furnishing: <span className="font-medium text-ink">{property.furnishing}</span>
              </div>

            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-heading font-semibold text-ink mb-4">
                {property.listedByRole === 'contractor' ? 'Listed by Contractor' : 'Listed by Owner'}
              </h3>
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={property.listedBy?.avatar?.url || `https://ui-avatars.com/api/?name=${property.listedBy?.name}`}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-ink">{property.listedBy?.name}</p>
                  <p className="text-xs text-muted capitalize">{property.listedByRole}</p>
                </div>
              </div>

              {!isOwner && (
                <div className="space-y-3">
                  {property.listedBy?.phone && (
                    <a href={`tel:${property.listedBy.phone}`} className="flex items-center justify-center gap-2 text-sm text-muted py-2">
                      <FaPhoneAlt /> {property.listedBy.phone}
                    </a>
                  )}
                </div>
              )}
              {!isOwner && (
                <div className="border-t border-border mt-4 pt-4">
                  {canSendInquiry && !inquiryOpen && (
                    <button type="button" onClick={() => setInquiryOpen(true)} className="btn-primary w-full text-sm">
                      <FaCalendarCheck /> Request a Visit
                    </button>
                  )}
                  {canSendInquiry && inquiryOpen && (
                    <form onSubmit={handleInquirySubmit} className="space-y-3">
                      <h4 className="font-semibold text-ink">Send a booking inquiry</h4>
                      <label className="block text-sm text-muted">
                        Preferred visit date <span className="text-xs">(optional)</span>
                        <input
                          type="date"
                          min={new Date().toISOString().slice(0, 10)}
                          value={inquiryForm.preferredVisitDate}
                          onChange={(event) => setInquiryForm({ ...inquiryForm, preferredVisitDate: event.target.value })}
                          className="input-field mt-1"
                        />
                      </label>
                      <textarea
                        required
                        maxLength={2000}
                        rows={3}
                        value={inquiryForm.message}
                        onChange={(event) => setInquiryForm({ ...inquiryForm, message: event.target.value })}
                        placeholder="Tell the owner what you would like to know or arrange."
                        className="input-field resize-y"
                      />
                      <button type="submit" disabled={inquiryBusy} className="btn-primary w-full text-sm">
                        {inquiryBusy ? 'Sending...' : 'Send Inquiry'}
                      </button>
                      <button type="button" onClick={() => setInquiryOpen(false)} className="btn-secondary w-full text-sm">
                        Cancel
                      </button>
                    </form>
                  )}
                  {!user && (
                    <Link to="/login" className="btn-primary w-full text-sm">
                      <FaCalendarCheck /> Login to Request a Visit
                    </Link>
                  )}
                </div>
              )}
              {isOwner && (
                <Link to="/dashboard/my-properties" className="btn-secondary w-full text-sm">
                  Manage This Listing
                </Link>
              )}
            </div>

          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-ink mb-6">Related Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default PropertyDetailsPage;
