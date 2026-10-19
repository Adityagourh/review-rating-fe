import { useMemo, useState } from "react";
import { Search, Trash2, ShieldCheck, ShieldOff, Shield } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { updateUserRole, deleteUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { ConfirmModal } from "../../components/Modal";
import Avatar from "../../components/Avatar";
import useAdminData from "./useAdminData";
import { formatDate } from "../../utils/helpers";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "admin", label: "Admins" },
  { key: "user", label: "Members" },
];

export default function AdminUsers() {
  const { user: me } = useAuth();
  const { users, setUsers, reviews, setReviews, loading } = useAdminData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(null);

  const reviewCount = useMemo(() => {
    const m = {};
    for (const r of reviews) m[r.userId] = (m[r.userId] || 0) + 1;
    return m;
  }, [reviews]);

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        (filter === "all" || (u.userRole || "user") === filter) &&
        [u.userName, u.userEmail, u.userCity].some((x) => x?.toLowerCase().includes(q))
    );
  }, [users, query, filter]);

  const toggleRole = async (u) => {
    const userRole = u.userRole === "admin" ? "user" : "admin";
    setBusy(u._id);
    try {
      await updateUserRole(u._id, userRole);
      setUsers((list) => list.map((x) => (x._id === u._id ? { ...x, userRole } : x)));
      toast.success(`${u.userName} is now ${userRole === "admin" ? "an admin" : "a member"}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't update role.");
    } finally {
      setBusy(null);
    }
  };

  const onDelete = async () => {
    setBusy(toDelete._id);
    try {
      await deleteUser(toDelete._id);
      setUsers((list) => list.filter((u) => u._id !== toDelete._id));
      setReviews((list) => list.filter((r) => r.userId !== toDelete._id));
      toast.success("User deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't delete user.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Users</h1>
        <p className="mt-1 text-sm text-slate-400">
          {users.length} registered · {users.filter((u) => u.userRole === "admin").length} admins
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2">
            <Search size={16} className="text-slate-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email or city…"
              className="w-full bg-transparent py-1 text-sm text-slate-100 outline-none placeholder:text-slate-500" />
          </div>
          <div className="flex gap-1 rounded-xl bg-white/[0.04] p-1">
            {FILTERS.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={clsx(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === f.key ? "bg-brand-500 text-white shadow-glow" : "text-slate-400 hover:text-slate-100"
                )}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-white/[0.07] bg-white/[0.02]">
              <tr>
                <th className="table-head">User</th>
                <th className="table-head">Phone</th>
                <th className="table-head">Location</th>
                <th className="table-head">Role</th>
                <th className="table-head">Reviews</th>
                <th className="table-head">Joined</th>
                <th className="table-head text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td className="table-cell" colSpan={7}><div className="skeleton h-8" /></td></tr>
                ))}
              {!loading && rows.map((u) => {
                const isMe = u._id === me?.id;
                const isAdmin = u.userRole === "admin";
                return (
                  <tr key={u._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.userName} src={u.profilePic} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-100">
                            {u.userName}
                            {isMe && <span className="ml-2 text-xs font-medium text-brand-300">(you)</span>}
                          </p>
                          <p className="truncate text-xs text-slate-500">{u.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell tabular-nums text-slate-400">{u.userPhone}</td>
                    <td className="table-cell text-slate-400">{[u.userCity, u.userState].filter(Boolean).join(", ")}</td>
                    <td className="table-cell">
                      <span className={clsx(
                        "chip",
                        isAdmin && "!border-emerald-400/30 !bg-emerald-500/10 !text-emerald-300"
                      )}>
                        {isAdmin ? <ShieldCheck size={12} /> : <Shield size={12} />}
                        {isAdmin ? "Admin" : "Member"}
                      </span>
                    </td>
                    <td className="table-cell tabular-nums">{reviewCount[u._id] || 0}</td>
                    <td className="table-cell text-slate-400">{formatDate(u.createdAt)}</td>
                    <td className="table-cell">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => toggleRole(u)}
                          disabled={isMe || busy === u._id}
                          className="icon-btn disabled:pointer-events-none disabled:opacity-30"
                          title={isMe ? "You can't change your own role" : isAdmin ? "Revoke admin" : "Make admin"}
                          aria-label={isAdmin ? "Revoke admin" : "Make admin"}
                        >
                          {isAdmin ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button
                          onClick={() => setToDelete(u)}
                          disabled={isMe}
                          className="icon-btn hover:!bg-red-500/10 hover:!text-red-400 disabled:pointer-events-none disabled:opacity-30"
                          title={isMe ? "You can't delete yourself" : "Delete user"}
                          aria-label="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && rows.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-slate-500">No users match your filters.</p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={onDelete}
        busy={busy === toDelete?._id}
        title="Delete user?"
        message={
          <>
            <strong className="text-slate-200">{toDelete?.userName}</strong> ({toDelete?.userEmail}) and their{" "}
            {reviewCount[toDelete?._id] || 0} review(s) will be permanently removed.
          </>
        }
      />
    </div>
  );
}
