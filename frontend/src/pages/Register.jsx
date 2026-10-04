import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axios";
import { btnPrimary, card, input, label } from "../utils/ui";

import AuthHero from "../components/AuthHero";

export default function Register() {
  const { user, register, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Brand & Product Info */}
        <div className="lg:col-span-7">
          <AuthHero />
        </div>

        {/* Right Column: Register Card */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className={`${card} w-full shadow-lg shadow-ink/5`}>
            <div className="mb-2">
              <h2 className="font-display text-2xl font-bold text-ink">Create your account</h2>
              <p className="mt-1 text-sm text-ink-soft">Get started with SubTracker in seconds.</p>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">
                {error}
              </p>
            )}

            <div className="mt-5">
              <label htmlFor="name" className={label}>
                Full name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
                className={input}
                placeholder="Jane Doe"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="email" className={label}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
                className={input}
                placeholder="name@example.com"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className={label}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className={`${input} pr-14`}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2.5 flex items-center text-xs font-medium text-ink-soft hover:text-ink"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-ink-soft select-none">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-line accent-ink"
                />
                Show password
              </label>
              <p className="mt-1 text-xs text-ink-soft">Use at least 8 characters.</p>
            </div>

            <button type="submit" disabled={submitting} className={`${btnPrimary} mt-6 w-full`}>
              {submitting ? "Creating account..." : "Create account"}
            </button>

            <div className="relative my-5 flex items-center">
              <div className="flex-grow border-t border-line" />
              <span className="mx-3 text-xs text-ink-soft">or continue with</span>
              <div className="flex-grow border-t border-line" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-in failed. Please try again.")}
                text="signup_with"
                shape="rectangular"
                theme="outline"
                size="large"
                width="320"
              />
            </div>

            <p className="mt-5 text-center text-sm text-ink-soft">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-ink underline hover:text-ink/80">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

