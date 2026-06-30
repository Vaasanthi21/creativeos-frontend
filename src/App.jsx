import { Toaster } from "./components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { GenerationJobsProvider } from './contexts/GenerationJobsContext';
import { TaskProvider } from './context/TaskContext';
import MainLayout from './components/layout/MainLayout';
import { BrandSetup } from './pages/BrandSetup';
import { BlogStudio } from './pages/BlogStudio';
import Generate from './pages/Generate';
import History from './pages/History';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Login from './pages/Login';
import RefineContent from './pages/RefineContent';
import Support from './pages/Support';
import LinkedInAds from "./pages/LinkedInAds";
import ImageStudio from './pages/ImageStudio';
import VideoStudio from './pages/VideoStudio';
import PublishingAccounts from './components/publishing/PublishingAccounts';
import WalletPage from "@/pages/wallet";
import ContactPage from "@/pages/contact";
import AdminRoute from "@/components/AdminRoute";
import AdminDashboard from "@/pages/AdminDashboard";
import AmbassadorPortal from "./components/programs/AmbassadorPortal";
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';
import SuperAdminLayout from './components/superadmin/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import SuperAdminCompanies from './pages/superadmin/SuperAdminCompanies';
import SuperAdminUsers from './pages/superadmin/SuperAdminUsers';
import SuperAdminBilling from './pages/superadmin/SuperAdminBilling';
import SuperAdminRequests from './pages/superadmin/SuperAdminRequests';
import SuperAdminSettings from './pages/superadmin/SuperAdminSettings';
import SuperAdminAnalytics from './pages/superadmin/SuperAdminAnalytics';
import SuperAdminUsage from './pages/superadmin/SuperAdminUsage';
import SuperAdminPlans from './pages/superadmin/SuperAdminPlans';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated, authError, navigateToLogin } = useAuth();

  // Loading
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Auth errors
  if (authError) {
    if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  // ❗ NOT AUTHENTICATED → ONLY SHARED LOGIN
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<SuperAdminLayout />}>
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/analytics" element={<SuperAdminAnalytics />} />
          <Route path="/superadmin/companies" element={<SuperAdminCompanies />} />
          <Route path="/superadmin/users" element={<SuperAdminUsers />} />
          <Route path="/superadmin/usage" element={<SuperAdminUsage />} />
          <Route path="/superadmin/plans" element={<SuperAdminPlans />} />
          <Route path="/superadmin/billing" element={<SuperAdminBilling />} />
          <Route path="/superadmin/requests" element={<SuperAdminRequests />} />
          <Route path="/superadmin/settings" element={<SuperAdminSettings />} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // ✅ AUTHENTICATED APP
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Generate />} />
        <Route path="/history" element={<History />} />
        <Route path="/refine" element={<RefineContent />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/linkedinads" element={<LinkedInAds />} />
        <Route path="/image-studio" element={<ImageStudio />} />
        <Route path="/video-studio" element={<VideoStudio />} />
        <Route path="/personas" element={<BrandSetup />} />
        <Route path="/publishing" element={<PublishingAccounts />} />
        <Route path="/ambassador" element={<AmbassadorPortal />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/brand-setup" element={<BrandSetup />} />
        <Route path="/blog-studio" element={<BlogStudio />} />
      </Route>

      <Route path="/register" element={<Register />} />

      <Route path="/superadmin/login" element={<SuperAdminLogin />} />
      <Route element={<SuperAdminLayout />}>
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/analytics" element={<SuperAdminAnalytics />} />
        <Route path="/superadmin/companies" element={<SuperAdminCompanies />} />
        <Route path="/superadmin/users" element={<SuperAdminUsers />} />
        <Route path="/superadmin/usage" element={<SuperAdminUsage />} />
        <Route path="/superadmin/plans" element={<SuperAdminPlans />} />
        <Route path="/superadmin/billing" element={<SuperAdminBilling />} />
        <Route path="/superadmin/requests" element={<SuperAdminRequests />} />
        <Route path="/superadmin/settings" element={<SuperAdminSettings />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

function AppShell() {
  return (
    <>
      <GenerationJobsProvider>
        <TaskProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthenticatedApp />
          </Router>
        </TaskProvider>
      </GenerationJobsProvider>
      <Toaster />
    </>
  );
}

export default App;