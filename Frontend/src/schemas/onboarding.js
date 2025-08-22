import { z } from 'zod';

// Step 1: Basic Info Schema
export const basicInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(50, "Full name must be less than 50 characters"),
  shopName: z.string().min(2, "Shop name must be at least 2 characters").max(100, "Shop name must be less than 100 characters"),
  phone: z.string().regex(/^[+]?[1-9][\d]{9,14}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  whatsappSameAsPhone: z.boolean().default(true),
  whatsappNumber: z.string().optional(),
}).refine(data => {
  if (!data.whatsappSameAsPhone && !data.whatsappNumber) {
    return false;
  }
  if (!data.whatsappSameAsPhone && data.whatsappNumber) {
    return /^[+]?[1-9][\d]{9,14}$/.test(data.whatsappNumber);
  }
  return true;
}, {
  message: "Please provide a valid WhatsApp number",
  path: ["whatsappNumber"],
});

// Step 2: Location Schema
export const locationSchema = z.object({
  address1: z.string().min(10, "Address must be at least 10 characters").max(200, "Address too long"),
  address2: z.string().max(200, "Address too long").optional(),
  city: z.string().min(2, "City name must be at least 2 characters").max(50, "City name too long"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit pincode"),
});

// Step 3: Specialties Schema
export const specialtiesSchema = z.object({
  specialties: z.array(z.string()).min(1, "Please select at least one specialty"),
  customSpecialty: z.string().max(50, "Custom specialty too long").optional(),
});

// Step 4: Experience & Capacity Schema
export const experienceSchema = z.object({
  yearsOfExperience: z.number().int().min(0, "Experience cannot be negative").max(50, "Experience seems too high"),
  maxOrdersPerWeek: z.number().int().min(1, "Must handle at least 1 order per week").max(100, "Maximum 100 orders per week"),
  maxOrdersPerMonth: z.number().int().min(1, "Must handle at least 1 order per month").max(500, "Maximum 500 orders per month"),
});

// Step 5: Portfolio Schema
export const portfolioSchema = z.object({
  portfolioImages: z.array(z.object({
    file: z.any(),
    url: z.string(),
    name: z.string(),
  })).min(3, "Please upload at least 3 portfolio images").max(10, "Maximum 10 images allowed"),
});

// Step 6: Service Details Schema
export const serviceDetailsSchema = z.object({
  priceMin: z.number().int().min(1, "Minimum price must be at least ₹1"),
  priceMax: z.number().int().min(1, "Maximum price must be at least ₹1"),
  turnaroundTime: z.number().int().min(1, "Turnaround time must be at least 1 day").max(60, "Maximum 60 days"),
  homePickup: z.boolean().default(false),
  homeDelivery: z.boolean().default(false),
}).refine(data => data.priceMin <= data.priceMax, {
  message: "Maximum price cannot be less than minimum price",
  path: ["priceMax"],
});

// Step 7: Identity Verification Schema
export const identitySchema = z.object({
  idType: z.enum(["aadhaar", "voter", "other"], {
    required_error: "Please select an ID type",
  }),
  idFront: z.object({
    file: z.any(),
    url: z.string(),
    name: z.string(),
  }).optional(),
  idBack: z.object({
    file: z.any(),
    url: z.string(),
    name: z.string(),
  }).optional(),
}).refine(data => data.idFront && data.idBack, {
  message: "Please upload both front and back images of your ID",
  path: ["idBack"],
});

// Step 8: Bank/UPI Details Schema
export const payoutSchema = z.object({
  paymentMethod: z.enum(["bank", "upi"]),
  // Bank details
  accountHolderName: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  // UPI details
  upiId: z.string().optional(),
}).refine(data => {
  if (data.paymentMethod === "bank") {
    return data.accountHolderName && 
           data.bankName && 
           data.accountNumber && 
           data.ifscCode && 
           /^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode);
  } else if (data.paymentMethod === "upi") {
    return data.upiId && /^[\w.-]+@[\w.-]+$/.test(data.upiId);
  }
  return false;
}, {
  message: "Please provide valid payment details",
  path: ["upiId"],
});

// Step 9: Review & Terms Schema
export const reviewSchema = z.object({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Master schema combining all steps
export const onboardingSchema = z.object({
  basicInfo: basicInfoSchema,
  location: locationSchema,
  specialties: specialtiesSchema,
  experience: experienceSchema,
  portfolio: portfolioSchema,
  serviceDetails: serviceDetailsSchema,
  identity: identitySchema,
  payout: payoutSchema,
  review: reviewSchema,
});

// Default values for each step
export const defaultValues = {
  basicInfo: {
    fullName: "",
    shopName: "",
    phone: "",
    email: "",
    whatsappSameAsPhone: true,
    whatsappNumber: "",
  },
  location: {
    address1: "",
    address2: "",
    city: "",
    pincode: "",
  },
  specialties: {
    specialties: [],
    customSpecialty: "",
  },
  experience: {
    yearsOfExperience: 0,
    maxOrdersPerWeek: 1,
    maxOrdersPerMonth: 1,
  },
  portfolio: {
    portfolioImages: [],
  },
  serviceDetails: {
    priceMin: 100,
    priceMax: 1000,
    turnaroundTime: 7,
    homePickup: false,
    homeDelivery: false,
  },
  identity: {
    idType: "aadhaar",
    idFront: null,
    idBack: null,
  },
  payout: {
    paymentMethod: "bank",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  },
  review: {
    acceptTerms: false,
  },
};
