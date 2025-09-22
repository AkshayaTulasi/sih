'use server';

/**
 * @fileOverview Fetches weather data from OpenWeatherMap API.
 * 
 * @function getWeatherData - The main function to get weather data.
 * @typedef {Object} GetWeatherDataInput - The input type for the getWeatherData function.
 * @typedef {Object} GetWeatherDataOutput - The return type for the getWeatherData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetWeatherDataInputSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

export type GetWeatherDataInput = z.infer<typeof GetWeatherDataInputSchema>;

const WeatherDataSchema = z.object({
    temp: z.number(),
    feels_like: z.number(),
    weather: z.object({
        main: z.string(),
        description: z.string(),
        icon: z.string(),
    }),
    wind_speed: z.number(),
});

const ForecastDataSchema = z.object({
    day: z.string(),
    temp: z.number(),
    weather: z.object({
        main: z.string(),
        icon: z.string(),
    }),
});

const GetWeatherDataOutputSchema = z.object({
    current: WeatherDataSchema,
    forecast: z.array(ForecastDataSchema),
});

export type GetWeatherDataOutput = z.infer<typeof GetWeatherDataOutputSchema>;

export async function getWeatherData(input: GetWeatherDataInput): Promise<GetWeatherDataOutput> {
    return getWeatherDataFlow(input);
}

const getWeatherDataFlow = ai.defineFlow(
    {
        name: 'getWeatherDataFlow',
        inputSchema: GetWeatherDataInputSchema,
        outputSchema: GetWeatherDataOutputSchema,
    },
    async ({ latitude, longitude }) => {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey || apiKey === "YOUR_OPENWEATHER_API_KEY") {
            throw new Error('OpenWeatherMap API key is not configured. Please add it to your .env file.');
        }

        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
        }
        const data = await response.json();

        const current = {
            temp: data.current.temp,
            feels_like: data.current.feels_like,
            weather: {
                main: data.current.weather[0].main,
                description: data.current.weather[0].description,
                icon: data.current.weather[0].icon,
            },
            wind_speed: data.current.wind_speed,
        };

        const forecast = data.daily.slice(1, 6).map((day: any) => {
            return {
                day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                temp: day.temp.day,
                weather: {
                    main: day.weather[0].main,
                    icon: day.weather[0].icon,
                },
            };
        });

        return { current, forecast };
    }
);
