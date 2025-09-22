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
