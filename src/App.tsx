import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import DashboardPage from "./pages/superadmin/DashboardPage";
import TenantsListPage from "./pages/superadmin/TenantsListPage";
import TenantFormPage from "./pages/superadmin/TenantFormPage";
import ProposalsListPage from "./pages/superadmin/ProposalsListPage";
import ProposalFormPage from "./pages/superadmin/ProposalFormPage";
import PublicProposalPage from "./pages/PublicProposalPage";
import PlansPage from "./pages/PlansPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center glass-card p-12 rounded-2xl">
      <h1 className="text-2xl font-black uppercase tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2">Em desenvolvimento — Fase 2</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/planos" element={<PlansPage />} />
            <Route path="/proposta/:id" element={<PublicProposalPage />} />

            <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminLayout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="tenants" element={<TenantsListPage />} />
              <Route path="tenants/:id" element={<TenantFormPage />} />
              <Route path="propostas" element={<ProposalsListPage />} />
              <Route path="propostas/:id" element={<ProposalFormPage />} />
              <Route path="assinaturas" element={<PlaceholderPage title="Assinaturas Global" />} />
              <Route path="relatorios" element={<PlaceholderPage title="Relatórios" />} />
              <Route path="configuracoes" element={<PlaceholderPage title="Configurações" />} />
            </Route>

            <Route path="/admin" element={<ProtectedRoute allowedRoles={['tenant_admin', 'superadmin']}><PlaceholderPage title="Tenant Admin Dashboard" /></ProtectedRoute>} />
            <Route path="/minha-conta" element={<ProtectedRoute allowedRoles={['subscriber']}><PlaceholderPage title="Minha Conta" /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
