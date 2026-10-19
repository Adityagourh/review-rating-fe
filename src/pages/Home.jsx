import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  MessageSquareText,
  TrendingUp,
  ArrowRight,
  Star,
  Building2,
  BadgeCheck,
} from "lucide-react";
import GradientBlobs from "../components/GradientBlobs";
import CompanyCard from "../components/CompanyCard";
import { CompanyCardSkeleton } from "../components/Loader";
import { getCompanyList } from "../api/company";
import { getReviewList } from "../api/review";
import { useAuth } from "../context/AuthContext";
import { statsByCompany } from "../utils/helpers";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified voices",
    desc: "Reviews come from real, signed-in members — not anonymous drive-bys.",
  },
  {
    icon: MessageSquareText,
    title: "Honest reviews",
    desc: "Ratings and detailed write-ups, side by side, on every company profile.",
  },
  {
    icon: TrendingUp,
    title: "Discover fast",
    desc: "Jump straight to a company by name or browse what's trending.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getReviewList()
      .then(({ data }) => active && setStats(statsByCompany(data?.comment || [])))
      .catch(() => {});
    getCompanyList()
      .then(({ data }) => {
        if (active) setCompanies(data?.companys || []);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/companies?q=${encodeURIComponent(q)}` : "/companies");
  };

  return (
    <div className="relative">
      <section className="relative isolate px-6 pb-24 pt-20 sm:pt-28">
        <GradientBlobs />
        <div className="absolute inset-0 -z-10 bg-hero-glow" />

        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: -10, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="chip absolute left-[6%] top-[18%] hidden animate-float border-emerald-400/30 bg-emerald-500/10 text-emerald-200 shadow-glow lg:flex"
        >
          <BadgeCheck size={13} />
          Verified reviewer
        </motion.div>
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 10, rotate: 6 }}
          animate={{ opacity: 1, y: 0, rotate: 6 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="chip absolute right-[8%] top-[30%] hidden animate-float border-gold-400/30 bg-gold-500/10 text-gold-200 shadow-glow [animation-delay:2s] lg:flex"
        >
          <Star size={13} className="fill-gold-400 text-gold-400" />
          5-star honesty
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={item}
            className="chip mx-auto w-fit border-brand-400/30 bg-brand-500/10 text-brand-200"
          >
            <Star size={12} className="fill-brand-300 text-brand-300" />
            Real reviews. Real companies.
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl"
          >
            Know a company{" "}
            <span className="gradient-text">before you commit.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-xl text-base text-slate-400 sm:text-lg"
          >
            Rately is where people rate and review the companies they've worked
            with — browse honest feedback, or add your own in minutes.
          </motion.p>

          <motion.form
            variants={item}
            onSubmit={handleSearch}
            className="mx-auto mt-9 flex max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-glow backdrop-blur-xl"
          >
            <Search size={18} className="ml-3 shrink-0 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies by name…"
              className="w-full bg-transparent py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <button type="submit" className="btn-primary shrink-0 !py-2.5 !px-5 text-sm">
              Search
            </button>
          </motion.form>

          <motion.div variants={item} className="mt-6 flex items-center justify-center gap-3">
            <Link to="/companies" className="btn-ghost text-sm">
              Browse all companies
              <ArrowRight size={15} />
            </Link>
            <Link to="/register" className="text-sm font-medium text-slate-400 hover:text-slate-200">
              Join the community →
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400"
          >
            <span className="inline-flex items-center gap-1.5">
              <Building2 size={15} className="text-brand-300" />
              <strong className="text-slate-200">
                {loading ? "…" : companies.length}
              </strong>
              companies listed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-300" />
              100% real reviews
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star size={15} className="text-gold-400" />
              <strong className="text-slate-200">
                {Object.values(stats).reduce((n, s) => n + s.count, 0)}
              </strong>
              reviews shared
            </span>
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured companies</h2>
            <p className="mt-1 text-sm text-slate-400">
              Freshly added profiles from the community.
            </p>
          </div>
          <Link
            to="/companies"
            className="hidden text-sm font-medium text-brand-300 hover:text-brand-200 sm:flex sm:items-center sm:gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => <CompanyCardSkeleton key={i} />)}

          {!loading && companies.length === 0 && (
            <div className="glass-card col-span-full flex flex-col items-center gap-3 p-10 text-center">
              <Building2 className="text-slate-500" size={28} />
              <p className="text-sm text-slate-400">No companies listed yet.</p>
              {isAdmin && (
                <Link to="/admin/companies?new=1" className="btn-primary !py-2 !px-4 text-sm">
                  Add a company
                </Link>
              )}
            </div>
          )}

          {!loading &&
            companies
              .slice(0, 6)
              .map((c, i) => (
                <CompanyCard company={c} stats={stats[c._id]} index={i} key={c._id} />
              ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-6"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-brand-300">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-100">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card relative overflow-hidden p-10 text-center sm:p-14"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-600/20 via-transparent to-accent-500/10" />
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to share your experience?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
            Create a free account and start rating companies in under a minute.
          </p>
          <Link to="/register" className="btn-primary mt-7 inline-flex !px-7">
            Create your account
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
