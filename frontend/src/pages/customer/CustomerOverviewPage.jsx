import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaHardHat, FaPlus } from 'react-icons/fa';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../context/AuthContext';
import { propertyApi } from '../../services/propertyApi';
import { requirementApi } from '../../services/resourceApi';

const CustomerOverviewPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ properties: 0, requirements: 0 });

  useEffect(() => {
    Promise.all([
      propertyApi.mine(),
      requirementApi.mine(),
    ]).then(([props, req]) => {
      setStats({
        properties: props.data.data.length,
        requirements: req.data.data.length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-2xl font-heading font-bold text-ink">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-muted text-sm mt-1">Here's what's happening with your BuildNBuy account.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <StatCard icon={FaHome} label="My Properties" value={stats.properties} delay={0} />
        <StatCard icon={FaHardHat} label="Construction Inquiries" value={stats.requirements} accent="text-emerald-600" delay={0.05} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Link to="/dashboard/list-property" className="card p-6 flex items-center gap-4 hover:shadow-cardHover transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><FaPlus /></div>
          <div>
            <p className="font-semibold text-ink">List a New Property</p>
            <p className="text-sm text-muted">Sell or rent out your property</p>
          </div>
        </Link>
        <Link to="/contractors" className="card p-6 flex items-center gap-4 hover:shadow-cardHover transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent"><FaHardHat /></div>
          <div>
            <p className="font-semibold text-ink">Build Your Home</p>
            <p className="text-sm text-muted">Find a verified contractor</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CustomerOverviewPage;
