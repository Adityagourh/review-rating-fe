import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import StarRating from "./StarRating";
import { fileUrl } from "../api/axiosClient";
import { colorFromString, formatDate, initials } from "../utils/helpers";

export default function ReviewCard({ review, onDelete, canManage = false }) {
  const user = review.userId;
  const name = typeof user === "object" ? user?.userName : "Anonymous";
  const pic = typeof user === "object" ? fileUrl(user?.profilePic) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {pic ? (
            <img
              src={pic}
              alt={name}
              className="h-10 w-10 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div
              className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${colorFromString(
                name || "user"
              )} text-xs font-bold text-white`}
            >
              {initials(name || "Anonymous")}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-100">
              {name || "Anonymous"}
            </p>
            <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {canManage && (
          <button
            onClick={() => onDelete?.(review._id)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            title="Delete review"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <StarRating value={Number(review.rating)} readOnly size={16} />
      </div>

      <h4 className="mt-3 text-sm font-semibold text-slate-200">{review.subject}</h4>
      <p className="mt-1 text-sm leading-relaxed text-slate-400">{review.review}</p>
    </motion.div>
  );
}
