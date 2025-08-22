import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboarding';
import { specialtiesSchema } from '../../schemas/onboarding';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Scissors, Plus, X } from 'lucide-react';

const predefinedSpecialties = [
  'Blouse',
  'Salwar Suit',
  'Kurta Pajama',
  'Shirts',
  'Pants',
  'Lehenga',
  'Saree Alteration',
  'Western Dress',
  'Traditional Wear',
  'Formal Wear',
  'Casual Wear',
  'Wedding Outfits',
  'Children\'s Clothing',
  'Embroidery Work',
  'Patching & Repairs',
];

export default function SpecialtiesStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const { saveDraftMutation } = useOutletContext();
  const [customSpecialty, setCustomSpecialty] = useState('');

  const {
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(specialtiesSchema),
    defaultValues: formData.specialties,
    mode: 'onChange',
  });

  const selectedSpecialties = watch('specialties') || [];

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('specialties', value);
      
      // Debounced save to API
      const timeoutId = setTimeout(() => {
        if (isValid) {
          saveDraftMutation.mutate({
            stepKey: 'specialties',
            stepData: value,
          });
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, saveDraftMutation, isValid]);

  const handleSpecialtyToggle = (specialty) => {
    const currentSpecialties = selectedSpecialties;
    const isSelected = currentSpecialties.includes(specialty);
    
    if (isSelected) {
      setValue('specialties', currentSpecialties.filter(s => s !== specialty));
    } else {
      setValue('specialties', [...currentSpecialties, specialty]);
    }
  };

  const handleAddCustomSpecialty = () => {
    if (customSpecialty.trim() && !selectedSpecialties.includes(customSpecialty.trim())) {
      setValue('specialties', [...selectedSpecialties, customSpecialty.trim()]);
      setCustomSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialty) => {
    setValue('specialties', selectedSpecialties.filter(s => s !== specialty));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Your Specialties
          </CardTitle>
          <CardDescription>
            Select the types of clothing and alterations you specialize in. This helps customers find the right tailor for their needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Predefined Specialties Grid */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Your Specialties *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {predefinedSpecialties.map((specialty) => {
                const isSelected = selectedSpecialties.includes(specialty);
                return (
                  <div
                    key={specialty}
                    className={`
                      flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all
                      ${isSelected 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => handleSpecialtyToggle(specialty)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <span className="text-sm font-medium">{specialty}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Specialty Input */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Add Custom Specialty</Label>
            <div className="flex gap-3">
              <Input
                placeholder="Enter your custom specialty"
                value={customSpecialty}
                onChange={(e) => setCustomSpecialty(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSpecialty();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddCustomSpecialty}
                disabled={!customSpecialty.trim()}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Selected Specialties */}
          {selectedSpecialties.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Selected Specialties ({selectedSpecialties.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedSpecialties.map((specialty) => (
                  <Badge
                    key={specialty}
                    variant="secondary"
                    className="flex items-center gap-2 py-2 px-3"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(specialty)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.specialties && (
            <p className="text-sm text-red-600">{errors.specialties.message}</p>
          )}

          {/* Guidelines */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Scissors className="h-5 w-5 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Tips for choosing specialties
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Select only services you can confidently deliver</li>
                    <li>Consider your experience level and available tools</li>
                    <li>You can always update these later as you expand</li>
                    <li>More specialties = more customer opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>* Select at least one specialty</p>
            <p className="mt-1">
              Your specialties will be displayed on your profile and used to match you with relevant customer requests.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
