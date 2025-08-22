import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboarding';
import { basicInfoSchema } from '../../schemas/onboarding';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Phone, Mail, User, Store } from 'lucide-react';

export default function BasicInfoStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const { saveDraftMutation } = useOutletContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: formData.basicInfo,
    mode: 'onChange',
  });

  const whatsappSameAsPhone = watch('whatsappSameAsPhone');
  const phoneNumber = watch('phone');

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('basicInfo', value);
      
      // Debounced save to API
      const timeoutId = setTimeout(() => {
        if (isValid) {
          saveDraftMutation.mutate({
            stepKey: 'basicInfo',
            stepData: value,
          });
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, saveDraftMutation, isValid]);

  // Auto-fill WhatsApp number when same as phone
  useEffect(() => {
    if (whatsappSameAsPhone) {
      setValue('whatsappNumber', phoneNumber);
    } else {
      setValue('whatsappNumber', '');
    }
  }, [whatsappSameAsPhone, phoneNumber, setValue]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Let's start with your basic details. This information will be used to create your tailor profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...register('fullName')}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            {/* Shop Name */}
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop/Business Name *</Label>
              <div className="relative">
                <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="shopName"
                  placeholder="Enter your shop name"
                  className={`pl-10 ${errors.shopName ? 'border-red-500' : ''}`}
                  {...register('shopName')}
                />
              </div>
              {errors.shopName && (
                <p className="text-sm text-red-600">{errors.shopName.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* WhatsApp Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsappSameAsPhone"
                checked={whatsappSameAsPhone}
                onCheckedChange={(checked) => setValue('whatsappSameAsPhone', checked)}
              />
              <Label
                htmlFor="whatsappSameAsPhone"
                className="text-sm font-normal cursor-pointer"
              >
                My WhatsApp number is the same as my phone number
              </Label>
            </div>

            {!whatsappSameAsPhone && (
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className={`pl-10 ${errors.whatsappNumber ? 'border-red-500' : ''}`}
                    {...register('whatsappNumber')}
                  />
                </div>
                {errors.whatsappNumber && (
                  <p className="text-sm text-red-600">{errors.whatsappNumber.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p>* Required fields</p>
            <p className="mt-1">
              Your contact information will be used to communicate with customers and for account verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
