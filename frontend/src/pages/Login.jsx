import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axios";
import { btnPrimary, card, input, label } from "../utils/ui";

export default function Login() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className={`${card} w-full max-w-sm`}>
        <h1 className="font-display text-2xl font-semibold">Log in</h1>
        <p className="mt-1 text-sm text-ink-soft">See what's renewing and what it costs you.</p>

        {error && (
          <p role="alert" className="mt-4 rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">
            {error}
          </p>
        )}

        <div className="mt-5">
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
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
            className={input}
          />
        </div>

        <button type="submit" disabled={submitting} className={`${btnPrimary} mt-6 w-full`}>
          {submitting ? "Logging in..." : "Log in"}
        </button>

        <p className="mt-4 text-center text-sm text-ink-soft">
          New here?{" "}
          <Link to="/register" className="font-semibold text-ink underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
