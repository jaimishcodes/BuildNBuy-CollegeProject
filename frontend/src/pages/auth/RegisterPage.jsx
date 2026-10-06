import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { validateName } from "../../utils/validation";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "customer",
  });
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    const nameError = validateName(form.name);
    if (nameError) nextErrors.name = nameError;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) nextErrors.email = "Enter a valid email address";
    const normalizedPhone = form.phone.replace(/\D/g, "");
    if (!/^\d{10}$/.test(normalizedPhone)) nextErrors.phone = "Enter a valid 10-digit mobile number";
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password)) {
      nextErrors.password = "Use at least 6 characters with at least one letter and one number";
    }
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = "Passwords do not match";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    try {
      const { confirmPassword, ...payload } = form;
      payload.name = payload.name.trim();
      payload.email = payload.email.trim().toLowerCase();
      payload.phone = normalizedPhone;
      const user = await register(payload);
      const dashboard = user.role === "admin"
        ? "/admin/dashboard"
        : user.role === "contractor" ? "/contractor/dashboard" : "/dashboard";
      navigate(dashboard);
    } catch (err) {
      const validationErrors = err?.response?.data?.errors || [];
      const nameError = validationErrors.find((error) => error.toLowerCase().includes('name'));
      if (nameError) {
        setErrors((current) => ({ ...current, name: nameError }));
      } else {
        toast.error(err?.response?.data?.message || "Registration failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join BuildNBuy to buy, rent, list, or build"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "customer" })}
            className={`py-3 rounded-xl border font-semibold text-xs sm:text-sm transition-colors ${form.role === "customer" ? "bg-primary text-white border-primary" : "border-border text-ink/70"}`}
          >
            I'm a Customer
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "contractor" })}
            className={`py-3 rounded-xl border font-semibold text-xs sm:text-sm transition-colors ${form.role === "contractor" ? "bg-primary text-white border-primary" : "border-border text-ink/70"}`}
          >
            I'm a Contractor
          </button>
        </div>

        <div>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
            className="input-field"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
            className="input-field"
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <input
            required
            placeholder="Phone number"
            type="tel"
            inputMode="tel"
            maxLength={10}
            value={form.phone}
            onChange={(e) => { setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }); setErrors({ ...errors, phone: '' }); }}
            className="input-field"
          />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }} className="input-field pr-12" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>
        <div>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }} className="input-field pr-12" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
