import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Compass } from "lucide-react";
import GradientBlobs from "../components/GradientBlobs";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
      <GradientBlobs />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-md p-10 text-center"
      >
        <p className="gradient-text text-7xl font-extrabold">404</p>
        <h1 className="mt-3 text-xl font-semibold text-slate-100">Page not found</h1>
        <p className="mt-2 text-sm text-slate-400">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/" className="btn-primary !py-2.5 !px-5 text-sm">
            <Home size={15} />
            Go home
          </Link>
          <Link to="/companies" className="btn-ghost !py-2.5 !px-5 text-sm">
            <Compass size={15} />
            Explore
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
