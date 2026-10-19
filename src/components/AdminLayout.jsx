import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  MessagesSquare,
  Sparkles,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Avatar from "./Avatar";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/companies", label: "Companies", icon: Building2 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: MessagesSquare },
];

function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-glow">
          <Sparkles size={18} className="text-white" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-base font-bold text-slate-100">Rately</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-300">
            Admin console
          </p>
        </div>
      </Link>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Manage
        </p>
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-500/[0.12] text-brand-200"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="admin-nav"
                    className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-brand-400"
                  />
                )}
                <Icon size={18} />
                {label}
              </>
            )}
          </NavLink>
        ))}

        <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Site
        </p>
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-100"
        >
          <ExternalLink size={18} />
          View public site
        </Link>
      </nav>

      <div className="m-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || ""} src={user?.profilePic} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-100">{user?.name}</p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <ShieldCheck size={12} className="text-emerald-400" />
              Administrator
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="icon-btn hover:!text-red-400"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const current = nav.find((n) =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );

  return (
    <div className="min-h-screen bg-ink-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.07] bg-ink-950 lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/[0.07] bg-ink-950 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="icon-btn absolute right-3 top-5"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/[0.07] bg-ink-900/80 px-4 py-3.5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="icon-btn !h-9 !w-9 border border-white/10 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="text-sm">
              <span className="text-slate-500">Admin</span>
              <span className="mx-2 text-slate-600">/</span>
              <span className="font-semibold text-slate-100">{current?.label || "Dashboard"}</span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="icon-btn !h-9 !w-9 border border-white/10"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
