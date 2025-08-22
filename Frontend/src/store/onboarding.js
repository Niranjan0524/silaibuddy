import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { defaultValues } from '../schemas/onboarding';

export const useOnboardingStore = create(
  persist(
    (set, get) => ({
      // Current step (1-9)
      currentStep: 1,
      
      // Form data for all steps
      formData: defaultValues,
      
      // Loading states
      isSubmitting: false,
      isSaving: false,
      
      // Draft ID for API persistence
      draftId: null,
      
      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, 9) 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 1) 
      })),
      
      updateFormData: (stepKey, data) => set((state) => ({
        formData: {
          ...state.formData,
          [stepKey]: {
            ...state.formData[stepKey],
            ...data,
          },
        },
      })),
      
      setFormData: (data) => set({ formData: data }),
      
      setDraftId: (id) => set({ draftId: id }),
      
      setSubmitting: (isSubmitting) => set({ isSubmitting }),
      
      setSaving: (isSaving) => set({ isSaving }),
      
      resetStore: () => set({
        currentStep: 1,
        formData: defaultValues,
        isSubmitting: false,
        isSaving: false,
        draftId: null,
      }),
      
      // Get progress percentage
      getProgress: () => {
        const { currentStep } = get();
        return (currentStep / 9) * 100;
      },
      
      // Check if current step is valid
      isStepValid: (stepKey) => {
        const { formData } = get();
        const stepData = formData[stepKey];
        
        // Basic validation - check if required fields have values
        switch (stepKey) {
          case 'basicInfo':
            return stepData.fullName && stepData.shopName && stepData.phone && stepData.email;
          case 'location':
            return stepData.address1 && stepData.city && stepData.pincode;
          case 'specialties':
            return stepData.specialties && stepData.specialties.length > 0;
          case 'experience':
            return stepData.yearsOfExperience >= 0 && stepData.maxOrdersPerWeek > 0 && stepData.maxOrdersPerMonth > 0;
          case 'portfolio':
            return stepData.portfolioImages && stepData.portfolioImages.length >= 3;
          case 'serviceDetails':
            return stepData.priceMin > 0 && stepData.priceMax >= stepData.priceMin && stepData.turnaroundTime > 0;
          case 'identity':
            return stepData.idType && stepData.idFront && stepData.idBack;
          case 'payout':
            if (stepData.paymentMethod === 'bank') {
              return stepData.accountHolderName && stepData.bankName && stepData.accountNumber && stepData.ifscCode;
            } else {
              return stepData.upiId;
            }
          case 'review':
            return stepData.acceptTerms;
          default:
            return false;
        }
      },
    }),
    {
      name: 'silaibuddy-onboarding',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
        draftId: state.draftId,
      }),
    }
  )
);
