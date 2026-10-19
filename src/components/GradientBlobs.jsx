// Decorative animated background blobs — purely presentational, aria-hidden.
export default function GradientBlobs({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`decor-blobs pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute left-1/2 top-[-18%] h-[34rem] w-[46rem] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[120px] animate-blob" />
      <div className="absolute right-[-12%] top-1/4 h-[24rem] w-[24rem] rounded-full bg-accent-500/[0.12] blur-[110px] animate-blob [animation-delay:4s]" />
      <div className="absolute left-[-12%] bottom-[-15%] h-[22rem] w-[22rem] rounded-full bg-sky-500/10 blur-[110px] animate-blob [animation-delay:8s]" />
    </div>
  );
}
