import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { btnSecondary } from "../utils/ui";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/insights", label: "AI insights" },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-display text-lg font-bold text-ink">SubTracker</span>
          <nav className="flex gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    isActive ? "bg-ink text-white" : "text-ink-soft hover:bg-paper hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-soft sm:inline">{user?.name}</span>
          <button onClick={logout} className={btnSecondary}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
