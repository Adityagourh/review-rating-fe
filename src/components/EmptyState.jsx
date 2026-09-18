import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card mx-auto flex max-w-md flex-col items-center gap-3 p-10 text-center"
    >
      {Icon && (
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-brand-300">
          <Icon size={26} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      {action}
    </motion.div>
  );
}
