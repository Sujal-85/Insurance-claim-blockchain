import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Landing & Auth
import Landing from "./pages/Landing";
import SelectRole from "./pages/SelectRole";
import UserLogin from "./pages/auth/UserLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import UserSignup from "./pages/auth/UserSignup";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import UserPolicies from "./pages/user/UserPolicies";
import SubmitClaim from "./pages/user/SubmitClaim";
import UserClaims from "./pages/user/UserClaims";
import ClaimDetails from "./pages/user/ClaimDetails";
import UserNotifications from "./pages/user/UserNotifications";
import UserProfile from "./pages/user/UserProfile";
import HealthSafety from "./pages/HealthSafety";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClaims from "./pages/admin/AdminClaims";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminReviewClaims from "./pages/admin/AdminReviewClaims";
import AdminContracts from "./pages/admin/AdminContracts";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing & Auth */}
          <Route path="/" element={<Landing />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/signup/user" element={<UserSignup />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/policies" element={<ProtectedRoute role="user"><UserPolicies /></ProtectedRoute>} />
          <Route path="/user/submit-claim" element={<ProtectedRoute role="user"><SubmitClaim /></ProtectedRoute>} />
          <Route path="/user/claims" element={<ProtectedRoute role="user"><UserClaims /></ProtectedRoute>} />
          <Route path="/user/claims/:id" element={<ProtectedRoute role="user"><ClaimDetails /></ProtectedRoute>} />
          <Route path="/user/notifications" element={<ProtectedRoute role="user"><UserNotifications /></ProtectedRoute>} />
          <Route path="/user/profile" element={<ProtectedRoute role="user"><UserProfile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/claims" element={<ProtectedRoute role="admin"><AdminClaims /></ProtectedRoute>} />
          <Route path="/admin/review" element={<ProtectedRoute role="admin"><AdminReviewClaims /></ProtectedRoute>} />
          <Route path="/admin/policies" element={<ProtectedRoute role="admin"><AdminPolicies /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/contracts" element={<ProtectedRoute role="admin"><AdminContracts /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute role="admin"><AdminAuditLogs /></ProtectedRoute>} />
          
          {/* Information Pages */}
          <Route path="/health-safety" element={<HealthSafety />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
