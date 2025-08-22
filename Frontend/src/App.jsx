import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import OnboardingLayout from './layouts/OnboardingLayout';
import BasicInfoStep from './pages/onboarding/BasicInfoStep';
import LocationStep from './pages/onboarding/LocationStep';
import SpecialtiesStep from './pages/onboarding/SpecialtiesStep';
import ExperienceStep from './pages/onboarding/ExperienceStep';
import PortfolioStep from './pages/onboarding/PortfolioStep';
import ServiceDetailsStep from './pages/onboarding/ServiceDetailsStep';
import IdentityStep from './pages/onboarding/IdentityStep';
import PayoutStep from './pages/onboarding/PayoutStep';
import ReviewStep from './pages/onboarding/ReviewStep';
import TermsAndConditions from './pages/TermsAndConditions';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Redirect root to first onboarding step */}
            <Route path="/" element={<Navigate to="/onboarding/basic-info" replace />} />
            
            {/* Terms and Conditions - standalone page */}
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            
            {/* Onboarding flow */}
            <Route path="/onboarding" element={<OnboardingLayout />}>
              <Route path="basic-info" element={<BasicInfoStep />} />
              <Route path="location" element={<LocationStep />} />
              <Route path="specialties" element={<SpecialtiesStep />} />
              <Route path="experience" element={<ExperienceStep />} />
              <Route path="portfolio" element={<PortfolioStep />} />
              <Route path="service-details" element={<ServiceDetailsStep />} />
              <Route path="identity" element={<IdentityStep />} />
              <Route path="payouts" element={<PayoutStep />} />
              <Route path="review" element={<ReviewStep />} />
              {/* Redirect any invalid onboarding route to first step */}
              <Route path="*" element={<Navigate to="/onboarding/basic-info" replace />} />
            </Route>
            
            {/* Catch all - redirect to onboarding */}
            <Route path="*" element={<Navigate to="/onboarding/basic-info" replace />} />
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
