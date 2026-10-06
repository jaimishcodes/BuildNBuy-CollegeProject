import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCalendarCheck, FaCheck, FaEnvelopeOpen, FaTimes } from 'react-icons/fa';
import EmptyState from '../../components/common/EmptyState';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { propertyApi } from '../../services/propertyApi';
import { formatDate, formatPrice } from '../../utils/format';

const PropertyInquiriesPage = () => {
  const { user } = useAuth();
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
        <p className="text-sm text-muted mt-1">Manage requests you receive and track inquiries you send.</p>
      </div>

      {loading ? (
        <GridSkeleton count={3} cols="md:grid-cols-1" />
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={FaEnvelopeOpen}
          title="No booking inquiries yet"
          description="Inquiries you send and requests for your properties will appear here."
          action={<Link to="/properties" className="btn-secondary text-sm">Browse Properties</Link>}
        />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const sentByMe = String(inquiry.requester?._id) === String(user?.id || user?._id);
            const otherPerson = sentByMe ? inquiry.owner : inquiry.requester;

            return (
              <article key={inquiry._id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
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
                    <span className={`inline-flex mt-2 rounded-full px-2.5 py-1 text-xs font-semibold ${sentByMe ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                      {sentByMe ? 'Sent by you' : 'Received for your property'}
                    </span>
                  </div>

                  <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                    <StatusBadge status={inquiry.status} />
                    {!sentByMe && inquiry.status === 'Pending' && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-border mt-4 pt-4">
                  <p className="text-sm font-medium text-ink">
                    {sentByMe ? 'To' : 'From'} {otherPerson?.name || 'Account'}
                    <span className="text-muted font-normal"> · {otherPerson?.role}</span>
                  </p>
                  <p className="text-sm text-muted mt-2">{inquiry.message}</p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted mt-3">
                    <span>{sentByMe ? 'Sent' : 'Received'} {formatDate(inquiry.createdAt)}</span>
                    {inquiry.preferredVisitDate && (
                      <span className="inline-flex items-center gap-1.5">
                        <FaCalendarCheck /> Requested visit {formatDate(inquiry.preferredVisitDate)}
                      </span>
                    )}
                    {otherPerson?.phone && <a href={`tel:${otherPerson.phone}`} className="text-primary">{otherPerson.phone}</a>}
                    {otherPerson?.email && <a href={`mailto:${otherPerson.email}`} className="text-primary">{otherPerson.email}</a>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertyInquiriesPage;
