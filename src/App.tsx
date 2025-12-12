import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContacts from "./pages/AdminContacts";
import AdminCampaigns from "./pages/AdminCampaigns";
import AdminCampaignNew from "./pages/AdminCampaignNew";
import AdminCampaignView from "./pages/AdminCampaignView";
import AdminWaitingList from "./pages/AdminWaitingList";
import WorkbookLogin from "./pages/WorkbookLogin";
import WorkbookDashboard from "./pages/WorkbookDashboard";
import WorkbookModule from "./pages/WorkbookModule";

// Component to handle subdomain redirect for atividades.empodhera.com
const SubdomainRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // If accessing atividades.empodhera.com at root, redirect to workbook
    if (hostname === 'atividades.empodhera.com' && location.pathname === '/') {
      navigate('/caderno/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SubdomainRedirect />
          <Routes>
            <Route 
              path="/" 
              element={
                window.location.hostname === 'atividades.empodhera.com' 
                  ? <WorkbookLogin /> 
                  : <Index />
              } 
            />
            <Route path="/caderno/login" element={<WorkbookLogin />} />
            <Route path="/caderno" element={<WorkbookDashboard />} />
            <Route path="/caderno/modulo/:moduleId" element={<WorkbookModule />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            <Route path="/admin/campaigns" element={<AdminCampaigns />} />
            <Route path="/admin/campaigns/new" element={<AdminCampaignNew />} />
            <Route path="/admin/campaigns/:id" element={<AdminCampaignView />} />
            <Route path="/admin/waiting-list" element={<AdminWaitingList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
