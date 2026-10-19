export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";
}

export function averageRating(reviews = []) {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  return total / reviews.length;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

// Deterministic pastel-ish accent picked from a name, for avatar/logo placeholders
export function colorFromString(str = "") {
  const palette = [
    "from-brand-500 to-accent-500",
    "from-emerald-500 to-teal-400",
    "from-orange-500 to-amber-400",
    "from-sky-500 to-cyan-400",
    "from-fuchsia-500 to-pink-400",
    "from-indigo-500 to-violet-400",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

// { [companyId]: { avg, count } } from a flat review list (GET /comment/list)
export function statsByCompany(reviews = []) {
  const stats = {};
  for (const r of reviews) {
    const id = typeof r.companyId === "object" ? r.companyId?._id : r.companyId;
    const s = (stats[id] ||= { total: 0, count: 0, avg: 0 });
    s.total += Number(r.rating) || 0;
    s.count += 1;
    s.avg = s.total / s.count;
  }
  return stats;
}

export function timeAgo(dateString) {
  if (!dateString) return "";
  const s = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const units = [
    [31536000, "y"],
    [2592000, "mo"],
    [604800, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of units) if (s >= secs) return `${Math.floor(s / secs)}${label} ago`;
  return "just now";
}
