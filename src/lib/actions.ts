"use server";

import {
  detectPestAndGiveAdvice,
  type DetectPestAndGiveAdviceInput,
  type DetectPestAndGiveAdviceOutput,
} from "@/ai/flows/detect-pest-and-give-advice";
import {
  generateCropRecommendation,
  type GenerateCropRecommendationInput,
  type GenerateCropRecommendationOutput,
} from "@/ai/flows/generate-crop-recommendation";
import { z } from "zod";

const cropRecommendationActionSchema = z.object({
  location: z.string(),
  soilType: z.string(),
  weatherConditions: z.string(),
  growingExperience: z.string(),
  preferences: z.string().optional(),
});

export async function getCropRecommendation(
  input: GenerateCropRecommendationInput
): Promise<{
  success: boolean;
  data?: GenerateCropRecommendationOutput;
  error?: string;
}> {
  const parsed = cropRecommendationActionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input." };
  }
  try {
    const result = await generateCropRecommendation(parsed.data);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to get recommendation from AI." };
  }
}

const pestAnalysisActionSchema = z.object({
  photoDataUri: z.string(),
});

export async function getPestAnalysis(
  input: DetectPestAndGiveAdviceInput
): Promise<{
  success: boolean;
  data?: DetectPestAndGiveAdviceOutput;
  error?: string;
}> {
  const parsed = pestAnalysisActionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input." };
  }
  try {
    const result = await detectPestAndGiveAdvice(parsed.data);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to analyze image with AI." };
  }
}
