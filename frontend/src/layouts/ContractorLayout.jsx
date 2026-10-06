import React from 'react';
import { Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaBriefcase, FaHome, FaHardHat, FaCalendarCheck } from 'react-icons/fa';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardShell from '../components/dashboard/DashboardShell';

const navItems = [
  { to: '/contractor/dashboard', label: 'Overview', icon: FaTachometerAlt, end: true },
  { to: '/contractor/profile', label: 'Profile', icon: FaUser },
  { to: '/contractor/properties', label: 'My Properties', icon: FaHome },
  { to: '/contractor/property-inquiries', label: 'Booking Inquiries', icon: FaCalendarCheck },
  { to: '/contractor/requirements', label: 'Construction Requirements', icon: FaBriefcase },
  { to: '/contractor/past-work', label: 'Past Work', icon: FaHardHat },
];

const ContractorLayout = () => (
  <DashboardShell sidebar={<DashboardSidebar items={navItems} title="Contractor Panel" />} title="">
    <Outlet />
  </DashboardShell>
);

export default ContractorLayout;
