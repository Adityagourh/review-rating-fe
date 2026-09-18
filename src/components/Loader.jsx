import { motion } from "framer-motion";

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-white/10 border-t-brand-400"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      />
    </div>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton h-32 w-full" />
      <div className="skeleton mt-4 h-4 w-3/4" />
      <div className="skeleton mt-2 h-3 w-1/2" />
      <div className="mt-4 flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-3 w-1/3" />
          <div className="skeleton mt-2 h-3 w-1/4" />
        </div>
      </div>
      <div className="skeleton mt-4 h-3 w-full" />
      <div className="skeleton mt-2 h-3 w-5/6" />
    </div>
  );
}
