import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sendMessageToGemini(message: string): Promise<string> {
  const baseUrl = import.meta.env.VITE_GEMINI_BASE_URL;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error('Gemini API base URL or API key is missing');
  }
  const url = `${baseUrl}?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [
          { text: message }
        ]
      }
    ]
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }
    const data = await res.json();
    // The response structure may vary; adjust as needed
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return aiText;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return `Error: ${err.message}`;
    }
    return 'Unknown error occurred';
  }
}
