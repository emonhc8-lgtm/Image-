import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 * 
 * @param base64Image The base64 encoded string of the original image (without data URI prefix).
 * @param mimeType The mime type of the image (e.g., 'image/png', 'image/jpeg').
 * @param prompt The user's text instruction for editing.
 * @returns The base64 string of the generated image.
 */
export const generateEditedImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      // Optional: configuration specifically for image generation/editing if needed
      // but standard generateContent works for Nano Banana series as per docs.
    });

    // Iterate through parts to find the image part
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated from the model.");
    }

    let generatedImageBase64 = '';

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break; 
      }
    }

    if (!generatedImageBase64) {
      // Sometimes the model might refuse and return text explaining why
      const textPart = parts.find(p => p.text);
      if (textPart && textPart.text) {
        throw new Error(`Model response: ${textPart.text}`);
      }
      throw new Error("No image data found in the response.");
    }

    return generatedImageBase64;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to edit image using Gemini.");
  }
};
