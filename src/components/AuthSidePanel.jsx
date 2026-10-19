import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import GradientBlobs from "./GradientBlobs";

export default function AuthSidePanel({ eyebrow, title, subtitle }) {
  return (
    <div className="auth-panel relative hidden overflow-hidden border-r border-white/10 bg-ink-950 px-14 py-16 lg:flex lg:flex-col lg:justify-between">
      <GradientBlobs />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="chip border-brand-400/30 bg-brand-500/10 text-brand-200">
          {eyebrow}
        </span>
        <h2 className="mt-6 max-w-md text-3xl font-bold leading-tight tracking-tight text-slate-100">
          {title}
        </h2>
        <p className="mt-4 max-w-sm text-sm text-slate-400">{subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card max-w-sm p-6"
      >
        <Quote className="text-brand-400" size={22} />
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          "Reading real reviews before signing a contract saved us from a
          costly mistake. This is exactly the transparency companies need."
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">— A Rately member</span>
          <div className="flex gap-0.5 text-gold-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} className="fill-gold-400" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
