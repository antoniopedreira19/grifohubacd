import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// Lazy-loaded pages
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Leads = lazy(() => import("@/pages/Leads"));
const Pipeline = lazy(() => import("@/pages/Pipeline"));
const Produtos = lazy(() => import("@/pages/Produtos"));
const Marketing = lazy(() => import("@/pages/Marketing"));
const Templates = lazy(() => import("@/pages/Templates"));
const Configuracoes = lazy(() => import("@/pages/Configuracoes"));
const Agenda = lazy(() => import("@/pages/Agenda"));
const CRM = lazy(() => import("@/pages/CRM"));
const Automacoes = lazy(() => import("@/pages/Automacoes"));
const Eventos = lazy(() => import("@/pages/Eventos"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const PublicPageRenderer = lazy(() => import("@/pages/PublicPageRenderer"));
const NpsPageRenderer = lazy(() => import("@/pages/NpsPageRenderer"));
const ThankYouPage = lazy(() => import("@/pages/ThankYouPage"));
const Mentoria360 = lazy(() => import("@/pages/Mentoria360"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public page routes */}
            <Route path="/p/:slug" element={<PublicPageRenderer />} />
            <Route path="/nps/:slug" element={<NpsPageRenderer />} />
            <Route path="/obrigado/:slug" element={<ThankYouPage />} />
            <Route path="/mentoria-360" element={<Mentoria360 />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes with layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/crm" element={<CRM />} />
                <Route path="/automacoes" element={<Automacoes />} />
                <Route path="/eventos" element={<Eventos />} />
              </Route>
            </Route>
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
