import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Sparkles, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { sendResetLink } from "../api/auth";
import AuthSidePanel from "../components/AuthSidePanel";
import GradientBlobs from "../components/GradientBlobs";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await sendResetLink({ userEmail: email });
      toast.success(data.message || "Reset link sent — check your inbox.");
      setSent(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-2">
      <GradientBlobs className="lg:hidden" />
      <AuthSidePanel
        eyebrow="Account recovery"
        title="Locked out happens to the best of us."
        subtitle="Pop in your email and we'll send a secure link to get you back in."
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

          {sent ? (
            <div className="glass-card p-6 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                <MailCheck size={22} />
              </div>
              <h2 className="mt-4 font-semibold text-slate-100">Check your inbox</h2>
              <p className="mt-1.5 text-sm text-slate-400">
                If an account exists for <span className="text-slate-200">{email}</span>, a
                password reset link is on its way.
              </p>
              <Link to="/login" className="btn-ghost mt-5 w-full">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-100">Forgot password</h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Remembered it after all?{" "}
                <Link to="/login" className="font-medium text-brand-300 hover:text-brand-200">
                  Log in
                </Link>
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="label-field">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field !pl-10"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
