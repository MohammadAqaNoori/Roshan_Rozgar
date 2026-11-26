import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer, AppHeader, BottomNav } from './components/Shared';
import AdminDash   from './admin/AdminDash';
import AdminLogin  from './admin/AdminLogin';
import { ADMIN_PHONE } from './admin/AdminContext';

// Pages
import Home from './pages/Home';
import Role from './pages/Role';
import Login from './pages/Login';
import CustomerReg from './pages/CustomerReg';
import Onboard from './pages/Onboard';
import Discover from './pages/Discover';
import Results from './pages/Results';
import Profile from './pages/Profile';
import CustomerProfile from './pages/CustomerProfile';
import Request from './pages/Request';
import Chat from './pages/Chat';
import Confirm from './pages/Confirm';
import Track from './pages/Track';
import Review from './pages/Review';
import WorkerDash from './pages/WorkerDash';
import WorkerJobs from './pages/WorkerJobs';
import Modal from './pages/Modal';

const BARE_VIEWS = ['home', 'role', 'login', 'customerReg', 'onboard'];
const WORKER_V = ['wdash', 'wjob', 'wprofile'];

function AppInner() {
  const [view, setView] = useState('home');
  const { role, ob } = useApp();

  // Admin portal state — separate from main app
  const [adminStep, setAdminStep] = useState(null); // null | 'pin' | 'portal'

  // Called from Login when admin phone is detected
  const handleAdminPhoneDetected = () => setAdminStep('pin');
  const handleAdminPinSuccess    = () => setAdminStep('portal');
  const handleAdminLogout        = () => { setAdminStep(null); setView('home'); };

  // Admin login screen (PIN)
  if (adminStep === 'pin') {
    return <AdminLogin onSuccess={handleAdminPinSuccess} onBack={() => setAdminStep(null)} />;
  }

  // Admin portal (full dashboard)
  if (adminStep === 'portal') {
    return <AdminDash onLogout={handleAdminLogout} />;
  }

  const navigate = (v, opts = {}) => {
    // 'wdash-returning' means a worker who already finished onboarding — skip it
    if (v === 'wdash-returning') {
      setView('wdash');
      window.scrollTo(0, 0);
      return;
    }
    // Worker going to dashboard without completing onboarding → send to onboard
    // opts.fresh=true bypasses this guard (used after startWorkerSignup resets ob)
    if (v === 'wdash' && role === 'worker' && !ob.done && !opts.fresh) {
      setView('onboard');
      window.scrollTo(0, 0);
      return;
    }
    setView(v);
    window.scrollTo(0, 0);
  };

  const isBare = BARE_VIEWS.includes(view);

  const renderPage = () => {
    switch (view) {
      case 'home':       return <Home onNavigate={navigate} />;
      case 'role':       return <Role onNavigate={navigate} />;
      case 'login':      return <Login onNavigate={navigate} onAdminDetected={handleAdminPhoneDetected} />;
      case 'customerReg': return <CustomerReg onNavigate={navigate} />;
      case 'onboard':    return <Onboard onNavigate={navigate} />;
      case 'discover':   return <Discover onNavigate={navigate} />;
      case 'results':    return <Results onNavigate={navigate} />;
      // 'profile' = view a worker's profile (from search results)
      // 'cprofile' = customer's own account page
      // 'wprofile' = worker's own profile page
      case 'profile':    return <Profile own={false} onNavigate={navigate} />;
      case 'cprofile':   return <CustomerProfile onNavigate={navigate} />;
      case 'wprofile':   return <Profile own={true} onNavigate={navigate} />;
      case 'request':    return <Request onNavigate={navigate} />;
      case 'chat':       return <Chat onNavigate={navigate} />;
      case 'confirm':
      case 'booked':     return <Confirm onNavigate={navigate} />;
      case 'track':      return <Track onNavigate={navigate} />;
      case 'review':     return <Review onNavigate={navigate} />;
      case 'wdash':      return <WorkerDash onNavigate={navigate} />;
      case 'wjob':       return <WorkerJobs onNavigate={navigate} />;
      default:           return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div>
      {!isBare && <AppHeader activeView={view} onNavigate={navigate} />}
      {renderPage()}
      {!isBare && <BottomNav activeView={view} onNavigate={navigate} />}
      <Modal onNavigate={navigate} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
