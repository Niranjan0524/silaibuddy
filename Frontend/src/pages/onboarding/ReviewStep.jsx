import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboarding';
import { reviewSchema } from '../../schemas/onboarding';
import { onboardingAPI } from '../../api/onboarding';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { CheckCircle, ExternalLink, Send, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

export default function ReviewStep() {
  const navigate = useNavigate();
  const { formData, updateFormData, draftId, setSubmitting, isSubmitting, resetStore } = useOnboardingStore();
  const [submissionResult, setSubmissionResult] = useState(null);

  const {
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: formData.review,
    mode: 'onChange',
  });

  const acceptTerms = watch('acceptTerms');

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('review', value);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  // Submit onboarding mutation
  const submitMutation = useMutation({
    mutationFn: () => onboardingAPI.submitOnboarding(draftId, formData),
    onMutate: () => setSubmitting(true),
    onSuccess: (response) => {
      setSubmissionResult(response.data);
      setSubmitting(false);
    },
    onError: (error) => {
      console.error('Submission failed:', error);
      setSubmitting(false);
      // Handle error - you might want to show a toast notification
    },
  });

  const handleSubmit = () => {
    if (acceptTerms && isValid) {
      submitMutation.mutate();
    }
  };

  const resetAndStartOver = () => {
    resetStore();
    navigate('/onboarding/basic-info');
  };

  // If submission is successful, show success screen
  if (submissionResult) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Application Submitted Successfully!
                </h2>
                <p className="text-gray-600">
                  {submissionResult.message}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Application ID:</strong> {submissionResult.id}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Please keep this ID for your records. You'll receive email updates about your application status.
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={resetAndStartOver}
                  variant="outline"
                  className="w-full"
                >
                  Submit Another Application
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ReviewSection = ({ title, data, icon: Icon }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <div className="pl-6 space-y-2">
        {Object.entries(data).map(([key, value]) => {
          if (!value || (Array.isArray(value) && value.length === 0)) return null;
          
          return (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
              </span>
              <span className="font-medium text-gray-900">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Review & Submit
          </CardTitle>
          <CardDescription>
            Please review all your information before submitting your tailor onboarding application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Application Summary */}
          <div className="grid gap-6">
            <ReviewSection 
              title="Basic Information" 
              data={formData.basicInfo}
              icon={CheckCircle}
            />
            
            <ReviewSection 
              title="Location" 
              data={formData.location}
              icon={CheckCircle}
            />
            
            <ReviewSection 
              title="Specialties" 
              data={{
                specialties: formData.specialties.specialties,
                customSpecialty: formData.specialties.customSpecialty,
              }}
              icon={CheckCircle}
            />
            
            <ReviewSection 
              title="Experience & Capacity" 
              data={formData.experience}
              icon={CheckCircle}
            />
            
            <ReviewSection 
              title="Portfolio" 
              data={{
                images: `${formData.portfolio.portfolioImages?.length || 0} images uploaded`,
              }}
              icon={CheckCircle}
            />
            
            <ReviewSection 
              title="Service Details" 
              data={{
                priceRange: `₹${formData.serviceDetails.priceMin} - ₹${formData.serviceDetails.priceMax}`,
                turnaroundTime: `${formData.serviceDetails.turnaroundTime} days`,
                homePickup: formData.serviceDetails.homePickup ? 'Yes' : 'No',
                homeDelivery: formData.serviceDetails.homeDelivery ? 'Yes' : 'No',
              }}
              icon={CheckCircle}
            />
            
            <ReviewSection 
              title="Identity Verification" 
              data={{
                idType: formData.identity.idType,
                status: formData.identity.idFront && formData.identity.idBack ? 'Documents uploaded' : 'Pending',
              }}
              icon={CheckCircle}
            />
            
            <ReviewSection 
              title="Payment Method" 
              data={
                formData.payout.paymentMethod === 'bank' 
                  ? {
                      method: 'Bank Account',
                      bank: formData.payout.bankName,
                      account: formData.payout.accountNumber ? `****${formData.payout.accountNumber.slice(-4)}` : '',
                    }
                  : {
                      method: 'UPI',
                      upiId: formData.payout.upiId,
                    }
              }
              icon={CheckCircle}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="border-t pt-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setValue('acceptTerms', checked)}
                />
                <div className="space-y-2">
                  <Label htmlFor="acceptTerms" className="text-sm font-medium cursor-pointer">
                    I accept the Terms & Conditions *
                  </Label>
                  <p className="text-sm text-gray-600">
                    Please read and accept our{' '}
                    <Link 
                      to="/terms-and-conditions" 
                      target="_blank"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Terms & Conditions
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    {' '}before submitting your application.
                  </p>
                </div>
              </div>
              
              {errors.acceptTerms && (
                <div className="flex items-center gap-2 text-red-600 ml-6">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{errors.acceptTerms.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t pt-6">
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleSubmit}
                disabled={!acceptTerms || isSubmitting || !isValid}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
              
              <p className="text-sm text-gray-600 text-center">
                By submitting, you confirm that all information provided is accurate and complete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
