import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLayout from '../../layouts/AuthLayout';
import { authApi } from '../../services/authApi';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) {
      setError('Use at least 6 characters with at least one letter and one number');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await authApi.resetPassword(token, { password });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong new password for your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input required type={showPassword ? 'text' : 'password'} placeholder="New password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} className="input-field pr-12" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="relative">
          <input required type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} className="input-field pr-12" />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <p className="text-center text-sm text-muted mt-6">
        <Link to="/login" className="text-primary font-semibold hover:underline">Back to Login</Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
