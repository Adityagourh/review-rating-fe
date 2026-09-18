import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-950/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-500/60 via-accent-500/60 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500">
            <Sparkles size={14} className="text-white" />
          </span>
          <span className="font-semibold text-slate-300">Rately</span>
        </div>
        <p>Built for honest company reviews. Not affiliated with any listed company.</p>
        <p>© {new Date().getFullYear()} Rately</p>
      </div>
    </footer>
  );
}
