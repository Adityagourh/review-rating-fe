// Decorative animated background blobs — purely presentational, aria-hidden.
export default function GradientBlobs({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`decor-blobs pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute left-1/2 top-[-10%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-600/30 blur-[110px] animate-blob" />
      <div className="absolute right-[-10%] top-1/3 h-[26rem] w-[26rem] rounded-full bg-accent-500/20 blur-[100px] animate-blob [animation-delay:4s]" />
      <div className="absolute left-[-10%] bottom-[-10%] h-[24rem] w-[24rem] rounded-full bg-gold-500/10 blur-[100px] animate-blob [animation-delay:8s]" />
      <div className="absolute inset-0 bg-grid-fade opacity-40 [background-size:26px_26px]" />
    </div>
  );
}
