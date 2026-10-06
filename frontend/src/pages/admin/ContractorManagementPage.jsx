import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaHardHat, FaCheck, FaTimes, FaBan, FaUndo } from 'react-icons/fa';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import { contractorApi } from '../../services/contractorApi';
import { adminApi } from '../../services/resourceApi';
import { formatDate } from '../../utils/format';

const tabs = ['pending', 'verified', 'rejected', 'block'];

const ContractorManagementPage = () => {
  const [tab, setTab] = useState('pending');
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    contractorApi.adminList({ status: tab, limit: 30 }).then(({ data }) => setContractors(data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [tab]);

  const handleAction = async (id, action) => {
    let rejectionReason;
    if (action === 'reject') {
      rejectionReason = window.prompt('Reason for rejection:');
      if (rejectionReason === null) return;
    }
    try {
      await contractorApi.verify(id, { action, rejectionReason });
      const messages = {
        verify: 'Contractor verified',
        unverify: 'Contractor moved back to pending verification',
        reject: 'Contractor rejected',
      };
      toast.success(messages[action]);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update contractor verification');
    }
  };

  const handleToggleBlock = async (contractor) => {
    const isCurrentlyBlocked = Boolean(contractor.user?.isBlocked);
    try {
      await adminApi.toggleBlockUser(contractor.user._id, {});
      toast.success(`Contractor ${isCurrentlyBlocked ? 'unblocked' : 'blocked'}`);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update contractor access');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink mb-6">Contractor Management</h1>

      <div className="flex gap-2 border-b border-border mb-6">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted'}`}>
            {t === 'block' ? 'Block / Unblock' : t}
          </button>
        ))}
      </div>

      {loading ? (
        <GridSkeleton count={4} cols="md:grid-cols-2" />
      ) : contractors.length === 0 ? (
        <EmptyState icon={FaHardHat} title={tab === 'block' ? 'No contractors found' : `No ${tab} contractors`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contractors.map((c) => (
            <div key={c._id} className="card p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <img src={c.user?.avatar?.url || `https://ui-avatars.com/api/?name=${c.user?.name}`} alt="" className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-ink text-sm">{c.companyName || c.user?.name}</p>
                    <p className="text-xs text-muted">{c.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={c.verificationStatus} />
                  {c.user?.isBlocked && <span className="text-xs font-semibold text-red-600">Blocked</span>}
                </div>
              </div>
              <p className="text-sm text-muted mb-1">{c.location?.city} · {c.experienceYears} yrs experience</p>
              <p className="text-xs text-muted mb-3">Joined {formatDate(c.user?.createdAt || c.createdAt)}</p>
              {c.about && <p className="text-sm text-ink/70 line-clamp-2 mb-3">{c.about}</p>}

              <div className="mt-4 space-y-3 border-t border-border pt-3">
                {tab === 'pending' && (
                  <div>
                    <p className="text-xs font-semibold text-muted mb-2">Verification</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(c.user._id, 'verify')} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-emerald-700">
                        <FaCheck /> Verify
                      </button>
                      <button onClick={() => handleAction(c.user._id, 'reject')} className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-600">
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </div>
                )}
                {tab === 'verified' && (
                  <div>
                    <p className="text-xs font-semibold text-muted mb-2">Verification</p>
                    <button onClick={() => handleAction(c.user._id, 'unverify')} className="inline-flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-100">
                      <FaUndo /> Unverify
                    </button>
                  </div>
                )}
                {tab === 'rejected' && (
                  <div>
                    <p className="text-xs font-semibold text-muted mb-2">Verification</p>
                    <button onClick={() => handleAction(c.user._id, 'verify')} className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700">
                      <FaCheck /> Verify Again
                    </button>
                  </div>
                )}
                {tab === 'block' && (
                  <div>
                    <p className="text-xs font-semibold text-muted mb-2">Account access</p>
                    <button
                      onClick={() => handleToggleBlock(c)}
                      className={`inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg ${c.user?.isBlocked ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                      aria-label={`${c.user?.isBlocked ? 'Unblock' : 'Block'} contractor ${c.user?.name}`}
                    >
                      {c.user?.isBlocked ? <><FaCheck /> Unblock</> : <><FaBan /> Block</>}
                    </button>
                  </div>
                )}
              </div>
              {c.verificationStatus === 'rejected' && c.rejectionReason && (
                <p className="text-xs text-red-600">Reason: {c.rejectionReason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractorManagementPage;
