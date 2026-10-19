import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  ArrowLeft,
  MessageSquarePlus,
  Send,
  MessagesSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { getCompanyDetails } from "../api/company";
import { createReview, deleteReview } from "../api/review";
import { fileUrl } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import EmptyState from "../components/EmptyState";
import { PageLoader } from "../components/Loader";
import GradientBlobs from "../components/GradientBlobs";
import { averageRating, colorFromString, initials } from "../utils/helpers";

export default function CompanyDetails() {
  const { id } = useParams();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({ subject: "", review: "", rating: 0 });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getCompanyDetails(id)
      .then(({ data }) => {
        if (!data?.company) {
          setNotFound(true);
          return;
        }
        setCompany(data.company);
        setReviews(data.review || []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!form.rating) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        subject: form.subject,
        review: form.review,
        rating: String(form.rating),
        userId: user?.id,
        companyId: id,
      };
      const { data } = await createReview(payload);
      toast.success(data.message || "Review posted!");
      setForm({ subject: "", review: "", rating: 0 });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((r) => r.filter((rv) => rv._id !== reviewId));
      toast.success("Review deleted");
    } catch {
      toast.error("Couldn't delete review.");
    }
  };

  if (loading) return <PageLoader />;

  if (notFound || !company) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <EmptyState
          title="Company not found"
          subtitle="It may have been removed, or the link is incorrect."
          action={
            <button onClick={() => navigate("/companies")} className="btn-primary !py-2 !px-4 text-sm">
              Back to companies
            </button>
          }
        />
      </div>
    );
  }

  const pic = fileUrl(company.profilePic);
  const avg = averageRating(reviews);

  return (
    <div className="relative">
      <section className="relative overflow-hidden px-6 pb-14 pt-10">
        <GradientBlobs />
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex flex-col gap-6 p-7 sm:flex-row sm:items-center"
          >
            {pic ? (
              <img
                src={pic}
                alt={company.companyName}
                className="h-24 w-24 shrink-0 rounded-2xl border border-white/10 object-cover shadow-lg"
              />
            ) : (
              <div
                className={`grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${colorFromString(
                  company.companyName
                )} text-2xl font-bold text-white shadow-lg`}
              >
                {initials(company.companyName)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
                {company.companyName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {company.companyLocation}
                  {company.companyCity ? `, ${company.companyCity}` : ""}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  {avg > 0 ? avg.toFixed(1) : "—"}
                </p>
                <StarRating value={avg} readOnly size={14} />
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-sm text-slate-400">
                <p className="font-semibold text-slate-200">{reviews.length}</p>
                <p>review{reviews.length === 1 ? "" : "s"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
              <MessageSquarePlus size={19} className="text-brand-300" />
              Write a review
            </h2>

            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="glass-card space-y-4 p-6">
                <div>
                  <label className="label-field">Your rating</label>
                  <StarRating
                    value={form.rating}
                    onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                    size={26}
                    showValue
                  />
                </div>
                <div>
                  <label className="label-field">Subject</label>
                  <input
                    required
                    minLength={3}
                    maxLength={30}
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="Great experience overall"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Review</label>
                  <textarea
                    required
                    minLength={3}
                    maxLength={30}
                    rows={4}
                    value={form.review}
                    onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                    placeholder="Share the details of your experience…"
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? "Posting…" : (
                    <>
                      <Send size={15} />
                      Post review
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-sm text-slate-400">
                  <Link to="/login" className="font-medium text-brand-300 hover:text-brand-200">
                    Log in
                  </Link>{" "}
                  to share your experience with this company.
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
              <MessagesSquare size={19} className="text-brand-300" />
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </h2>

            <div className="space-y-4">
              <AnimatePresence>
                {reviews.map((r) => {
                  const reviewerId =
                    typeof r.userId === "object" ? r.userId?._id : r.userId;
                  const canManage = isAdmin || (isAuthenticated && reviewerId === user?.id);
                  return (
                    <ReviewCard
                      key={r._id}
                      review={r}
                      canManage={canManage}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </AnimatePresence>

              {reviews.length === 0 && (
                <EmptyState
                  icon={MessagesSquare}
                  title="No reviews yet"
                  subtitle="Be the first to share your experience."
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
