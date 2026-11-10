import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer, AppHeader, BottomNav } from './components/Shared';

// Pages
import Home from './pages/Home';
import Role from './pages/Role';
import CustomerReg from './pages/CustomerReg';
import Onboard from './pages/Onboard';
import Discover from './pages/Discover';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Request from './pages/Request';
import Chat from './pages/Chat';
import Confirm from './pages/Confirm';
import Track from './pages/Track';
import Review from './pages/Review';
import WorkerDash from './pages/WorkerDash';
import WorkerJobs from './pages/WorkerJobs';
import Modal from './pages/Modal';

const BARE_VIEWS = ['home', 'role', 'customerReg', 'onboard'];
const WORKER_V = ['wdash', 'wjob', 'wprofile'];

function AppInner() {
  const [view, setView] = useState('home');
  const { role, ob } = useApp();

  const navigate = (v) => {
    // 'wdash-returning' means a worker who already has a profile — skip onboarding
    if (v === 'wdash-returning') {
      setView('wdash');
      window.scrollTo(0, 0);
      return;
    }
    // Worker going to dashboard without completing onboarding → send to onboard
    if (v === 'wdash' && role === 'worker' && !ob.done) {
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
      case 'customerReg': return <CustomerReg onNavigate={navigate} />;
      case 'onboard':    return <Onboard onNavigate={navigate} />;
      case 'discover':   return <Discover onNavigate={navigate} />;
      case 'results':    return <Results onNavigate={navigate} />;
      case 'profile':    return <Profile own={false} onNavigate={navigate} />;
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
