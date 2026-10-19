import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Star, MessageSquare } from "lucide-react";
import Avatar from "./Avatar";

// stats: optional { avg, count } for this company (see statsByCompany)
export default function CompanyCard({ company, stats, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative"
    >
      <Link
        to={`/companies/${company._id}`}
        className="glass-card relative flex h-full flex-col overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-lift"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="flex items-start gap-4">
          <Avatar
            name={company.companyName}
            src={company.profilePic}
            size="h-14 w-14"
            rounded="rounded-2xl"
            className="!text-base shadow-lg ring-1 ring-white/10"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-base font-semibold text-slate-100">{company.companyName}</h3>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-slate-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-300"
              />
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">
                {company.companyLocation}
                {company.companyCity ? `, ${company.companyCity}` : ""}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-sm">
          {stats ? (
            <span className="flex items-center gap-1.5 font-semibold text-slate-100">
              <Star size={15} className="fill-gold-400 text-gold-400" />
              {stats.avg.toFixed(1)}
              <span className="font-normal text-slate-500">/ 5</span>
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-500">Not rated yet</span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <MessageSquare size={13} />
            {stats?.count || 0} review{stats?.count === 1 ? "" : "s"}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
