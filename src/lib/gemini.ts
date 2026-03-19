import { GoogleGenAI } from "@google/genai";
import { Trip } from "../types";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function generateTrip(params: {
  destination: string;
  budget: number;
  currency: string;
  days: number;
  tourist_type: string[];
  language: 'it' | 'en';
}): Promise<Trip> {
  if (!API_KEY) {
    throw new Error("Gemini API key is missing. Please add it to your secrets.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const systemPrompt = `
    Sei un esperto pianificatore di viaggi. Rispondi SEMPRE e SOLO con un oggetto JSON valido, senza markdown, senza testo aggiuntivo.
    Rispetta rigorosamente il budget indicato dall'utente.
    Adatta il tono e le attività al tipo di turista specificato.
    Includi sempre le coordinate GPS reali e verificate di ogni tappa.
    Rispondi nella lingua specificata nel parametro 'language'.
  `;

  const userPrompt = `
    Crea un itinerario di viaggio con questi parametri:
    - Destinazione: ${params.destination}
    - Budget totale: ${params.budget} ${params.currency}
    - Durata: ${params.days} giorni
    - Tipo di turista: ${params.tourist_type.join(", ")}
    - Lingua risposta: ${params.language === 'it' ? 'Italiano' : 'English'}
    
    Rispondi con questo schema JSON esatto:
    { 
      "trip_title": string, 
      "destination": string, 
      "summary": string,
      "budget_breakdown": { 
        "accommodation": number, 
        "transport": number,
        "food": number, 
        "activities": number, 
        "extra": number, 
        "total": number 
      },
      "days": [ 
        { 
          "day": number, 
          "title": string,
          "activities": [ 
            { 
              "name": string, 
              "description": string,
              "time": string, 
              "cost": number, 
              "lat": number, 
              "lng": number 
            } 
          ] 
        } 
      ],
      "practical_tips": [string], 
      "budget_alert": string | null 
    }
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const responseText = result.text;
    if (!responseText) throw new Error("Empty response from Gemini");
    const tripData = JSON.parse(responseText);
    
    return {
      ...tripData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      params
    };
  } catch (error) {
    console.error("Error generating trip:", error);
    throw error;
  }
}
