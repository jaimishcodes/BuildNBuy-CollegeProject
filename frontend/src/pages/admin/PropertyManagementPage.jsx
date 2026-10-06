import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaHome, FaCheck, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import Pagination from '../../components/common/Pagination';
import { propertyApi } from '../../services/propertyApi';
import { formatPrice, formatDate } from '../../utils/format';

const tabs = ['Pending', 'Approved', 'Rejected'];

const PropertyManagementPage = () => {
  const [tab, setTab] = useState('Pending');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });

  const fetchData = (page = 1) => {
    setLoading(true);
    propertyApi.adminList({ status: tab, page, limit: 12 }).then(({ data }) => {
      setProperties(data.data);
      setMeta(data.meta);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(1); }, [tab]);

  const handleAction = async (id, action) => {
    let rejectionReason;
    if (action === 'reject') {
      rejectionReason = window.prompt('Reason for rejection:');
      if (rejectionReason === null) return;
    }
    try {
      await propertyApi.moderate(id, { action, rejectionReason });
      toast.success(`Property ${action === 'approve' ? 'approved' : 'rejected'}`);
      fetchData(meta.page);
    } catch (err) {
      toast.error('Failed to update property');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink mb-6">Property Management</h1>

      <div className="flex gap-2 border-b border-border mb-6">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <GridSkeleton count={4} cols="md:grid-cols-2" />
      ) : properties.length === 0 ? (
        <EmptyState icon={FaHome} title={`No ${tab.toLowerCase()} properties`} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {properties.map((p) => (
              <div key={p._id} className="card p-4 flex gap-4">
                <img src={p.images?.[0]?.url} alt={p.title} className="w-28 h-24 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ink text-sm line-clamp-1">{p.title}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-muted mb-1">by {p.listedBy?.name} ({p.listedByRole}) · {p.location?.city}</p>
                  <p className="text-sm font-semibold text-primary mb-2">{formatPrice(p)}</p>
                  <div className="flex items-center gap-3">
                    <Link to={`/properties/${p.slug}`} target="_blank" className="text-xs text-primary flex items-center gap-1"><FaExternalLinkAlt /> View</Link>
                    <span className="text-xs text-muted">{formatDate(p.createdAt)}</span>
                  </div>
                  {tab === 'Pending' && (
                    <div className="flex flex-col gap-2 mt-3">
                      <button onClick={() => handleAction(p._id, 'approve')} className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-emerald-700">
                        <FaCheck /> Approve
                      </button>
                      <button onClick={() => handleAction(p._id, 'reject')} className="w-full flex items-center justify-center gap-1.5 bg-red-500 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-red-600">
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination page={meta.page} pages={meta.pages} onChange={fetchData} />
        </>
      )}
    </div>
  );
};

export default PropertyManagementPage;
