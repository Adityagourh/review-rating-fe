import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  MessagesSquare,
  Star,
  ArrowRight,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/Avatar";
import StarRating from "../../components/StarRating";
import useAdminData from "./useAdminData";
import { averageRating, statsByCompany, timeAgo } from "../../utils/helpers";

const WEEK = 7 * 24 * 3600 * 1000;

function StatTile({ icon: Icon, label, value, hint, tone, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}>
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-slate-100">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </motion.div>
  );
}

function Panel({ title, action, children, className = "" }) {
  return (
    <div className={`glass-card flex flex-col ${className}`}>
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
        {action}
      </div>
      <div className="flex-1 p-5">{children}</div>
    </div>
  );
}

const ViewAll = ({ to }) => (
  <Link to={to} className="flex items-center gap-1 text-xs font-semibold text-brand-300 hover:text-brand-200">
    View all <ArrowRight size={13} />
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const { companies, users, reviews, companyById, userById, loading } = useAdminData();

  const d = useMemo(() => {
    const now = Date.now();
    const stats = statsByCompany(reviews);
    const dist = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => Math.round(Number(r.rating)) === star).length,
    }));
    return {
      avg: averageRating(reviews),
      newReviews: reviews.filter((r) => now - new Date(r.createdAt) < WEEK).length,
      newUsers: users.filter((u) => now - new Date(u.createdAt) < WEEK).length,
      admins: users.filter((u) => u.userRole === "admin").length,
      dist,
      maxDist: Math.max(1, ...dist.map((x) => x.count)),
      top: companies
        .filter((c) => stats[c._id])
        .map((c) => ({ ...c, ...stats[c._id] }))
        .sort((a, b) => b.avg - a.avg || b.count - a.count)
        .slice(0, 5),
      recent: [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
      newest: users.slice(0, 5),
    };
  }, [companies, users, reviews]);

  const v = (x) => (loading ? "—" : x);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">Here's what's happening on Rately.</p>
        </div>
        <Link to="/admin/companies?new=1" className="btn-primary self-start !py-2.5">
          <PlusCircle size={16} />
          Add company
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile index={0} icon={Building2} label="Companies" value={v(companies.length)}
          hint="Listed on the platform" tone="bg-brand-500/15 text-brand-300" />
        <StatTile index={1} icon={Users} label="Users" value={v(users.length)}
          hint={`${d.admins} admin${d.admins === 1 ? "" : "s"} · +${d.newUsers} this week`}
          tone="bg-sky-500/15 text-sky-300" />
        <StatTile index={2} icon={MessagesSquare} label="Reviews" value={v(reviews.length)}
          hint={`+${d.newReviews} in the last 7 days`} tone="bg-emerald-500/15 text-emerald-300" />
        <StatTile index={3} icon={Star} label="Avg. rating" value={v(d.avg ? d.avg.toFixed(2) : "—")}
          hint="Across all reviews" tone="bg-gold-500/15 text-gold-400" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel title="Rating distribution" className="lg:col-span-2">
          <div className="space-y-3">
            {d.dist.map(({ star, count }) => (
              <div
                key={star}
                className="group flex items-center gap-3"
                title={`${star}-star: ${count} review${count === 1 ? "" : "s"}`}
              >
                <span className="flex w-8 items-center gap-1 text-sm font-medium text-slate-300">
                  {star}
                  <Star size={12} className="fill-gold-400 text-gold-400" />
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gold-400 group-hover:bg-gold-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / d.maxDist) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span className="w-8 text-right text-sm tabular-nums text-slate-400">{count}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top rated companies" action={<ViewAll to="/admin/companies" />} className="lg:col-span-3">
          {d.top.length === 0 ? (
            <p className="text-sm text-slate-500">No rated companies yet.</p>
          ) : (
            <ul className="-my-2 divide-y divide-white/[0.06]">
              {d.top.map((c, i) => (
                <li key={c._id} className="flex items-center gap-3 py-2.5">
                  <span className="w-4 text-xs font-semibold text-slate-500">{i + 1}</span>
                  <Avatar name={c.companyName} src={c.profilePic} rounded="rounded-lg" />
                  <Link to={`/companies/${c._id}`} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-100 hover:text-brand-200">
                      {c.companyName}
                    </p>
                    <p className="truncate text-xs text-slate-500">{c.companyCity}</p>
                  </Link>
                  <div className="text-right">
                    <StarRating value={c.avg} readOnly size={13} />
                    <p className="text-xs text-slate-500">
                      {c.avg.toFixed(1)} · {c.count} review{c.count === 1 ? "" : "s"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel title="Recent reviews" action={<ViewAll to="/admin/reviews" />} className="lg:col-span-3">
          {d.recent.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          ) : (
            <ul className="-my-2 divide-y divide-white/[0.06]">
              {d.recent.map((r) => {
                const u = userById[r.userId];
                const c = companyById[r.companyId];
                return (
                  <li key={r._id} className="flex gap-3 py-3">
                    <Avatar name={u?.userName || "?"} src={u?.profilePic} size="h-8 w-8" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-400">
                        <span className="font-semibold text-slate-100">{u?.userName || "Deleted user"}</span>
                        {" on "}
                        <span className="font-semibold text-slate-200">{c?.companyName || "Deleted company"}</span>
                      </p>
                      <p className="mt-0.5 truncate text-sm text-slate-400">
                        <span className="text-slate-300">{r.subject}</span> — {r.review}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <StarRating value={Number(r.rating)} readOnly size={12} />
                      <p className="mt-0.5 text-xs text-slate-500">{timeAgo(r.createdAt)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Newest members" action={<ViewAll to="/admin/users" />} className="lg:col-span-2">
          {d.newest.length === 0 ? (
            <p className="text-sm text-slate-500">No users yet.</p>
          ) : (
            <ul className="-my-2 divide-y divide-white/[0.06]">
              {d.newest.map((u) => (
                <li key={u._id} className="flex items-center gap-3 py-2.5">
                  <Avatar name={u.userName} src={u.profilePic} size="h-8 w-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-100">{u.userName}</p>
                    <p className="truncate text-xs text-slate-500">{u.userEmail}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <TrendingUp size={12} />
                    {timeAgo(u.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
