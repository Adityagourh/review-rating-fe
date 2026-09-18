import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

/**
 * Star rating — read-only display mode, or interactive picker mode.
 * value: number 0-5 (supports halves in read-only mode)
 */
export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 20,
  showValue = false,
}) {
  const [hovered, setHovered] = useState(0);
  const interactive = !readOnly && typeof onChange === "function";
  const active = interactive ? hovered || value : value;

  return (
    <div className="inline-flex items-center gap-1">
      <div
        className="inline-flex items-center gap-0.5"
        onMouseLeave={() => interactive && setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = active >= star;
          const half = !filled && active >= star - 0.5;
          return (
            <motion.button
              key={star}
              type="button"
              disabled={!interactive}
              whileHover={interactive ? { scale: 1.25, rotate: -6 } : {}}
              whileTap={interactive ? { scale: 0.9 } : {}}
              onMouseEnter={() => interactive && setHovered(star)}
              onClick={() => interactive && onChange(star)}
              className={clsx(
                "relative",
                interactive ? "cursor-pointer" : "cursor-default"
              )}
              aria-label={`${star} star`}
            >
              <Star
                size={size}
                className={clsx(
                  "transition-colors duration-150",
                  filled || half
                    ? "fill-gold-400 text-gold-400 drop-shadow-[0_0_6px_rgba(255,200,87,0.45)]"
                    : "fill-transparent text-slate-600"
                )}
              />
              {half && (
                <Star
                  size={size}
                  className="absolute inset-0 fill-gold-400 text-gold-400"
                  style={{ clipPath: "inset(0 50% 0 0)" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-slate-300">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
}
