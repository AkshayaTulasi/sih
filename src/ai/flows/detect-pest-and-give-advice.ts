'use server';
/**
 * @fileOverview Detects pests and diseases in plant images and provides advice.
 *
 * - detectPestAndGiveAdvice - A function that handles the pest/disease detection and advice process.
 * - DetectPestAndGiveAdviceInput - The input type for the detectPestAndGiveAdvice function.
 * - DetectPestAndGiveAdviceOutput - The return type for the detectPestAndGiveAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectPestAndGiveAdviceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().optional().describe('The language to respond in. e.g., en, hi, bn, te')
});
export type DetectPestAndGiveAdviceInput = z.infer<typeof DetectPestAndGiveAdviceInputSchema>;

const DetectPestAndGiveAdviceOutputSchema = z.object({
  pestOrDisease: z.string().describe('The identified pest or disease.'),
  advice: z.string().describe('Specific advice on how to deal with the pest or disease.'),
});
export type DetectPestAndGiveAdviceOutput = z.infer<typeof DetectPestAndGiveAdviceOutputSchema>;

export async function detectPestAndGiveAdvice(
  input: DetectPestAndGiveAdviceInput
): Promise<DetectPestAndGiveAdviceOutput> {
  return detectPestAndGiveAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectPestAndGiveAdvicePrompt',
  input: {schema: DetectPestAndGiveAdviceInputSchema},
  output: {schema: DetectPestAndGiveAdviceOutputSchema},
  prompt: `You are an expert in plant diseases and pests. A farmer has uploaded an image of a plant, and you need to identify the pest or disease affecting the plant and provide advice on how to deal with it.
  {{#if language}}
  Your response must be in the following language: {{language}}
  {{/if}}

  Analyze the following image and provide your analysis:
  {{media url=photoDataUri}}
  `,
});

const detectPestAndGiveAdviceFlow = ai.defineFlow(
  {
    name: 'detectPestAndGiveAdviceFlow',
    inputSchema: DetectPestAndGiveAdviceInputSchema,
    outputSchema: DetectPestAndGiveAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
