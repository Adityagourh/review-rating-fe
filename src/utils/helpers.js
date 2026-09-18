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
