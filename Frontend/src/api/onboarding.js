// Mock API functions for onboarding
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate API responses
const mockResponse = (data, success = true, delay_ms = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({ data, success: true });
      } else {
        reject(new Error('API Error'));
      }
    }, delay_ms);
  });
};

export const onboardingAPI = {
  // Create a new draft
  createDraft: async (initialData = {}) => {
    await delay(1000);
    const draftId = 'draft_' + Date.now();
    return mockResponse({
      id: draftId,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: initialData,
    });
  },

  // Save step data to draft
  saveDraft: async (draftId, stepKey, stepData) => {
    await delay(800);
    return mockResponse({
      id: draftId,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      stepKey,
      stepData,
    });
  },

  // Submit final onboarding
  submitOnboarding: async (draftId, completeData) => {
    await delay(2000);
    
    // Simulate validation
    const requiredFields = [
      'basicInfo', 'location', 'specialties', 'experience', 
      'portfolio', 'serviceDetails', 'identity', 'payout', 'review'
    ];
    
    const missingFields = requiredFields.filter(field => !completeData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (!completeData.review.acceptTerms) {
      throw new Error('Terms and conditions must be accepted');
    }

    return mockResponse({
      id: 'tailor_' + Date.now(),
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      draftId,
      message: 'Your onboarding application has been submitted successfully! We will review it and get back to you within 2-3 business days.',
    });
  },

  // Get draft by ID
  getDraft: async (draftId) => {
    await delay(500);
    return mockResponse({
      id: draftId,
      status: 'draft',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date().toISOString(),
      data: {}, // This would contain the saved form data
    });
  },

  // Upload file (for portfolio and identity images)
  uploadFile: async (file) => {
    await delay(1500);
    
    // Simulate file validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum 5MB allowed.');
    }

    // Simulate S3 upload
    const fileName = `uploads/${Date.now()}_${file.name}`;
    const url = `https://mock-s3-bucket.amazonaws.com/${fileName}`;

    return mockResponse({
      fileName,
      url,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    });
  },
};
