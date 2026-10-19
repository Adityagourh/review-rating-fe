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
      <div className="flex gap-4">
        <div className="skeleton h-14 w-14 shrink-0 rounded-2xl" />
        <div className="flex-1">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton mt-2 h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-5 flex justify-between border-t border-white/[0.07] pt-4">
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-4 w-20" />
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
