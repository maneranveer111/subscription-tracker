import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/insights", label: "AI insights" },
];

export default function Navbar() {
  const { user } = useAuth();

  const initials = (user?.name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition ${
              isActive
                ? "bg-ink/5 ring-2 ring-ink/20"
                : "hover:bg-paper"
            }`
          }
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-sm font-medium text-ink sm:inline">{user?.name}</span>
        </NavLink>
      </div>
    </header>
  );
}

