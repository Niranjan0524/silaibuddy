import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboarding';
import { locationSchema } from '../../schemas/onboarding';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { MapPin, Building } from 'lucide-react';

export default function LocationStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const { saveDraftMutation } = useOutletContext();

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: formData.location,
    mode: 'onChange',
  });

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('location', value);
      
      // Debounced save to API
      const timeoutId = setTimeout(() => {
        if (isValid) {
          saveDraftMutation.mutate({
            stepKey: 'location',
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
            <MapPin className="h-5 w-5" />
            Location Details
          </CardTitle>
          <CardDescription>
            Provide your shop/workshop location. This helps customers find you and enables location-based services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Address Line 1 */}
          <div className="space-y-2">
            <Label htmlFor="address1">Address Line 1 *</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="address1"
                placeholder="Building name, house number, street name"
                className={`pl-10 ${errors.address1 ? 'border-red-500' : ''}`}
                {...register('address1')}
              />
            </div>
            {errors.address1 && (
              <p className="text-sm text-red-600">{errors.address1.message}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <Label htmlFor="address2">Address Line 2 (Optional)</Label>
            <Input
              id="address2"
              placeholder="Landmark, area, locality"
              className={errors.address2 ? 'border-red-500' : ''}
              {...register('address2')}
            />
            {errors.address2 && (
              <p className="text-sm text-red-600">{errors.address2.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Enter your city"
                className={errors.city ? 'border-red-500' : ''}
                {...register('city')}
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            {/* Pincode */}
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                placeholder="6-digit pincode"
                maxLength="6"
                className={errors.pincode ? 'border-red-500' : ''}
                {...register('pincode')}
              />
              {errors.pincode && (
                <p className="text-sm text-red-600">{errors.pincode.message}</p>
              )}
            </div>
          </div>

          {/* Google Maps Placeholder */}
          <div className="space-y-4">
            <Label>Location on Map (Coming Soon)</Label>
            <div className="h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Interactive map will be available soon</p>
                <p className="text-gray-400 text-xs">You'll be able to pinpoint your exact location</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Why do we need your location?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Help customers find your shop easily</li>
                    <li>Enable location-based search and recommendations</li>
                    <li>Calculate delivery distances and charges</li>
                    <li>Show your services to nearby customers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>* Required fields</p>
            <p className="mt-1">
              Make sure your address is accurate as it will be shared with customers for pickups and deliveries.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
