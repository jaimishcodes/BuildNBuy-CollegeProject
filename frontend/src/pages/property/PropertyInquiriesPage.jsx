import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCalendarCheck, FaCheck, FaEnvelopeOpen, FaTimes } from 'react-icons/fa';
import EmptyState from '../../components/common/EmptyState';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { propertyApi } from '../../services/propertyApi';
import { formatDate, formatPrice } from '../../utils/format';

const PropertyInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');

  const fetchInquiries = () => {
    setLoading(true);
    propertyApi.receivedInquiries()
      .then(({ data }) => setInquiries(data.data))
      .catch(() => toast.error('Could not load property inquiries'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, []);

  const updateStatus = async (inquiryId, status) => {
    setBusyId(inquiryId);
    try {
      await propertyApi.updateInquiryStatus(inquiryId, { status });
      setInquiries((current) => current.map((inquiry) => (
        inquiry._id === inquiryId ? { ...inquiry, status } : inquiry
      )));
      toast.success(`Inquiry ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update inquiry');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-heading font-bold text-ink">Property Booking Inquiries</h1>
        <p className="text-sm text-muted mt-1">Requests from people interested in visiting your listings.</p>
      </div>

      {loading ? (
        <GridSkeleton count={3} cols="md:grid-cols-1" />
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={FaEnvelopeOpen}
          title="No property inquiries yet"
          description="Visit requests for your approved properties will appear here."
          action={<Link to="/properties" className="btn-secondary text-sm">Browse Properties</Link>}
        />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <article key={inquiry._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  {inquiry.property ? (
                    <Link to={`/properties/${inquiry.property.slug}`} className="font-semibold text-ink hover:text-primary">
                      {inquiry.property.title}
                    </Link>
                  ) : (
                    <h2 className="font-semibold text-ink">Property unavailable</h2>
                  )}
                  {inquiry.property && (
                    <p className="text-sm text-muted mt-1">
                      {inquiry.property.location?.city} · {formatPrice(inquiry.property)}
                    </p>
                  )}
                </div>
                <StatusBadge status={inquiry.status} />
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <p className="text-sm font-medium text-ink">
                  {inquiry.requester?.name || 'Account'}
                  <span className="text-muted font-normal"> · {inquiry.requester?.role}</span>
                </p>
                <p className="text-sm text-muted mt-2">{inquiry.message}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted mt-3">
                  <span>Received {formatDate(inquiry.createdAt)}</span>
                  {inquiry.preferredVisitDate && (
                    <span className="inline-flex items-center gap-1.5">
                      <FaCalendarCheck /> Requested visit {formatDate(inquiry.preferredVisitDate)}
                    </span>
                  )}
                  {inquiry.requester?.phone && <a href={`tel:${inquiry.requester.phone}`} className="text-primary">{inquiry.requester.phone}</a>}
                  {inquiry.requester?.email && <a href={`mailto:${inquiry.requester.email}`} className="text-primary">{inquiry.requester.email}</a>}
                </div>
              </div>

              {inquiry.status === 'Pending' && (
                <div className="flex gap-3 border-t border-border mt-4 pt-4">
                  <button
                    type="button"
                    disabled={busyId === inquiry._id}
                    onClick={() => updateStatus(inquiry._id, 'Accepted')}
                    className="btn-primary text-sm"
                  >
                    <FaCheck /> Accept
                  </button>
                  <button
                    type="button"
                    disabled={busyId === inquiry._id}
                    onClick={() => updateStatus(inquiry._id, 'Declined')}
                    className="btn-secondary text-sm text-red-600"
                  >
                    <FaTimes /> Decline
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyInquiriesPage;