import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, MapPin, UploadCloud, ArrowLeft, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createCompany } from "../api/company";
import GradientBlobs from "../components/GradientBlobs";

export default function AddCompany() {
  const [form, setForm] = useState({
    companyName: "",
    companyLocation: "",
    companyCity: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) {
        fd.append("profilePic", file);
      }

      const { data } = await createCompany(fd);
      toast.success(data.message || "Company added!");
      navigate(`/companies/${data.company._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't add company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-2xl px-6 py-16">
      <GradientBlobs />

      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-brand-300">
            <Building2 size={19} />
          </div>
          <h1 className="text-xl font-bold text-slate-100">Add a company</h1>
        </div>
        <p className="mb-7 text-sm text-slate-400">
          List a company so the community can start leaving reviews.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`relative flex items-center gap-4 rounded-xl border border-dashed p-4 transition-colors ${
              dragOver ? "border-brand-400 bg-brand-500/10" : "border-white/15 bg-white/[0.02]"
            }`}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="h-16 w-16 rounded-xl object-cover" />
            ) : (
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-white/5 text-slate-500">
                <UploadCloud size={22} />
              </div>
            )}
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium text-slate-300">
                {file ? file.name : "Upload a logo or photo (optional)"}
              </p>
              <p className="text-xs text-slate-500">
                PNG or JPG, drag & drop or click — skip it to use initials instead
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>

          <div>
            <label className="label-field">Company name</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                required
                minLength={3}
                maxLength={30}
                name="companyName"
                value={form.companyName}
                onChange={onChange}
                placeholder="Acme Corp"
                className="input-field !pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">City</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  minLength={3}
                  maxLength={30}
                  name="companyCity"
                  value={form.companyCity}
                  onChange={onChange}
                  placeholder="Austin"
                  className="input-field !pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label-field">Location / Address</label>
              <input
                required
                minLength={3}
                maxLength={30}
                name="companyLocation"
                value={form.companyLocation}
                onChange={onChange}
                placeholder="Downtown"
                className="input-field"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Adding…" : (
              <>
                <PlusCircle size={16} />
                Add company
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
