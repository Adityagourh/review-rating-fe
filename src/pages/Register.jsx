import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  UploadCloud,
  Check,
  X,
  Sparkles,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "../api/auth";
import AuthSidePanel from "../components/AuthSidePanel";
import GradientBlobs from "../components/GradientBlobs";

const initialForm = {
  userName: "",
  userEmail: "",
  userPassword: "",
  userPhone: "",
  userCity: "",
  userState: "",
};

const passwordRules = [
  { key: "length", label: "8+ characters", test: (v) => v.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "lower", label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { key: "number", label: "One number", test: (v) => /[0-9]/.test(v) },
  { key: "special", label: "One special character", test: (v) => /[^A-Za-z0-9\s]/.test(v) },
];

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
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
    const failedRule = passwordRules.find((r) => !r.test(form.userPassword));
    if (failedRule) {
      toast.error(`Password needs: ${failedRule.label.toLowerCase()}`);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("profilePic", file);

      const { data } = await registerUser(fd);
      toast.success(data.message || "Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-2">
      <GradientBlobs className="lg:hidden" />
      <AuthSidePanel
        eyebrow="Join Rately"
        title="Your review can help someone make a better decision."
        subtitle="Create your profile, browse companies, and start sharing honest, first-hand experiences."
      />

      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
              <Sparkles size={18} className="text-white" />
            </span>
            <span className="text-lg font-bold">Rately</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Already have one?{" "}
            <Link to="/login" className="font-medium text-brand-300 hover:text-brand-200">
              Log in
            </Link>
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
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
                <img src={preview} alt="Preview" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/5 text-slate-500">
                  <UploadCloud size={20} />
                </div>
              )}
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-medium text-slate-300">
                  {file ? file.name : "Upload a profile photo (optional)"}
                </p>
                <p className="text-xs text-slate-500">PNG or JPG, drag & drop or click</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>

            <div>
              <label className="label-field">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  name="userName"
                  value={form.userName}
                  onChange={onChange}
                  minLength={3}
                  placeholder="Jordan Lee"
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
                    name="userCity"
                    value={form.userCity}
                    onChange={onChange}
                    placeholder="Austin"
                    className="input-field !pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="label-field">State</label>
                <input
                  required
                  name="userState"
                  value={form.userState}
                  onChange={onChange}
                  placeholder="Texas"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="email"
                  name="userEmail"
                  value={form.userEmail}
                  onChange={onChange}
                  placeholder="you@example.com"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="tel"
                  name="userPhone"
                  value={form.userPhone}
                  onChange={onChange}
                  placeholder="9876543210"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="userPassword"
                  value={form.userPassword}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="input-field !pl-10 !pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <AnimatePresence>
                {form.userPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2.5 grid grid-cols-1 gap-1.5 overflow-hidden sm:grid-cols-2"
                  >
                    {passwordRules.map((rule) => {
                      const passed = rule.test(form.userPassword);
                      return (
                        <div
                          key={rule.key}
                          className={`flex items-center gap-1.5 text-xs ${
                            passed ? "text-emerald-400" : "text-slate-500"
                          }`}
                        >
                          {passed ? <Check size={12} /> : <X size={12} />}
                          {rule.label}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account…" : (
                <>
                  <UserPlus size={16} />
                  Create account
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
