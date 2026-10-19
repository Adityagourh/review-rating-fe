import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Building2, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getCompanyList } from "../api/company";
import { getReviewList } from "../api/review";
import { statsByCompany } from "../utils/helpers";
import CompanyCard from "../components/CompanyCard";
import { CompanyCardSkeleton } from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Companies() {
  const [params, setParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = params.get("q") || "";
  const { isAdmin } = useAuth();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getReviewList()
      .then(({ data }) => active && setStats(statsByCompany(data?.comment || [])))
      .catch(() => {});
    getCompanyList()
      .then(({ data }) => {
        if (active) setCompanies(data?.companys || []);
      })
      .catch(() => active && setError("Couldn't load companies right now."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query) return companies;
    const q = query.toLowerCase();
    return companies.filter(
      (c) =>
        c.companyName?.toLowerCase().includes(q) ||
        c.companyCity?.toLowerCase().includes(q) ||
        c.companyLocation?.toLowerCase().includes(q)
    );
  }, [companies, query]);

  const setQuery = (val) => {
    if (val) setParams({ q: val });
    else setParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore companies</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            {loading ? "Loading…" : `${filtered.length} of ${companies.length} companies`}
          </p>
        </div>
        {isAdmin && (
          <Link to="/admin/companies?new=1" className="btn-primary self-start sm:self-auto">
            <PlusCircle size={16} />
            Add company
          </Link>
        )}
      </div>

      <div className="glass-card mt-8 flex items-center gap-2 p-2">
        <Search size={18} className="ml-3 shrink-0 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, city, or location…"
          className="w-full bg-transparent py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="mr-2 shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-white/5"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => setQuery(query === letter ? "" : letter)}
            className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold transition-colors ${
              query.toUpperCase() === letter
                ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white"
                : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <CompanyCardSkeleton key={i} />)}

        {!loading && filtered.map((c, i) => (
          <CompanyCard company={c} stats={stats[c._id]} index={i} key={c._id} />
        ))}
      </div>

      {!loading && filtered.length === 0 && !error && (
        <EmptyState
          icon={Building2}
          title="No companies found"
          subtitle={
            query
              ? `Nothing matches "${query}". Try a different search.`
              : "No companies have been listed yet."
          }
          action={
            isAdmin && (
              <Link to="/admin/companies?new=1" className="btn-primary !py-2 !px-4 text-sm">
                Add a company
              </Link>
            )
          }
        />
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
