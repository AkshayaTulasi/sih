'use server';

/**
 * @fileOverview Provides AI-powered fertilizer recommendations based on soil health.
 *
 * @function getFertilizerRecommendation - The main function to generate fertilizer recommendations.
 * @typedef {Object} GetFertilizerRecommendationInput - The input type for the getFertilizerRecommendation function.
 * @typedef {Object} GetFertilizerRecommendationOutput - The return type for the getFertilizerRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetFertilizerRecommendationInputSchema = z.object({
  nitrogen: z.number().describe('The nitrogen level in the soil in ppm.'),
  phosphorus: z.number().describe('The phosphorus level in the soil in ppm.'),
  potassium: z.number().describe('The potassium level in the soil in ppm.'),
  ph: z.number().describe('The pH level of the soil.'),
  targetCrop: z.string().describe('The crop being grown.'),
  language: z.string().optional().describe('The language to respond in. e.g., en, hi, bn, te')
});

export type GetFertilizerRecommendationInput = z.infer<typeof GetFertilizerRecommendationInputSchema>;

const GetFertilizerRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('The fertilizer recommendation.'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
});

export type GetFertilizerRecommendationOutput = z.infer<typeof GetFertilizerRecommendationOutputSchema>;

export async function getFertilizerRecommendation(input: GetFertilizerRecommendationInput): Promise<GetFertilizerRecommendationOutput> {
  return getFertilizerRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFertilizerRecommendationPrompt',
  input: {
    schema: GetFertilizerRecommendationInputSchema,
  },
  output: {
    schema: GetFertilizerRecommendationOutputSchema,
  },
  prompt: `You are an expert agricultural advisor specializing in soil health and fertilization.
  {{#if language}}
  Your response must be in the following language: {{language}}
  {{/if}}

  Based on the following soil analysis report and target crop, provide a detailed fertilizer recommendation.

  Soil Analysis:
  - Nitrogen (N): {{{nitrogen}}} ppm
  - Phosphorus (P): {{{phosphorus}}} ppm
  - Potassium (K): {{{potassium}}} ppm
  - pH: {{{ph}}}

  Target Crop: {{{targetCrop}}}

  Provide a specific recommendation for N-P-K fertilizer ratios, application rates, and timing. Also, suggest any soil amendments if the pH is not optimal for the target crop. Explain your reasoning clearly.
  `, 
});

const getFertilizerRecommendationFlow = ai.defineFlow(
  {
    name: 'getFertilizerRecommendationFlow',
    inputSchema: GetFertilizerRecommendationInputSchema,
    outputSchema: GetFertilizerRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
