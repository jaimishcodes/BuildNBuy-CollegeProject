import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaHardHat, FaPhoneAlt } from 'react-icons/fa';
import StatusBadge from '../../components/dashboard/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import { requirementApi } from '../../services/resourceApi';
import { formatINR, formatDate } from '../../utils/format';

const ConstructionRequirementsPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requirementApi.mine().then(({ data }) => setRequirements(data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink mb-6">My Construction Inquiries</h1>
      {loading ? (
        <GridSkeleton count={3} cols="md:grid-cols-1" />
      ) : requirements.length === 0 ? (
        <EmptyState icon={FaHardHat} title="No construction requirements yet" description="Send a requirement from any contractor profile to see it here." action={<Link to="/contractors" className="btn-primary text-sm">Find a Contractor</Link>} />
      ) : (
        <div className="space-y-4">
          {requirements.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-ink">{r.title}</h3>
                <StatusBadge status={r.status} />
              </div>
              <p className="text-sm text-muted mb-2">
                {r.contractor ? `Sent to ${r.contractor.name}` : 'Open requirement'} · {r.location} · {r.plotArea?.value} {r.plotArea?.unit}
              </p>
              <p className="text-sm text-ink/80">Budget: {formatINR(r.approxBudget)} · {r.houseType} · {r.bedrooms} BHK</p>
              <p className="text-xs text-muted mt-2">{formatDate(r.createdAt)}</p>

              {r.status === 'Accepted' && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-800">
                    Your requirement was accepted by {r.contractor?.name || 'the contractor'}.
                  </p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Contact the contractor to discuss your project scope, timeline, and next steps.
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
                    {r.contractor?.phone && (
                      <a href={`tel:${r.contractor.phone}`} className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:underline">
                        <FaPhoneAlt /> {r.contractor.phone}
                      </a>
                    )}
                    {r.contractor?.email && (
                      <a href={`mailto:${r.contractor.email}`} className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:underline">
                        <FaEnvelope /> {r.contractor.email}
                      </a>
                    )}
                    {!r.contractor?.phone && !r.contractor?.email && (
                      <Link to={`/contractors/${r.contractor?._id}`} className="text-sm font-medium text-emerald-800 hover:underline">
                        View contractor profile for contact details
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {r.status === 'Rejected' && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-800">
                    This contractor is unable to take on your requirement right now.
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    You can find another contractor and submit a new requirement.
                  </p>
                  <Link to="/contractors" className="inline-flex mt-3 text-sm font-semibold text-red-800 hover:underline">
                    Find another contractor
                  </Link>
                </div>
              )}

              {['Open', 'Responded', 'In Discussion'].includes(r.status) && (
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-800">
                    {r.status === 'Open' && 'Your requirement is waiting for a contractor response.'}
                    {r.status === 'Responded' && 'The contractor has responded to your requirement.'}
                    {r.status === 'In Discussion' && 'Your requirement is now under discussion with the contractor.'}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConstructionRequirementsPage;
