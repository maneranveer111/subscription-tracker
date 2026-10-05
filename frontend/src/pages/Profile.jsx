import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/authApi";
import { getErrorMessage } from "../api/axios";
import { card, label, input, btnPrimary, btnDanger } from "../utils/ui";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const dirty =
    form.name !== (user?.name || "") ||
    form.username !== (user?.username || "") ||
    form.email !== (user?.email || "") ||
    form.phone !== (user?.phone || "");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await updateProfile(form);
      setUser(data.user);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Generate initials for avatar
  const initials = (user?.name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Profile header */}
      <div className={`${card} flex flex-col items-center gap-4 text-center`}>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink text-2xl font-bold text-white">
          {initials}
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold">{user?.name}</h1>
          <p className="text-sm text-ink-soft">{user?.email}</p>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className={`${card} space-y-5`}>
        <h2 className="font-display text-lg font-semibold">Edit profile</h2>

        <div>
          <label htmlFor="profile-name" className={label}>
            Full name
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={input}
            maxLength={60}
            required
          />
        </div>

        <div>
          <label htmlFor="profile-username" className={label}>
            Username
          </label>
          <input
            id="profile-username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className={input}
            maxLength={30}
            placeholder="Optional"
          />
        </div>

        <div>
          <label htmlFor="profile-email" className={label}>
            Email
            <span className="ml-1 text-xs font-normal text-ink-soft">
              (notifications are sent here)
            </span>
          </label>
          <input
            id="profile-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={input}
            required
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className={label}>
            Phone number
          </label>
          <input
            id="profile-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className={input}
            maxLength={20}
            placeholder="Optional"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        )}

        <button type="submit" disabled={!dirty || saving} className={btnPrimary}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Logout section */}
      <div className={`${card} flex items-center justify-between`}>
        <div>
          <p className="text-sm font-medium text-ink">Sign out</p>
          <p className="text-xs text-ink-soft">Log out of your account on this device</p>
        </div>
        <button onClick={handleLogout} className={btnDanger}>
          Log out
        </button>
      </div>
    </div>
  );
}
