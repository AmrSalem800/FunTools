import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import Index from './pages/Index';
import TimeMachine from './pages/TimeMachine';
import Interview from './pages/Interview';
import Excuses from './pages/Excuses';
import PersonalityAnalyzer from './pages/PersonalityAnalyzer';
import CreativeTools from './pages/CreativeTools';
import AuthCallback from './pages/AuthCallback';
import AuthError from './pages/AuthError';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/time-machine" element={<TimeMachine />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/excuses" element={<Excuses />} />
            <Route path="/personality" element={<PersonalityAnalyzer />} />
            <Route path="/creative-tools" element={<CreativeTools />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/error" element={<AuthError />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;