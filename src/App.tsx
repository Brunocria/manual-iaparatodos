
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePageTracking } from "@/hooks/useAnalytics";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PurchaseNotification from "@/components/PurchaseNotification";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Manual = lazy(() => import("./pages/Manual"));
const UpsellPnp = lazy(() => import("./pages/UpsellPnp"));
const Contact = lazy(() => import("./pages/Contact"));
const Obrigado = lazy(() => import("./pages/Obrigado"));
const VitorYuji = lazy(() => import("./pages/VitorYuji"));
const Consultoria = lazy(() => import("./pages/Consultoria"));
const Consultor = lazy(() => import("./pages/Consultor"));
const Go = lazy(() => import("./pages/Go"));
const Curso = lazy(() => import("./pages/Curso"));
const Webinar = lazy(() => import("./pages/Webinar"));
const IAExperts = lazy(() => import("./pages/IAExperts"));
const IAExpertsBeta = lazy(() => import("./pages/IAExpertsBeta"));
const Fmi = lazy(() => import("./pages/Fmi"));
const Cursinho = lazy(() => import("./pages/Cursinho"));
const UpgradePresencial = lazy(() => import("./pages/UpgradePresencial"));
const Vsl = lazy(() => import("./pages/Vsl"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <div className="container mx-auto px-6 py-20">
      <div className="space-y-8">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const AppContent = () => {
  usePageTracking();
  usePerformanceMonitor();
  
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/palestras" element={<VitorYuji />} />
          <Route path="/escolas" element={<VitorYuji />} />
          <Route path="/consultoria" element={<Consultoria />} />
          <Route path="/bio" element={<Consultor />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/upsell-pnp" element={<UpsellPnp />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/obrigado" element={<Obrigado />} />
          <Route path="/go" element={<Go />} />
          <Route path="/curso" element={<Curso />} />
          <Route path="/imersao" element={<Webinar />} />
          <Route path="/iaexperts" element={<IAExperts />} />
          <Route path="/iaexpertsbeta" element={<IAExpertsBeta />} />
          <Route path="/fmi" element={<Fmi />} />
          <Route path="/cursinho" element={<Cursinho />} />
          <Route path="/upgrade-presencial" element={<UpgradePresencial />} />
          <Route path="/vsl" element={<Vsl />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <PurchaseNotification />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
