import React from 'react';
import { Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaHome, FaHardHat, FaCalendarCheck } from 'react-icons/fa';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardShell from '../components/dashboard/DashboardShell';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: FaTachometerAlt, end: true },
  { to: '/dashboard/profile', label: 'Profile', icon: FaUser },
  { to: '/dashboard/my-properties', label: 'My Properties', icon: FaHome },
  { to: '/dashboard/property-inquiries', label: 'Booking Inquiries', icon: FaCalendarCheck },
  { to: '/dashboard/construction-requirements', label: 'Construction Inquiries', icon: FaHardHat },
];

const CustomerLayout = () => (
  <DashboardShell sidebar={<DashboardSidebar items={navItems} title="Customer Panel" />} title="" >
    <Outlet />
  </DashboardShell>
);

export default CustomerLayout;
