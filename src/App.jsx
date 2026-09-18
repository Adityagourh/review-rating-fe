import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import AddCompany from "./pages/AddCompany";
import NotFound from "./pages/NotFound";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-ink-900">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#12121c",
            color: "#f1f5f9",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route
              path="/user/reset-password/:id/:token"
              element={<PageTransition><ResetPassword /></PageTransition>}
            />
            <Route path="/companies" element={<PageTransition><Companies /></PageTransition>} />
            <Route
              path="/companies/add"
              element={
                <ProtectedRoute requireAdmin>
                  <PageTransition><AddCompany /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route path="/companies/:id" element={<PageTransition><CompanyDetails /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
