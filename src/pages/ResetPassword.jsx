import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Sparkles, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "../api/auth";
import AuthSidePanel from "../components/AuthSidePanel";
import GradientBlobs from "../components/GradientBlobs";

export default function ResetPassword() {
  const { id, token } = useParams();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await resetPassword(id, token, form);
      toast.success(data.message || "Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-2">
      <GradientBlobs className="lg:hidden" />
      <AuthSidePanel
        eyebrow="Almost there"
        title="Set a fresh password."
        subtitle="Pick something strong you haven't used elsewhere."
      />

      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
              <Sparkles size={18} className="text-white" />
            </span>
            <span className="text-lg font-bold">Rately</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-100">Reset password</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Choose a new password for your account.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label-field">New password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Resetting…" : (
                <>
                  <KeyRound size={16} />
                  Reset password
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
