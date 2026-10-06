import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHardHat, FaStar } from 'react-icons/fa';
import StatCard from '../../components/dashboard/StatCard';
import VerificationBanner from '../../components/dashboard/VerificationBanner';
import { useAuth } from '../../context/AuthContext';
import { contractorApi } from '../../services/contractorApi';
import { requirementApi } from '../../services/resourceApi';
import { getInitials } from '../../utils/format';

const ContractorOverviewPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [requirementsCount, setRequirementsCount] = useState(0);
  const avatarUrl = profile?.user?.avatar?.url || user?.avatar?.url || '';

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  useEffect(() => {
    contractorApi.me().then(({ data }) => setProfile(data.data)).catch(() => {});
    requirementApi.received()
      .then(({ data }) => setRequirementsCount(data.data.length))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        {avatarUrl && !avatarError ? (
          <img
            src={avatarUrl}
            alt={user?.name || 'Contractor profile'}
            onError={() => setAvatarError(true)}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-card bg-primary/10"
          />
        ) : (
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-card bg-primary/10 text-primary font-heading font-bold text-lg flex items-center justify-center">
            {getInitials(profile?.user?.name || user?.name || 'Contractor')}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink mb-1">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted text-sm">Here&apos;s an overview of your contractor account.</p>
        </div>
      </div>

      {profile && <VerificationBanner status={profile.verificationStatus} rejectionReason={profile.rejectionReason} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={FaHardHat} label="Construction Requirements" value={requirementsCount} accent="text-accent" delay={0.05} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Link to="/contractor/profile" className="card p-6 flex items-center gap-4 hover:shadow-cardHover transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600"><FaStar /></div>
          <div><p className="font-semibold text-ink">Complete Profile</p><p className="text-sm text-muted">Boost your visibility</p></div>
        </Link>
      </div>

    </div>
  );
};

export default ContractorOverviewPage;
