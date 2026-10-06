import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaHardHat, FaHome, FaClock, FaCheckCircle, FaTimesCircle, FaHammer,
} from 'react-icons/fa';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { adminApi } from '../../services/resourceApi';
import { formatDate } from '../../utils/format';

const AdminOverviewPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.dashboard().then(({ data }) => setStats(data.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="skeleton h-96 w-full" />;

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-ink mb-1">Platform Overview</h1>
      <p className="text-muted text-sm mb-6">A bird's-eye view of BuildNBuy activity.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard icon={FaUsers} label="Total Users" value={stats.users.total} />
        <StatCard icon={FaUsers} label="Customers" value={stats.users.customers} delay={0.05} />
        <StatCard icon={FaHardHat} label="Contractors" value={stats.users.contractors} accent="text-accent" delay={0.1} />
        <StatCard icon={FaCheckCircle} label="Verified Contractors" value={stats.contractors.verified} accent="text-emerald-600" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard icon={FaHome} label="Total Properties" value={stats.properties.total} />
        <StatCard icon={FaClock} label="Pending Properties" value={stats.properties.pending} accent="text-amber-500" delay={0.05} />
        <StatCard icon={FaCheckCircle} label="Approved Properties" value={stats.properties.approved} accent="text-emerald-600" delay={0.1} />
        <StatCard icon={FaTimesCircle} label="Rejected Properties" value={stats.properties.rejected} accent="text-red-500" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={FaHammer} label="Construction Inquiries" value={stats.constructionInquiries} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-ink">Recent Properties</h3>
            <Link to="/admin/properties" className="text-primary text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {stats.recentProperties.map((p) => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-ink line-clamp-1">{p.title}</p>
                  <p className="text-xs text-muted">by {p.listedBy?.name} · {formatDate(p.createdAt)}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-ink">Recent Users</h3>
            <Link to="/admin/users" className="text-primary text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.map((u) => (
              <div key={u._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-ink">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </div>
                <span className="text-xs bg-section px-2 py-1 rounded-full capitalize">{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
