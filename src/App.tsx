import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import DomainRouter from "./components/DomainRouter";
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
import FinanceDashboard from "./pages/FinanceDashboard";
import FinanceTransactions from "./pages/FinanceTransactions";
import FinanceDRE from "./pages/FinanceDRE";
import FinanceSales from "./pages/FinanceSales";
import FinanceSponsors from "./pages/FinanceSponsors";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<DomainRouter />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            <Route path="/admin/campaigns" element={<AdminCampaigns />} />
            <Route path="/admin/campaigns/new" element={<AdminCampaignNew />} />
            <Route path="/admin/campaigns/:id" element={<AdminCampaignView />} />
            <Route path="/admin/waiting-list" element={<AdminWaitingList />} />
            <Route path="/admin/financeiro" element={<FinanceDashboard />} />
            <Route path="/admin/financeiro/receitas" element={<FinanceTransactions type="receita" />} />
            <Route path="/admin/financeiro/despesas" element={<FinanceTransactions type="despesa" />} />
            <Route path="/admin/financeiro/dre" element={<FinanceDRE />} />
            <Route path="/admin/financeiro/vendas" element={<FinanceSales />} />
            <Route path="/admin/financeiro/patrocinadores" element={<FinanceSponsors />} />
            <Route path="/caderno" element={<WorkbookLogin />} />
            <Route path="/caderno/login" element={<WorkbookLogin />} />
            <Route path="/caderno/dashboard" element={<WorkbookDashboard />} />
            <Route path="/caderno/modulo/:moduleId" element={<WorkbookModule />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
