import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Building2 } from "lucide-react";
import { fileUrl } from "../api/axiosClient";
import { colorFromString, initials } from "../utils/helpers";

export default function CompanyCard({ company, index = 0 }) {
  const pic = fileUrl(company.profilePic);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <Link
        to={`/companies/${company._id}`}
        className="glass-card relative block overflow-hidden p-5 transition-all duration-300 hover:border-brand-400/30"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-brand-600/25 to-accent-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex items-start gap-4">
          {pic ? (
            <img
              src={pic}
              alt={company.companyName}
              className="h-16 w-16 shrink-0 rounded-2xl border border-white/10 object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div
              className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${colorFromString(
                company.companyName
              )} text-lg font-bold text-white shadow-lg`}
            >
              {initials(company.companyName)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-base font-semibold text-slate-100">
                {company.companyName}
              </h3>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-slate-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-300"
              />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin size={13} />
              <span className="truncate">
                {company.companyLocation}
                {company.companyCity ? `, ${company.companyCity}` : ""}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="chip">
                <Building2 size={12} />
                Company
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
