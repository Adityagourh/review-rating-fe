import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getCompanyList } from "../../api/company";
import { getReviewList } from "../../api/review";
import { getUserList } from "../../api/auth";

// Loads everything the admin console needs and indexes it by id, since
// GET /comment/list returns bare userId/companyId refs.
export default function useAdminData() {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [c, r, u] = await Promise.allSettled([getCompanyList(), getReviewList(), getUserList()]);
    if (c.status === "fulfilled") setCompanies(c.value.data?.companys || []);
    if (r.status === "fulfilled") setReviews(r.value.data?.comment || []);
    if (u.status === "fulfilled") setUsers(u.value.data?.users || []);
    if ([c, r, u].some((x) => x.status === "rejected")) toast.error("Some data couldn't be loaded.", { id: "admin-load" });
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const companyById = useMemo(() => Object.fromEntries(companies.map((c) => [c._id, c])), [companies]);
  const userById = useMemo(() => Object.fromEntries(users.map((u) => [u._id, u])), [users]);

  return { companies, setCompanies, users, setUsers, reviews, setReviews, companyById, userById, loading, reload };
}
