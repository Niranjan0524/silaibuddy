import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useOnboardingStore } from '../store/onboarding';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { onboardingAPI } from '../api/onboarding';
import { useEffect } from 'react';

const stepRoutes = [
  '/onboarding/basic-info',
  '/onboarding/location',
  '/onboarding/specialties',
  '/onboarding/experience',
  '/onboarding/portfolio',
  '/onboarding/service-details',
  '/onboarding/identity',
  '/onboarding/payouts',
  '/onboarding/review',
];

const stepNames = [
  'Basic Info',
  'Location',
  'Specialties',
  'Experience',
  'Portfolio',
  'Service Details',
  'Identity',
  'Payouts',
  'Review',
];

export default function OnboardingLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentStep, 
    setCurrentStep, 
    nextStep, 
    prevStep, 
    getProgress,
    formData,
    draftId,
    setDraftId,
    isSaving,
    setSaving
  } = useOnboardingStore();

  // Create draft mutation
  const createDraftMutation = useMutation({
    mutationFn: () => onboardingAPI.createDraft(formData),
    onSuccess: (response) => {
      setDraftId(response.data.id);
    },
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: ({ stepKey, stepData }) => {
      if (!draftId) {
        return createDraftMutation.mutateAsync().then((response) => {
          return onboardingAPI.saveDraft(response.data.id, stepKey, stepData);
        });
      }
      return onboardingAPI.saveDraft(draftId, stepKey, stepData);
    },
    onMutate: () => setSaving(true),
    onSettled: () => setSaving(false),
  });

  // Update current step based on route
  useEffect(() => {
    const stepIndex = stepRoutes.findIndex(route => route === location.pathname);
    if (stepIndex !== -1 && stepIndex + 1 !== currentStep) {
      setCurrentStep(stepIndex + 1);
    }
  }, [location.pathname, currentStep, setCurrentStep]);

  const handleNext = () => {
    if (currentStep < 9) {
      nextStep();
      navigate(stepRoutes[currentStep]); // currentStep will be updated after nextStep()
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      prevStep();
      navigate(stepRoutes[currentStep - 2]); // currentStep will be updated after prevStep()
    }
  };

  const handleSave = () => {
    // This will be called by individual step components
    // We'll pass this down through context or props
  };

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Silaibuddy</h1>
              <p className="text-sm text-gray-600 mt-1">Tailor Onboarding</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Step {currentStep} of 9
              </p>
              <p className="text-xs text-gray-600">
                {stepNames[currentStep - 1]}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Start</span>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
          <Outlet context={{ saveDraftMutation }} />
        </div>
      </main>

      {/* Footer with Navigation */}
      <footer className="bg-white border-t fixed bottom-0 left-0 right-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {isSaving && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Save className="h-4 w-4 animate-pulse" />
                  Saving...
                </div>
              )}
              
              {currentStep < 9 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Save & Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    // This will be handled by the Review component
                    navigate('/onboarding/review');
                  }}
                  className="flex items-center gap-2"
                >
                  Submit Application
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom padding to account for fixed footer */}
      <div className="h-20"></div>
    </div>
  );
}
