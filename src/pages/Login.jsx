import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Sparkles, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import GradientBlobs from "../components/GradientBlobs";
import AuthSidePanel from "../components/AuthSidePanel";

export default function Login() {
  const [form, setForm] = useState({ userEmail: "", userPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.token);
      toast.success(data.message || "Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-2">
      <GradientBlobs className="lg:hidden" />
      <AuthSidePanel
        eyebrow="Welcome back"
        title="Pick up right where you left off."
        subtitle="Sign in to add reviews, manage the companies you've listed, and keep your voice heard."
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

          <h1 className="text-2xl font-bold text-slate-100">Log in</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            New here?{" "}
            <Link to="/register" className="font-medium text-brand-300 hover:text-brand-200">
              Create an account
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
                  name="userEmail"
                  value={form.userEmail}
                  onChange={onChange}
                  placeholder="you@example.com"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label-field">Password</label>
                <Link to="/forgot-password" className="mb-1.5 text-xs font-medium text-brand-300 hover:text-brand-200">
                  Forgot password?
                </Link>
              </div>
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
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : (
                <>
                  <LogIn size={16} />
                  Log in
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
