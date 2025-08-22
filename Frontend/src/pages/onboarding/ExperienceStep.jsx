import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboarding';
import { experienceSchema } from '../../schemas/onboarding';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Award, Calendar, TrendingUp } from 'lucide-react';

export default function ExperienceStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const { saveDraftMutation } = useOutletContext();

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: formData.experience,
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('experience', value);
      
      // Debounced save to API
      const timeoutId = setTimeout(() => {
        if (isValid) {
          saveDraftMutation.mutate({
            stepKey: 'experience',
            stepData: value,
          });
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, saveDraftMutation, isValid]);

  // Calculate estimated monthly capacity
  const estimatedMonthlyFromWeekly = watchedValues.maxOrdersPerWeek ? Math.floor(watchedValues.maxOrdersPerWeek * 4.3) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Experience & Capacity
          </CardTitle>
          <CardDescription>
            Tell us about your experience and how many orders you can handle. This helps us match you with the right volume of work.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Years of Experience */}
          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                placeholder="0"
                className={`pl-10 ${errors.yearsOfExperience ? 'border-red-500' : ''}`}
                {...register('yearsOfExperience', { valueAsNumber: true })}
              />
            </div>
            {errors.yearsOfExperience && (
              <p className="text-sm text-red-600">{errors.yearsOfExperience.message}</p>
            )}
            <p className="text-sm text-gray-600">
              Include both professional and personal tailoring experience
            </p>
          </div>

          {/* Weekly Capacity */}
          <div className="space-y-2">
            <Label htmlFor="maxOrdersPerWeek">Maximum Orders Per Week *</Label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="maxOrdersPerWeek"
                type="number"
                min="1"
                max="100"
                placeholder="10"
                className={`pl-10 ${errors.maxOrdersPerWeek ? 'border-red-500' : ''}`}
                {...register('maxOrdersPerWeek', { valueAsNumber: true })}
              />
            </div>
            {errors.maxOrdersPerWeek && (
              <p className="text-sm text-red-600">{errors.maxOrdersPerWeek.message}</p>
            )}
            <p className="text-sm text-gray-600">
              Be realistic about your capacity considering your time and resources
            </p>
          </div>

          {/* Monthly Capacity */}
          <div className="space-y-2">
            <Label htmlFor="maxOrdersPerMonth">Maximum Orders Per Month *</Label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="maxOrdersPerMonth"
                type="number"
                min="1"
                max="500"
                placeholder="40"
                className={`pl-10 ${errors.maxOrdersPerMonth ? 'border-red-500' : ''}`}
                {...register('maxOrdersPerMonth', { valueAsNumber: true })}
              />
            </div>
            {errors.maxOrdersPerMonth && (
              <p className="text-sm text-red-600">{errors.maxOrdersPerMonth.message}</p>
            )}
            
            {/* Show calculated estimate if weekly capacity is provided */}
            {watchedValues.maxOrdersPerWeek && estimatedMonthlyFromWeekly > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Based on your weekly capacity ({watchedValues.maxOrdersPerWeek} orders/week), 
                  you could handle approximately <strong>{estimatedMonthlyFromWeekly} orders/month</strong>
                </p>
              </div>
            )}
          </div>

          {/* Experience Level Indicator */}
          {watchedValues.yearsOfExperience >= 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Experience Level</h3>
              <div className="flex items-center gap-2">
                {watchedValues.yearsOfExperience === 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Beginner (0 years) - Great start!</span>
                  </div>
                )}
                {watchedValues.yearsOfExperience > 0 && watchedValues.yearsOfExperience <= 2 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Novice ({watchedValues.yearsOfExperience} years) - Building skills</span>
                  </div>
                )}
                {watchedValues.yearsOfExperience > 2 && watchedValues.yearsOfExperience <= 5 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Experienced ({watchedValues.yearsOfExperience} years) - Skilled professional</span>
                  </div>
                )}
                {watchedValues.yearsOfExperience > 5 && watchedValues.yearsOfExperience <= 10 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Expert ({watchedValues.yearsOfExperience} years) - Highly skilled</span>
                  </div>
                )}
                {watchedValues.yearsOfExperience > 10 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Master ({watchedValues.yearsOfExperience} years) - Industry veteran</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Setting realistic capacity
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Consider time for each garment type (simple vs complex)</li>
                    <li>Account for consultations, fittings, and revisions</li>
                    <li>Leave buffer time for unexpected delays</li>
                    <li>You can adjust these numbers later as you grow</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>* Required fields</p>
            <p className="mt-1">
              Your capacity helps us ensure you're not overwhelmed with orders and can maintain quality work.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
