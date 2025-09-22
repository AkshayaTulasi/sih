'use server';

/**
 * @fileOverview Provides AI-powered, location-aware market price information.
 *
 * @function getMarketPrices - The main function to get market prices.
 * @typedef {Object} GetMarketPricesInput - The input type for the getMarketPrices function.
 * @typedef {Object} GetMarketPricesOutput - The return type for the getMarketPrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMarketPricesInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user.'),
  longitude: z.number().describe('The longitude of the user.'),
  language: z.string().optional().describe('The language to respond in. e.g., en, hi, bn, te'),
});

export type GetMarketPricesInput = z.infer<typeof GetMarketPricesInputSchema>;

const CropPriceSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  price: z.number().describe('The current market price per quintal.'),
  change: z.number().describe('The percentage change in price from the previous day.'),
  location: z.string().describe('The name of the market or city where this price is available.'),
});

const GetMarketPricesOutputSchema = z.object({
  marketData: z.array(CropPriceSchema).describe('A list of crop prices for nearby markets.'),
});

export type GetMarketPricesOutput = z.infer<typeof GetMarketPricesOutputSchema>;

export async function getMarketPrices(input: GetMarketPricesInput): Promise<GetMarketPricesOutput> {
  return getMarketPricesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getMarketPricesPrompt',
  input: {
    schema: GetMarketPricesInputSchema,
  },
  output: {
    schema: GetMarketPricesOutputSchema,
  },
  prompt: `You are an agricultural market analyst. Your task is to provide a list of simulated but realistic market prices for 5 common agricultural commodities in markets near the provided location.

  The user is at latitude: {{{latitude}}} and longitude: {{{longitude}}}.
  
  {{#if language}}
  The crop names and locations in your response should be appropriate for the region and the response should be in the following language: {{language}}
  {{else}}
  The crop names and locations in your response should be appropriate for the region.
  {{/if}}

  Generate a list of 5 crops with their current price per quintal, the percentage change from yesterday (can be positive, negative, or zero), and the market location. The locations should be real towns or cities near the user's coordinates. The prices and changes should be realistic for today's market.
  `, 
});

const getMarketPricesFlow = ai.defineFlow(
  {
    name: 'getMarketPricesFlow',
    inputSchema: GetMarketPricesInputSchema,
    outputSchema: GetMarketPricesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
