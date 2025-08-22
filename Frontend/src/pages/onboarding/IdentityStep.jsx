import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboarding';
import { identitySchema } from '../../schemas/onboarding';
import { onboardingAPI } from '../../api/onboarding';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Shield, Upload, X, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

const idTypes = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'voter', label: 'Voter ID' },
  { value: 'other', label: 'Other Government ID' },
];

export default function IdentityStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const { saveDraftMutation } = useOutletContext();
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);

  const {
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(identitySchema),
    defaultValues: formData.identity,
    mode: 'onChange',
  });

  const watchedValues = watch();

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: onboardingAPI.uploadFile,
  });

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('identity', value);
      
      // Debounced save to API
      const timeoutId = setTimeout(() => {
        if (isValid) {
          saveDraftMutation.mutate({
            stepKey: 'identity',
            stepData: value,
          });
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, saveDraftMutation, isValid]);

  const handleFileUpload = async (file, side) => {
    if (side === 'front') setUploadingFront(true);
    else setUploadingBack(true);

    try {
      const response = await uploadMutation.mutateAsync(file);
      const fileData = {
        file: file,
        url: response.data.url,
        name: response.data.fileName,
      };
      
      setValue(side === 'front' ? 'idFront' : 'idBack', fileData);
    } catch (error) {
      console.error('Upload failed:', error);
      // You might want to show a toast notification here
    } finally {
      if (side === 'front') setUploadingFront(false);
      else setUploadingBack(false);
    }
  };

  const FileUploadArea = ({ side, title, file, uploading }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{title} *</Label>
      
      {!file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (selectedFile) {
                handleFileUpload(selectedFile, side);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-900 font-medium">Click to upload {title.toLowerCase()}</p>
              <p className="text-xs text-gray-500">JPEG, PNG, WebP up to 5MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <img
            src={file.url}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setValue(side === 'front' ? 'idFront' : 'idBack', null)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-green-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Uploaded
            </Badge>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Identity Verification
          </CardTitle>
          <CardDescription>
            Upload your government-issued ID for verification. This helps build trust with customers and ensures platform security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ID Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select ID Type *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {idTypes.map((type) => {
                const isSelected = watchedValues.idType === type.value;
                return (
                  <div
                    key={type.value}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-all text-center
                      ${isSelected 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setValue('idType', type.value)}
                  >
                    <span className="font-medium">{type.label}</span>
                  </div>
                );
              })}
            </div>
            {errors.idType && (
              <p className="text-sm text-red-600">{errors.idType.message}</p>
            )}
          </div>

          {/* File Upload Areas */}
          {watchedValues.idType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadArea
                side="front"
                title="ID Front Side"
                file={watchedValues.idFront}
                uploading={uploadingFront}
              />
              
              <FileUploadArea
                side="back"
                title="ID Back Side"
                file={watchedValues.idBack}
                uploading={uploadingBack}
              />
            </div>
          )}

          {/* Error Messages */}
          {errors.idFront && (
            <p className="text-sm text-red-600">{errors.idFront.message}</p>
          )}
          {errors.idBack && (
            <p className="text-sm text-red-600">{errors.idBack.message}</p>
          )}

          {/* Verification Status */}
          {watchedValues.idFront && watchedValues.idBack && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Identity documents uploaded successfully
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your documents will be verified within 24-48 hours. You'll receive an email confirmation once approved.
              </p>
            </div>
          )}

          {/* Security Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Your data is secure
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>All documents are encrypted and stored securely</li>
                    <li>Only used for identity verification purposes</li>
                    <li>Not shared with third parties</li>
                    <li>Comply with data protection regulations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Guidelines */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Upload className="h-5 w-5 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Photo guidelines
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure all text and details are clearly visible</li>
                    <li>Take photos in good lighting</li>
                    <li>Avoid shadows, glare, or reflections</li>
                    <li>Include the entire document in the frame</li>
                    <li>Make sure the image is sharp and not blurry</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>* Required fields</p>
            <p className="mt-1">
              Identity verification is mandatory for all tailors to ensure customer trust and platform security.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
