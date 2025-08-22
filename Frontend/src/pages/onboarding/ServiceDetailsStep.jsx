import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboarding';
import { serviceDetailsSchema } from '../../schemas/onboarding';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { IndianRupee, Clock, Home, Truck } from 'lucide-react';

export default function ServiceDetailsStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const { saveDraftMutation } = useOutletContext();

  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(serviceDetailsSchema),
    defaultValues: formData.serviceDetails,
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('serviceDetails', value);
      
      // Debounced save to API
      const timeoutId = setTimeout(() => {
        if (isValid) {
          saveDraftMutation.mutate({
            stepKey: 'serviceDetails',
            stepData: value,
          });
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, saveDraftMutation, isValid]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Service Details
          </CardTitle>
          <CardDescription>
            Set your pricing, delivery timeline, and service options. These will be displayed to customers when they view your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pricing Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Minimum Price */}
              <div className="space-y-2">
                <Label htmlFor="priceMin">Minimum Price (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="priceMin"
                    type="number"
                    min="1"
                    placeholder="100"
                    className={`pl-10 ${errors.priceMin ? 'border-red-500' : ''}`}
                    {...register('priceMin', { valueAsNumber: true })}
                  />
                </div>
                {errors.priceMin && (
                  <p className="text-sm text-red-600">{errors.priceMin.message}</p>
                )}
              </div>

              {/* Maximum Price */}
              <div className="space-y-2">
                <Label htmlFor="priceMax">Maximum Price (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="priceMax"
                    type="number"
                    min="1"
                    placeholder="1000"
                    className={`pl-10 ${errors.priceMax ? 'border-red-500' : ''}`}
                    {...register('priceMax', { valueAsNumber: true })}
                  />
                </div>
                {errors.priceMax && (
                  <p className="text-sm text-red-600">{errors.priceMax.message}</p>
                )}
              </div>
            </div>

            {/* Price Range Display */}
            {watchedValues.priceMin && watchedValues.priceMax && watchedValues.priceMin <= watchedValues.priceMax && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  💰 Your price range: <strong>₹{watchedValues.priceMin} - ₹{watchedValues.priceMax}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Turnaround Time */}
          <div className="space-y-2">
            <Label htmlFor="turnaroundTime">Turnaround Time (Days) *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="turnaroundTime"
                type="number"
                min="1"
                max="60"
                placeholder="7"
                className={`pl-10 ${errors.turnaroundTime ? 'border-red-500' : ''}`}
                {...register('turnaroundTime', { valueAsNumber: true })}
              />
            </div>
            {errors.turnaroundTime && (
              <p className="text-sm text-red-600">{errors.turnaroundTime.message}</p>
            )}
            <p className="text-sm text-gray-600">
              Typical time to complete an order from start to finish
            </p>
          </div>

          {/* Service Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Service Options</h3>
            
            {/* Home Pickup */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <Label htmlFor="homePickup" className="text-base font-medium cursor-pointer">
                    Home Pickup
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Offer to pick up garments from customer's location
                  </p>
                </div>
              </div>
              <Switch
                id="homePickup"
                checked={watchedValues.homePickup}
                onCheckedChange={(checked) => setValue('homePickup', checked)}
              />
            </div>

            {/* Home Delivery */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <Label htmlFor="homeDelivery" className="text-base font-medium cursor-pointer">
                    Home Delivery
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Offer to deliver completed garments to customer's location
                  </p>
                </div>
              </div>
              <Switch
                id="homeDelivery"
                checked={watchedValues.homeDelivery}
                onCheckedChange={(checked) => setValue('homeDelivery', checked)}
              />
            </div>
          </div>

          {/* Service Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Service Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Price Range:</span>
                <span className="font-medium">
                  {watchedValues.priceMin && watchedValues.priceMax 
                    ? `₹${watchedValues.priceMin} - ₹${watchedValues.priceMax}`
                    : 'Not set'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Time:</span>
                <span className="font-medium">
                  {watchedValues.turnaroundTime 
                    ? `${watchedValues.turnaroundTime} days`
                    : 'Not set'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Home Pickup:</span>
                <span className={`font-medium ${watchedValues.homePickup ? 'text-green-600' : 'text-gray-500'}`}>
                  {watchedValues.homePickup ? 'Available' : 'Not available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Home Delivery:</span>
                <span className={`font-medium ${watchedValues.homeDelivery ? 'text-green-600' : 'text-gray-500'}`}>
                  {watchedValues.homeDelivery ? 'Available' : 'Not available'}
                </span>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <IndianRupee className="h-5 w-5 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Pricing and service tips
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Research local market rates for similar services</li>
                    <li>Factor in material costs, time, and skill level</li>
                    <li>Offering pickup/delivery can increase your appeal</li>
                    <li>Be realistic with turnaround times to avoid delays</li>
                    <li>You can adjust these settings anytime from your dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>* Required fields</p>
            <p className="mt-1">
              These details will be visible to customers and help them decide whether to place an order with you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
