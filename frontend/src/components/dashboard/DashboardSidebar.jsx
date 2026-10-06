import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const DashboardSidebar = ({ items, title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${
      isActive ? 'bg-[#2563EB] text-white' : 'text-ink/70 hover:bg-blue-100 hover:text-ink active:bg-[#2563EB] active:text-white'
    }`;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="card p-4 lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted px-2 mb-2">{title}</p>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.icon && <item.icon className="text-base shrink-0" />}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border mt-3 pt-3 space-y-1">
          <NavLink to="/" className={linkClass}>
            <FaHome className="text-base shrink-0" />
            Home
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-2 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap text-ink/70 hover:bg-blue-100 hover:text-ink active:bg-[#2563EB] active:text-white"
          >
            <FaSignOutAlt className="text-base shrink-0" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
