import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Pencil, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { updateReview, deleteReview } from "../../api/review";
import Modal, { ConfirmModal } from "../../components/Modal";
import Avatar from "../../components/Avatar";
import StarRating from "../../components/StarRating";
import useAdminData from "./useAdminData";
import { formatDate } from "../../utils/helpers";

function ReviewForm({ review, onSaved, onCancel }) {
  const [form, setForm] = useState({ subject: review.subject, review: review.review, rating: Number(review.rating) });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateReview(review._id, { ...form, rating: String(form.rating) });
      toast.success("Review updated");
      onSaved(data.updateReview);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't update review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label-field">Rating</label>
        <StarRating value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} size={24} showValue />
      </div>
      <div>
        <label className="label-field" htmlFor="subject">Subject</label>
        <input id="subject" required minLength={3} maxLength={30} value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input-field" />
      </div>
      <div>
        <label className="label-field" htmlFor="review">Review</label>
        <textarea id="review" required minLength={3} rows={4} value={form.review}
          onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))} className="input-field resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost !py-2.5">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary !py-2.5">{saving ? "Saving…" : "Save changes"}</button>
      </div>
    </form>
  );
}

export default function AdminReviews() {
  const { reviews, setReviews, companies, companyById, userById, loading } = useAdminData();
  const [query, setQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [companyId, setCompanyId] = useState("");
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return reviews
      .filter((r) => !rating || Math.round(Number(r.rating)) === rating)
      .filter((r) => !companyId || r.companyId === companyId)
      .filter((r) =>
        [r.subject, r.review, userById[r.userId]?.userName, companyById[r.companyId]?.companyName].some((x) =>
          x?.toLowerCase().includes(q)
        )
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reviews, query, rating, companyId, userById, companyById]);

  const onDelete = async () => {
    setBusy(true);
    try {
      await deleteReview(toDelete._id);
      setReviews((list) => list.filter((r) => r._id !== toDelete._id));
      toast.success("Review deleted");
      setToDelete(null);
    } catch {
      toast.error("Couldn't delete review.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Reviews</h1>
        <p className="mt-1 text-sm text-slate-400">Moderate everything posted on Rately — {reviews.length} reviews total.</p>
      </div>

      <div className="glass-card flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2 px-2">
          <Search size={16} className="text-slate-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search text, reviewer or company…"
            className="w-full bg-transparent py-1.5 text-sm text-slate-100 outline-none placeholder:text-slate-500" />
        </div>
        <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="input-field !w-auto !py-2"
          aria-label="Filter by company">
          <option value="">All companies</option>
          {companies.map((c) => <option key={c._id} value={c._id}>{c.companyName}</option>)}
        </select>
        <div className="flex gap-1 rounded-xl bg-white/[0.04] p-1" role="group" aria-label="Filter by rating">
          {[0, 5, 4, 3, 2, 1].map((n) => (
            <button key={n} onClick={() => setRating(n)}
              className={clsx(
                "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                rating === n ? "bg-brand-500 text-white shadow-glow" : "text-slate-400 hover:text-slate-100"
              )}>
              {n ? <>{n}<Star size={11} className="fill-current" /></> : "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading && Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24" />)}
        {!loading && rows.map((r) => {
          const u = userById[r.userId];
          const c = companyById[r.companyId];
          return (
            <div key={r._id} className="glass-card flex flex-col gap-4 p-5 sm:flex-row">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="flex items-center gap-2">
                    <Avatar name={u?.userName || "?"} src={u?.profilePic} size="h-7 w-7" />
                    <span className="text-sm font-semibold text-slate-100">{u?.userName || "Deleted user"}</span>
                  </div>
                  <span className="text-xs text-slate-500">reviewed</span>
                  {c ? (
                    <Link to={`/companies/${c._id}`} className="text-sm font-semibold text-brand-300 hover:text-brand-200">
                      {c.companyName}
                    </Link>
                  ) : <span className="text-sm text-slate-500">Deleted company</span>}
                  <span className="text-xs text-slate-500">· {formatDate(r.createdAt)}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <StarRating value={Number(r.rating)} readOnly size={14} />
                  <span className="text-sm font-semibold text-slate-200">{r.subject}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{r.review}</p>
              </div>
              <div className="flex shrink-0 gap-1 self-start">
                <button onClick={() => setEditing(r)} className="icon-btn" title="Edit" aria-label="Edit review">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setToDelete(r)} className="icon-btn hover:!bg-red-500/10 hover:!text-red-400"
                  title="Delete" aria-label="Delete review">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
        {!loading && rows.length === 0 && (
          <div className="glass-card px-5 py-12 text-center text-sm text-slate-500">No reviews match your filters.</div>
        )}
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit review"
        subtitle={editing && `by ${userById[editing.userId]?.userName || "deleted user"}`}>
        {editing && (
          <ReviewForm key={editing._id} review={editing} onCancel={() => setEditing(null)}
            onSaved={(saved) => {
              setReviews((list) => list.map((r) => (r._id === saved._id ? saved : r)));
              setEditing(null);
            }} />
        )}
      </Modal>

      <ConfirmModal open={Boolean(toDelete)} onClose={() => setToDelete(null)} onConfirm={onDelete} busy={busy}
        title="Delete review?" message={<>“{toDelete?.subject}” will be permanently removed.</>} />
    </div>
  );
}
