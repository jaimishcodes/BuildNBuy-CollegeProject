import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaHome, FaHardHat, FaUserCircle, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { contractorApi } from '../../services/contractorApi';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'Contractors', to: '/contractors' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const dashboardPath = (role) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'contractor') return '/contractor/dashboard';
  return '/dashboard';
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contractorAvatar, setContractorAvatar] = useState('');
  const [avatarFailed, setAvatarFailed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setAvatarFailed(false);
    setContractorAvatar('');
    if (user?.role !== 'contractor' || user?.avatar?.url) return;

    contractorApi.me()
      .then(({ data }) => setContractorAvatar(data.data?.user?.avatar?.url || ''))
      .catch(() => {});
  }, [user?.role, user?.avatar?.url]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      } border-b border-border`}
    >
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="BuildNBuy logo"
            className="h-11 w-11 object-contain rounded-lg shadow-sm ring-1 ring-primary/10 group-hover:scale-105 transition-transform"
          />
          <span className="font-heading font-bold text-xl text-ink">
            Build<span className="text-primary">N</span>Buy
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-ink/80 hover:text-primary'
                }`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/properties" className="btn-secondary !px-4 !py-2 text-sm">
            <FaHome /> Find Property
          </Link>
          <Link to="/contractors" className="btn-primary !px-4 !py-2 text-sm">
            <FaHardHat /> Find Contractor
          </Link>

          {user ? (
            <div className="relative group ml-2">
              <button className="flex items-center gap-2 pl-2">
                {(user.avatar?.url || contractorAvatar) && !avatarFailed ? (
                  <img
                    src={user.avatar?.url || contractorAvatar}
                    alt={user.name}
                    onError={() => setAvatarFailed(true)}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-primary" />
                )}
              </button>
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-cardHover border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <p className="px-4 py-2 text-sm font-semibold text-ink border-b border-border truncate">{user.name}</p>
                <Link to={dashboardPath(user.role)} className="block px-4 py-2 text-sm text-ink/80 hover:bg-section">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/login" className="text-sm font-semibold text-ink/80 hover:text-primary px-3">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        <button className="lg:hidden text-2xl text-ink" onClick={() => setOpen(!open)}>
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden border-t border-border bg-white"
          >
            <div className="container-x py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setOpen(false)} className="py-2.5 text-ink/80 font-medium">
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col min-[380px]:flex-row gap-3 pt-3">
                <Link to="/properties" onClick={() => setOpen(false)} className="btn-secondary flex-1 text-sm !py-2.5">
                  Find Property
                </Link>
                <Link to="/contractors" onClick={() => setOpen(false)} className="btn-primary flex-1 text-sm !py-2.5">
                  Find Contractor
                </Link>
              </div>
              <div className="pt-3 border-t border-border mt-3">
                {user ? (
                  <>
                    <Link to={dashboardPath(user.role)} onClick={() => setOpen(false)} className="block py-2 font-medium text-ink">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="block py-2 font-medium text-red-600">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col min-[380px]:flex-row gap-3">
                    <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1 text-sm !py-2.5">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1 text-sm !py-2.5">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
