import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboarding';
import { portfolioSchema } from '../../schemas/onboarding';
import { onboardingAPI } from '../../api/onboarding';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

export default function PortfolioStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const { saveDraftMutation } = useOutletContext();
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const {
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(portfolioSchema),
    defaultValues: formData.portfolio,
    mode: 'onChange',
  });

  const portfolioImages = watch('portfolioImages') || [];

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: onboardingAPI.uploadFile,
    onSuccess: (response, file) => {
      const newImage = {
        file: file,
        url: response.data.url,
        name: response.data.fileName,
      };
      
      const currentImages = portfolioImages;
      const updatedImages = [...currentImages, newImage];
      setValue('portfolioImages', updatedImages);
      
      // Remove from uploading state
      setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
    },
    onError: (error, file) => {
      console.error('Upload failed:', error);
      setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
      // You might want to show a toast notification here
    },
  });

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('portfolio', value);
      
      // Debounced save to API
      const timeoutId = setTimeout(() => {
        if (isValid) {
          saveDraftMutation.mutate({
            stepKey: 'portfolio',
            stepData: value,
          });
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, saveDraftMutation, isValid]);

  const handleFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`);
        return false;
      }
      
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }
      
      return true;
    });

    // Check total image limit
    const totalImages = portfolioImages.length + validFiles.length;
    if (totalImages > 10) {
      alert(`Too many images. Maximum 10 images allowed. You currently have ${portfolioImages.length} images.`);
      return;
    }

    // Add to uploading state
    setUploadingFiles(prev => [...prev, ...validFiles]);

    // Upload each file
    validFiles.forEach(file => {
      uploadMutation.mutate(file);
    });
  }, [portfolioImages.length, uploadMutation]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    const updatedImages = portfolioImages.filter((_, i) => i !== index);
    setValue('portfolioImages', updatedImages);
  };

  const canUploadMore = portfolioImages.length < 10;
  const needsMoreImages = portfolioImages.length < 3;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Portfolio Images
          </CardTitle>
          <CardDescription>
            Showcase your best work by uploading 3-10 images of garments you've created. 
            High-quality photos help attract more customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          {canUploadMore && (
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop images here or click to upload
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    JPEG, PNG, WebP up to 5MB each
                  </p>
                </div>
                <Button type="button" variant="outline">
                  Choose Files
                </Button>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Images uploaded: {portfolioImages.length}/10
            </span>
            <div className="flex items-center gap-2">
              {needsMoreImages && (
                <Badge variant="destructive" className="text-xs">
                  Need {3 - portfolioImages.length} more
                </Badge>
              )}
              {portfolioImages.length >= 3 && (
                <Badge variant="secondary" className="text-xs">
                  Minimum met ✓
                </Badge>
              )}
            </div>
          </div>

          {/* Uploading Files */}
          {uploadingFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Uploading...</p>
              {uploadingFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-gray-600">{file.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Image Grid */}
          {portfolioImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Your Portfolio</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolioImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.portfolioImages && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{errors.portfolioImages.message}</p>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Tips for great portfolio photos
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use good lighting - natural light works best</li>
                    <li>Show different types of garments and styles</li>
                    <li>Include close-ups of detailed work (embroidery, stitching)</li>
                    <li>Take photos of finished garments being worn if possible</li>
                    <li>Ensure images are sharp and well-composed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>* Minimum 3 images required, maximum 10 allowed</p>
            <p className="mt-1">
              Your portfolio images will be displayed on your profile to showcase your skills to potential customers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
