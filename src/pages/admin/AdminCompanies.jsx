import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, PlusCircle, Pencil, Trash2, Eye, UploadCloud, Building2, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { createCompany, updateCompany, deleteCompany } from "../../api/company";
import { fileUrl } from "../../api/axiosClient";
import Modal, { ConfirmModal } from "../../components/Modal";
import Avatar from "../../components/Avatar";
import StarRating from "../../components/StarRating";
import useAdminData from "./useAdminData";
import { formatDate, statsByCompany } from "../../utils/helpers";

const empty = { companyName: "", companyCity: "", companyLocation: "" };

function CompanyForm({ company, onSaved, onCancel }) {
  const [form, setForm] = useState(
    company
      ? { companyName: company.companyName, companyCity: company.companyCity, companyLocation: company.companyLocation }
      : empty
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(fileUrl(company?.profilePic));
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please choose an image file");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v.trim()));
      if (file) fd.append("profilePic", file);
      const { data } = company ? await updateCompany(company._id, fd) : await createCompany(fd);
      toast.success(data.message || "Saved");
      onSaved(data.company);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't save company.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="relative flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4 transition-colors hover:border-brand-400/60">
        {preview ? (
          <img src={preview} alt="" className="h-14 w-14 rounded-xl object-cover" />
        ) : (
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white/5 text-slate-500">
            <UploadCloud size={20} />
          </div>
        )}
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-medium text-slate-300">{file ? file.name : preview ? "Replace logo" : "Upload a logo"}</p>
          <p className="text-xs text-slate-500">PNG or JPG · optional</p>
        </div>
        <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="sr-only" />
      </label>

      <div>
        <label className="label-field" htmlFor="companyName">Company name</label>
        <div className="relative">
          <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input id="companyName" required minLength={3} maxLength={30} name="companyName" value={form.companyName}
            onChange={onChange} placeholder="Acme Corp" className="input-field !pl-10" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="companyCity">City</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="companyCity" required minLength={3} maxLength={30} name="companyCity" value={form.companyCity}
              onChange={onChange} placeholder="Austin" className="input-field !pl-10" />
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="companyLocation">Location / Address</label>
          <input id="companyLocation" required minLength={3} maxLength={30} name="companyLocation"
            value={form.companyLocation} onChange={onChange} placeholder="Downtown" className="input-field" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost !py-2.5">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary !py-2.5">
          {saving ? "Saving…" : company ? "Save changes" : "Add company"}
        </button>
      </div>
    </form>
  );
}

export default function AdminCompanies() {
  const { companies, setCompanies, reviews, setReviews, loading } = useAdminData();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | company
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (params.get("new")) {
      setEditing("new");
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const stats = useMemo(() => statsByCompany(reviews), [reviews]);
  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return companies
      .filter((c) => [c.companyName, c.companyCity, c.companyLocation].some((x) => x?.toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [companies, query]);

  const onSaved = (saved) => {
    setCompanies((list) =>
      list.some((c) => c._id === saved._id) ? list.map((c) => (c._id === saved._id ? saved : c)) : [saved, ...list]
    );
    setEditing(null);
  };

  const onDelete = async () => {
    setBusy(true);
    try {
      await deleteCompany(toDelete._id);
      setCompanies((list) => list.filter((c) => c._id !== toDelete._id));
      setReviews((list) => list.filter((r) => r.companyId !== toDelete._id));
      toast.success("Company deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't delete company.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Companies</h1>
          <p className="mt-1 text-sm text-slate-400">{companies.length} companies listed</p>
        </div>
        <button onClick={() => setEditing("new")} className="btn-primary self-start !py-2.5">
          <PlusCircle size={16} />
          Add company
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
          <Search size={16} className="text-slate-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, city or location…"
            className="w-full bg-transparent py-1 text-sm text-slate-100 outline-none placeholder:text-slate-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-white/[0.07] bg-white/[0.02]">
              <tr>
                <th className="table-head">Company</th>
                <th className="table-head">Location</th>
                <th className="table-head">Rating</th>
                <th className="table-head">Reviews</th>
                <th className="table-head">Added</th>
                <th className="table-head text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="table-cell" colSpan={6}><div className="skeleton h-8" /></td>
                  </tr>
                ))}
              {!loading && rows.map((c) => {
                const s = stats[c._id];
                return (
                  <tr key={c._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.companyName} src={c.profilePic} rounded="rounded-lg" />
                        <span className="font-semibold text-slate-100">{c.companyName}</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-400">{c.companyLocation}, {c.companyCity}</td>
                    <td className="table-cell">
                      {s ? (
                        <div className="flex items-center gap-2">
                          <StarRating value={s.avg} readOnly size={13} />
                          <span className="text-xs text-slate-400">{s.avg.toFixed(1)}</span>
                        </div>
                      ) : <span className="text-xs text-slate-500">No ratings</span>}
                    </td>
                    <td className="table-cell tabular-nums">{s?.count || 0}</td>
                    <td className="table-cell text-slate-400">{formatDate(c.createdAt)}</td>
                    <td className="table-cell">
                      <div className="flex justify-end gap-1">
                        <Link to={`/companies/${c._id}`} className="icon-btn" title="View public page" aria-label="View">
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => setEditing(c)} className="icon-btn" title="Edit" aria-label="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setToDelete(c)} className="icon-btn hover:!bg-red-500/10 hover:!text-red-400"
                          title="Delete" aria-label="Delete">
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
            <p className="px-5 py-12 text-center text-sm text-slate-500">
              {query ? `No companies match "${query}".` : "No companies yet."}
            </p>
          )}
        </div>
      </div>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add company" : "Edit company"}
        subtitle={editing === "new" ? "List a company so people can start reviewing it." : editing?.companyName}
      >
        {editing && (
          <CompanyForm
            key={editing === "new" ? "new" : editing._id}
            company={editing === "new" ? null : editing}
            onSaved={onSaved}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={onDelete}
        busy={busy}
        title="Delete company?"
        message={
          <>
            <strong className="text-slate-200">{toDelete?.companyName}</strong> and all{" "}
            {stats[toDelete?._id]?.count || 0} of its reviews will be permanently removed.
          </>
        }
      />
    </div>
  );
}
