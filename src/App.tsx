import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

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

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClaims from "./pages/admin/AdminClaims";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

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
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/policies" element={<UserPolicies />} />
          <Route path="/user/submit-claim" element={<SubmitClaim />} />
          <Route path="/user/claims" element={<UserClaims />} />
          <Route path="/user/claims/:id" element={<ClaimDetails />} />
          <Route path="/user/notifications" element={<UserNotifications />} />
          <Route path="/user/profile" element={<UserProfile />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/claims" element={<AdminClaims />} />
          <Route path="/admin/review" element={<AdminClaims />} />
          <Route path="/admin/policies" element={<AdminClaims />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/contracts" element={<AdminDashboard />} />
          <Route path="/admin/audit" element={<AdminClaims />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
