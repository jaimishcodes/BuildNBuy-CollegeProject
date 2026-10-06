import React from 'react';
import { Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaHardHat, FaHome, FaEnvelope } from 'react-icons/fa';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardShell from '../components/dashboard/DashboardShell';

const navItems = [
  { to: '/admin/dashboard', label: 'Overview', icon: FaTachometerAlt, end: true },
  { to: '/admin/users', label: 'User Management', icon: FaUsers },
  { to: '/admin/contractors', label: 'Contractor Management', icon: FaHardHat },
  { to: '/admin/properties', label: 'Property Management', icon: FaHome },
  { to: '/admin/contact-messages', label: 'Contact Messages', icon: FaEnvelope },
];

const AdminLayout = () => (
  <DashboardShell sidebar={<DashboardSidebar items={navItems} title="Admin Panel" />} title="">
    <Outlet />
  </DashboardShell>
);

export default AdminLayout;
