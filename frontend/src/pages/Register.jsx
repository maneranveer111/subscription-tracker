import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axios";
import { btnPrimary, card, input, label } from "../utils/ui";

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className={`${card} w-full max-w-sm`}>
        <h1 className="font-display text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-ink-soft">Track every subscription in one place.</p>

        {error && (
          <p role="alert" className="mt-4 rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">
            {error}
          </p>
        )}

        <div className="mt-5">
          <label htmlFor="name" className={label}>
            Name
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
          />
        </div>

        <div className="mt-4">
          <label htmlFor="email" className={label}>
            Email
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
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className={label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            className={input}
          />
          <p className="mt-1 text-xs text-ink-soft">Use at least 8 characters.</p>
        </div>

        <button type="submit" disabled={submitting} className={`${btnPrimary} mt-6 w-full`}>
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-4 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-ink underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
