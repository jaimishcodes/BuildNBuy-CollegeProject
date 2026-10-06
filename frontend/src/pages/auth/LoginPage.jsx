import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

const dashboardPath = (role) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'contractor') return '/contractor/dashboard';
  return '/dashboard';
};

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email address';
    if (!form.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    try {
      const user = await login({ ...form, email: form.email.trim().toLowerCase() });
      navigate(dashboardPath(user.role));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Login to continue to your BuildNBuy account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }} className="input-field" />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }} className="input-field pr-12" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
