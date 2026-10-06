import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaHardHat, FaPhoneAlt, FaTimes } from 'react-icons/fa';
import StatusBadge from '../../components/dashboard/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import { requirementApi } from '../../services/resourceApi';
import { formatINR, formatDate } from '../../utils/format';

const ReceivedRequirementsPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');

  const fetchData = () => {
    setLoading(true);
    requirementApi.received().then(({ data }) => setRequirements(data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDecision = async (id, status) => {
    setBusyId(id);
    try {
      await requirementApi.updateStatus(id, { status });
      setRequirements((current) => current.map((requirement) => (
        requirement._id === id ? { ...requirement, status } : requirement
      )));
      toast.success(`Requirement ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update requirement');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink mb-6">Construction Requirements</h1>
      {loading ? (
        <GridSkeleton count={3} cols="md:grid-cols-1" />
      ) : requirements.length === 0 ? (
        <EmptyState icon={FaHardHat} title="No requirements received yet" description="Construction requirements sent to you will appear here." />
      ) : (
        <div className="space-y-4">
          {requirements.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-ink">{r.title}</h3>
                  <p className="text-sm text-muted">From: {r.customer?.name}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="text-sm text-ink/80 mb-2">{r.location} · {r.plotArea?.value} {r.plotArea?.unit} · {r.houseType}</p>
              <p className="text-sm text-ink/80 mb-2">Budget: {formatINR(r.approxBudget)} · {r.bedrooms} BHK, {r.bathrooms} bath, {r.floors} floor(s)</p>
              {r.description && <p className="text-sm text-muted bg-section rounded-lg p-3 mb-3">{r.description}</p>}

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-xs text-muted">
                  {r.customer?.phone && <span className="flex items-center gap-1.5"><FaPhoneAlt /> {r.customer.phone}</span>}
                  <span>{formatDate(r.createdAt)}</span>
                </div>
                {['Open', 'Responded', 'In Discussion'].includes(r.status) && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={busyId === r._id}
                      onClick={() => handleDecision(r._id, 'Accepted')}
                      className="btn-primary text-sm"
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      type="button"
                      disabled={busyId === r._id}
                      onClick={() => handleDecision(r._id, 'Rejected')}
                      className="btn-secondary text-sm text-red-600"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedRequirementsPage;
