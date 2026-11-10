import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import WorkerOnboarding from "./pages/WorkerOnboarding";
import WorkerDashboard from "./pages/WorkerDashboard";
import CustomerHome from "./pages/CustomerHome";
import WorkerDiscovery from "./pages/WorkerDiscovery";
import JobChat from "./pages/JobChat";
import JobTracking from "./pages/JobTracking";
import ReviewPage from "./pages/ReviewPage";

// Components
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<Layout />}>
          {/* Worker flows */}
          <Route path="/worker/onboarding" element={<WorkerOnboarding />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />

          {/* Customer flows */}
          <Route path="/customer/home" element={<CustomerHome />} />
          <Route path="/customer/find" element={<WorkerDiscovery />} />
          <Route path="/job/:jobId/chat" element={<JobChat />} />
          <Route path="/job/:jobId/track" element={<JobTracking />} />
          <Route path="/job/:jobId/review" element={<ReviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
