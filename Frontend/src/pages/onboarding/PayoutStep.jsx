import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboarding';
import { payoutSchema } from '../../schemas/onboarding';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { CreditCard, Smartphone, Building2, IndianRupee } from 'lucide-react';

export default function PayoutStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const { saveDraftMutation } = useOutletContext();

  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(payoutSchema),
    defaultValues: formData.payout,
    mode: 'onChange',
  });

  const watchedValues = watch();
  const paymentMethod = watchedValues.paymentMethod || 'bank';

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('payout', value);
      
      // Debounced save to API
      const timeoutId = setTimeout(() => {
        if (isValid) {
          saveDraftMutation.mutate({
            stepKey: 'payout',
            stepData: value,
          });
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, saveDraftMutation, isValid]);

  const handleTabChange = (value) => {
    setValue('paymentMethod', value);
    // Clear fields from the other method when switching
    if (value === 'bank') {
      setValue('upiId', '');
    } else {
      setValue('accountHolderName', '');
      setValue('bankName', '');
      setValue('accountNumber', '');
      setValue('ifscCode', '');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Payment & Payout Details
          </CardTitle>
          <CardDescription>
            Set up how you'd like to receive payments for your services. Choose between bank transfer or UPI for quick and secure payouts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={paymentMethod} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Bank Account
              </TabsTrigger>
              <TabsTrigger value="upi" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                UPI
              </TabsTrigger>
            </TabsList>

            {/* Bank Account Tab */}
            <TabsContent value="bank" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Bank Account Details</h3>
                </div>

                {/* Account Holder Name */}
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                  <Input
                    id="accountHolderName"
                    placeholder="Enter account holder name"
                    className={errors.accountHolderName ? 'border-red-500' : ''}
                    {...register('accountHolderName')}
                  />
                  {errors.accountHolderName && (
                    <p className="text-sm text-red-600">{errors.accountHolderName.message}</p>
                  )}
                </div>

                {/* Bank Name */}
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    placeholder="Enter bank name"
                    className={errors.bankName ? 'border-red-500' : ''}
                    {...register('bankName')}
                  />
                  {errors.bankName && (
                    <p className="text-sm text-red-600">{errors.bankName.message}</p>
                  )}
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter account number"
                    className={errors.accountNumber ? 'border-red-500' : ''}
                    {...register('accountNumber')}
                  />
                  {errors.accountNumber && (
                    <p className="text-sm text-red-600">{errors.accountNumber.message}</p>
                  )}
                </div>

                {/* IFSC Code */}
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code *</Label>
                  <Input
                    id="ifscCode"
                    placeholder="Enter IFSC code (e.g., SBIN0001234)"
                    className={errors.ifscCode ? 'border-red-500' : ''}
                    {...register('ifscCode')}
                  />
                  {errors.ifscCode && (
                    <p className="text-sm text-red-600">{errors.ifscCode.message}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    11-character alphanumeric code (you can find this on your cheque book or net banking)
                  </p>
                </div>
              </div>

              {/* Bank Account Summary */}
              {watchedValues.accountHolderName && watchedValues.bankName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Account Summary</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p><strong>Holder:</strong> {watchedValues.accountHolderName}</p>
                    <p><strong>Bank:</strong> {watchedValues.bankName}</p>
                    {watchedValues.accountNumber && (
                      <p><strong>Account:</strong> ****{watchedValues.accountNumber.slice(-4)}</p>
                    )}
                    {watchedValues.ifscCode && (
                      <p><strong>IFSC:</strong> {watchedValues.ifscCode}</p>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* UPI Tab */}
            <TabsContent value="upi" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">UPI Details</h3>
                </div>

                {/* UPI ID */}
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID *</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@paytm / yourname@googlepay"
                    className={errors.upiId ? 'border-red-500' : ''}
                    {...register('upiId')}
                  />
                  {errors.upiId && (
                    <p className="text-sm text-red-600">{errors.upiId.message}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    Your Virtual Payment Address (VPA) - usually in format: name@provider
                  </p>
                </div>

                {/* UPI Providers Examples */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Common UPI Providers</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>• Google Pay: @okaxis, @okhdfcbank</div>
                    <div>• PhonePe: @ybl</div>
                    <div>• Paytm: @paytm</div>
                    <div>• BHIM: @upi</div>
                  </div>
                </div>

                {/* UPI Summary */}
                {watchedValues.upiId && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">UPI Summary</h4>
                    <p className="text-sm text-green-700">
                      <strong>UPI ID:</strong> {watchedValues.upiId}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Error Messages */}
          {errors.root && (
            <p className="text-sm text-red-600">{errors.root.message}</p>
          )}

          {/* Security Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Payment Security
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>All payment information is encrypted and secure</li>
                    <li>Payouts are processed within 1-2 business days</li>
                    <li>You can change payment method anytime from your dashboard</li>
                    <li>We never store sensitive banking credentials</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>* Required fields</p>
            <p className="mt-1">
              Choose the payment method that's most convenient for you. Both options are secure and reliable.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
