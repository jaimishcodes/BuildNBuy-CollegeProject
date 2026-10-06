import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { authApi } from '../../services/authApi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const { data } = await authApi.forgotPassword({ email: normalizedEmail });
      setResetUrl(data.data?.resetUrl || '');
      setSent(true);
      toast.success(data.message || 'Reset instructions generated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email and we'll send you reset instructions">
      {sent ? (
        <div className="card p-6 text-center">
          <p className="text-ink font-medium mb-2">Password reset request received</p>
          <p className="text-sm text-muted">Use the reset link below to create a new password.</p>
          {resetUrl ? (
            <a href={resetUrl} className="text-primary text-sm font-semibold break-all block mt-4 hover:underline">Open password reset link</a>
          ) : (
            <p className="text-sm text-muted mt-4">If an account exists, check your email for the reset link.</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input required type="email" placeholder="Email address" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} className="input-field" />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
      <p className="text-center text-sm text-muted mt-6">
        <Link to="/login" className="text-primary font-semibold hover:underline">Back to Login</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
