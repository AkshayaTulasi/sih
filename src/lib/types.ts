import { z } from "zod";

export const cropRecommendationSchema = z.object({
  location: z
    .string({ required_error: "Location is required." })
    .min(2, "Location must be at least 2 characters."),
  soilType: z
    .string({ required_error: "Soil type is required." })
    .min(2, "Soil type must be at least 2 characters."),
  weatherConditions: z
    .string({ required_error: "Weather conditions are required." })
    .min(2, "Weather must be at least 2 characters."),
  growingExperience: z.string({
    required_error: "Please select your experience level.",
  }).min(1, "Please select your experience level."),
  preferences: z.string().optional(),
});

export type CropRecommendationFormInput = z.infer<
  typeof cropRecommendationSchema
>;

export const soilHealthSchema = z.object({
  nitrogen: z.coerce.number().min(0, "Nitrogen level must be positive."),
  phosphorus: z.coerce.number().min(0, "Phosphorus level must be positive."),
  potassium: z.coerce.number().min(0, "Potassium level must be positive."),
  ph: z.coerce.number().min(0).max(14, "pH must be between 0 and 14."),
  targetCrop: z.string().min(2, "Target crop must be at least 2 characters."),
});

export type SoilHealthFormInput = z.infer<typeof soilHealthSchema>;

export const communityFormSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters."),
});

export type CommunityFormInput = z.infer<typeof communityFormSchema>;
